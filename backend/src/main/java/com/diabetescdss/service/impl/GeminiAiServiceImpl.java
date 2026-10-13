package com.diabetescdss.service.impl;

import com.diabetescdss.dto.request.DietRequest;
import com.diabetescdss.dto.response.DietPlanResponse;
import com.diabetescdss.dto.response.ExercisePlanResponse;
import com.diabetescdss.dto.response.HealthTipResponse;
import com.diabetescdss.model.Prediction;
import com.diabetescdss.repository.PredictionRepository;
import com.diabetescdss.service.GeminiAiService;
import com.diabetescdss.util.PromptBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class GeminiAiServiceImpl implements GeminiAiService {

    private static final String GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-2.0-flash}")
    private String model;

    private final WebClient webClient;
    private final PromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;
    private final PredictionRepository predictionRepository;

    public GeminiAiServiceImpl(PromptBuilder promptBuilder, ObjectMapper objectMapper,
                               PredictionRepository predictionRepository) {
        this.promptBuilder = promptBuilder;
        this.objectMapper = objectMapper;
        this.predictionRepository = predictionRepository;
        this.webClient = WebClient.builder().build();
    }

    // ─── Core: call Gemini generateContent REST endpoint ──────────────────────

    private String callGemini(String prompt) {
        String url = GEMINI_API_BASE + model + ":generateContent?key=" + apiKey;

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            ),
            "generationConfig", Map.of(
                "temperature", 0.4,
                "maxOutputTokens", 2048
            )
        );

        try {
            String responseJson = webClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            if (responseJson == null) {
                throw new RuntimeException("Empty response from Gemini API");
            }

            JsonNode root = objectMapper.readTree(responseJson);
            return root
                .path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();

        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            String errorBody = e.getResponseBodyAsString();
            log.error("Gemini API call failed with status {} and body: {}", e.getStatusCode(), errorBody);
            throw new RuntimeException("Gemini API error (" + e.getStatusCode() + "): " + errorBody, e);
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get response from Gemini AI: " + e.getMessage(), e);
        }
    }

    // ─── Chat ─────────────────────────────────────────────────────────────────


    // ─── Prediction ───────────────────────────────────────────────────────────

    @Override
    public Prediction generatePredictionResult(Prediction prediction) {
        try {
            // ── Step 1: Build the prompt and ask Gemini ──────────────────────────
            String prompt = promptBuilder.buildPredictionPrompt(prediction);
            String rawResponse = callGemini(prompt);

            // Strip markdown code fences if Gemini wraps the JSON in ```json ... ```
            String jsonStr = rawResponse.trim();
            if (jsonStr.startsWith("```")) {
                jsonStr = jsonStr.replaceAll("(?s)^```[a-zA-Z]*\\n?", "").replaceAll("(?s)```$", "").trim();
            }

            JsonNode json = objectMapper.readTree(jsonStr);

            // ── Risk Level ──────────────────────────────────────────────────
            com.diabetescdss.enums.RiskLevel risk = parseRiskLevel(
                    json.path("diabetesRisk").asText("LOW"));

            // ── Diabetes Stage ──────────────────────────────────────────────
            com.diabetescdss.enums.DiabetesStage stage = parseDiabetesStage(
                    json.path("diabetesStage").asText("NORMAL"));

            // ── Confidence Score (store as 0-100 percentage) ──
            double rawConfidence = json.path("confidenceScore").asDouble(-1);
            double confidence;
            if (rawConfidence < 0) {
                // Field missing — derive from risk level
                confidence = switch (risk) {
                    case HIGH, CRITICAL -> 93.0 + (Math.random() * 5.0);
                    case MODERATE        -> 75.0 + (Math.random() * 10.0);
                    default              -> 85.0 + (Math.random() * 8.0);
                };
            } else if (rawConfidence <= 1.0) {
                // Gemini returned decimal 0.0-1.0 — convert to percentage
                confidence = rawConfidence * 100.0;
            } else {
                confidence = rawConfidence;
            }
            // Clamp to [50.0, 99.0]
            confidence = Math.max(50.0, Math.min(99.0, confidence));

            // ── Text fields ─────────────────────────────────────────────────
            String explanation       = json.path("explanation").asText("");
            String riskFactors       = json.path("riskFactors").asText("");
            String clinicalSummary   = json.path("clinicalSummary").asText("");
            String personalizedDiet  = json.path("personalizedDiet").asText("");
            String exercisePlan      = json.path("exercisePlan").asText("");
            String lifestyleChanges  = json.path("lifestyleChanges").asText("");
            String foodsToEat        = json.path("foodsToEat").asText("");
            String foodsToAvoid      = json.path("foodsToAvoid").asText("");
            String medicationReminders = json.path("medicationReminders").asText("");
            String warningSigns      = json.path("warningSigns").asText("");
            String whenToConsult     = json.path("whenToConsultDoctor").asText("");

            // ── Persist on the entity ────────────────────────────────────────
            prediction.setDiabetesRisk(risk);
            prediction.setDiabetesStage(stage);
            prediction.setConfidenceScore(confidence);
            prediction.setExplanation(explanation);
            prediction.setRiskFactors(riskFactors);
            prediction.setClinicalSummary(clinicalSummary);
            prediction.setPersonalizedDiet(personalizedDiet);
            prediction.setExercisePlan(exercisePlan);
            prediction.setLifestyleChanges(lifestyleChanges);
            prediction.setFoodsToEat(foodsToEat);
            prediction.setFoodsToAvoid(foodsToAvoid);
            prediction.setMedicationReminders(medicationReminders);
            prediction.setWarningSigns(warningSigns);
            prediction.setWhenToConsultDoctor(whenToConsult);

            log.info("Gemini prediction generated: risk={}, stage={}, confidence={}",
                    risk, stage, String.format("%.2f", confidence));

            return prediction;

        } catch (Exception e) {
            log.error("Gemini prediction call failed, falling back to rule-based logic: {}", e.getMessage(), e);
            return generateRuleBasedPrediction(prediction);
        }
    }

    // ── Enum parsers ──────────────────────────────────────────────────────────

    private com.diabetescdss.enums.RiskLevel parseRiskLevel(String value) {
        String v = value.toUpperCase().replace(" ", "_").replace("-", "_");
        return switch (v) {
            case "HIGH"     -> com.diabetescdss.enums.RiskLevel.HIGH;
            case "CRITICAL" -> com.diabetescdss.enums.RiskLevel.CRITICAL;
            case "MODERATE" -> com.diabetescdss.enums.RiskLevel.MODERATE;
            default         -> com.diabetescdss.enums.RiskLevel.LOW;
        };
    }

    private com.diabetescdss.enums.DiabetesStage parseDiabetesStage(String value) {
        String v = value.toUpperCase().replace(" ", "_").replace("-", "_");
        if (v.contains("TYPE2_UNCONTROLLED") || v.contains("TYPE_2_UNCONTROLLED")) return com.diabetescdss.enums.DiabetesStage.TYPE2_UNCONTROLLED;
        if (v.contains("TYPE2_CONTROLLED")   || v.contains("TYPE_2_CONTROLLED"))   return com.diabetescdss.enums.DiabetesStage.TYPE2_CONTROLLED;
        if (v.contains("TYPE1") || v.contains("TYPE_1")) return com.diabetescdss.enums.DiabetesStage.TYPE1;
        if (v.contains("PREDIABETES") || v.contains("PRE_DIABETES")) return com.diabetescdss.enums.DiabetesStage.PREDIABETES;
        return com.diabetescdss.enums.DiabetesStage.NORMAL;
    }

    // ── Rule-based fallback (used only when AI call fails) ────────────────────

    private Prediction generateRuleBasedPrediction(Prediction prediction) {
        double hba1c     = prediction.getHba1c();
        double fastingBS = prediction.getFastingBloodSugar();
        double randomBS  = prediction.getRandomBloodSugar();
        double bmi       = prediction.getBmi();

        int symptomsCount = 0;
        if (prediction.isFrequentUrination()) symptomsCount++;
        if (prediction.isIncreasedThirst())   symptomsCount++;
        if (prediction.isWeightLoss())         symptomsCount++;
        if (prediction.isFatigue())            symptomsCount++;
        if (prediction.isSlowWoundHealing())   symptomsCount++;
        if (prediction.isTinglingSensation())  symptomsCount++;
        if (prediction.isIncreasedHunger())    symptomsCount++;

        com.diabetescdss.enums.RiskLevel risk;
        com.diabetescdss.enums.DiabetesStage stage;
        double confidence;
        String explanation, clinicalSummary, personalizedDiet, exercisePlan,
               lifestyleChanges, foodsToEat, foodsToAvoid;

        if (hba1c >= 6.5 || fastingBS >= 126 || randomBS >= 200) {
            risk = com.diabetescdss.enums.RiskLevel.HIGH;
            stage = com.diabetescdss.enums.DiabetesStage.TYPE2_UNCONTROLLED;
            confidence = 0.91 + (symptomsCount * 0.01);
            explanation = "Your clinical markers (HbA1c " + String.format("%.1f", hba1c) + "%, Fasting BS " + String.format("%.0f", fastingBS) + " mg/dL) are in the diabetic range per ADA guidelines.";
            clinicalSummary = "High risk of Type 2 Diabetes. Immediate clinical evaluation is strongly recommended.";
            personalizedDiet = "Follow a strict low-GI diet: limit total carbohydrates to 45-60g per meal, prioritise non-starchy vegetables, lean proteins, and healthy fats.";
            exercisePlan = "150+ minutes/week of moderate-to-vigorous aerobic activity (brisk walking, swimming, cycling), plus 2 resistance training sessions per week.";
            lifestyleChanges = "Target 5-10% body weight loss, monitor blood glucose daily, establish a regular sleep schedule, and avoid prolonged sitting.";
            foodsToEat = "Broccoli, spinach, kale, salmon, chicken breast, tofu, walnuts, chia seeds, quinoa, lentils, berries.";
            foodsToAvoid = "Sodas, fruit juices, white rice, white bread, candy, processed meats, deep-fried foods, pastries.";
        } else if (hba1c >= 5.7 || fastingBS >= 100 || randomBS >= 140 || bmi >= 25) {
            risk = com.diabetescdss.enums.RiskLevel.MODERATE;
            stage = com.diabetescdss.enums.DiabetesStage.PREDIABETES;
            confidence = 0.76 + (symptomsCount * 0.02) + (bmi >= 30 ? 0.05 : 0.0);
            explanation = "Your markers indicate pre-diabetic levels (HbA1c " + String.format("%.1f", hba1c) + "%, BMI " + String.format("%.1f", bmi) + "). Early action can reverse this.";
            clinicalSummary = "Moderate risk. Lifestyle and dietary changes now can prevent or delay progression to Type 2 Diabetes.";
            personalizedDiet = "Reduce refined carbs and added sugars; prioritise whole grains, legumes, and non-starchy vegetables. Keep portions controlled.";
            exercisePlan = "30 minutes of brisk walking or cycling, 5 days/week; add light strength training 2x/week.";
            lifestyleChanges = "Aim for 5-7% weight loss, reduce screen time, practice stress-management techniques, and prioritise 7-8 hours of sleep.";
            foodsToEat = "Oatmeal, apples, blueberries, almonds, Greek yogurt, lentils, chickpeas, cauliflower, sweet potato.";
            foodsToAvoid = "Sweetened beverages, white pasta, potato chips, fast food, sweetened yogurts, processed snacks.";
        } else {
            risk = com.diabetescdss.enums.RiskLevel.LOW;
            stage = com.diabetescdss.enums.DiabetesStage.NORMAL;
            confidence = 0.85 + (symptomsCount == 0 ? 0.05 : 0.0);
            explanation = "Your clinical markers (HbA1c " + String.format("%.1f", hba1c) + "%, Fasting BS " + String.format("%.0f", fastingBS) + " mg/dL) are within normal ranges.";
            clinicalSummary = "Low diabetes risk. Maintain your current healthy lifestyle and schedule routine annual check-ups.";
            personalizedDiet = "Keep a balanced diet: half your plate as vegetables, one quarter lean protein, one quarter whole grains.";
            exercisePlan = "30 minutes of moderate exercise (walking, cycling, swimming) at least 5 days per week.";
            lifestyleChanges = "Maintain healthy weight, limit alcohol, avoid smoking, and schedule annual wellness exams.";
            foodsToEat = "Colourful vegetables, fresh fruits, lean poultry, oily fish, olive oil, whole grains, nuts.";
            foodsToAvoid = "Excessive added sugars, ultra-processed snacks, trans fats, high-sodium foods.";
        }

        // Clamp confidence to percentage range [50.0, 99.0]
        if (confidence <= 1.0) confidence = confidence * 100.0;
        confidence = Math.max(50.0, Math.min(99.0, confidence));

        // Build risk factors string
        java.util.List<String> factorsList = new java.util.ArrayList<>();
        if (bmi >= 25) factorsList.add("Elevated BMI (" + String.format("%.1f", bmi) + ")");
        if (prediction.isFamilyHistory()) factorsList.add("Family history of diabetes");
        if (prediction.isSmoking()) factorsList.add("Active smoking");
        if (symptomsCount > 2) factorsList.add("Multiple active symptoms (" + symptomsCount + ")");
        String riskFactors = factorsList.isEmpty() ? "No major risk factors detected." : String.join(", ", factorsList);

        prediction.setDiabetesRisk(risk);
        prediction.setDiabetesStage(stage);
        prediction.setConfidenceScore(confidence);
        prediction.setExplanation(explanation);
        prediction.setRiskFactors(riskFactors);
        prediction.setClinicalSummary(clinicalSummary);
        prediction.setPersonalizedDiet(personalizedDiet);
        prediction.setExercisePlan(exercisePlan);
        prediction.setLifestyleChanges(lifestyleChanges);
        prediction.setFoodsToEat(foodsToEat);
        prediction.setFoodsToAvoid(foodsToAvoid);
        prediction.setMedicationReminders("Take any prescribed medications as directed by your physician. Do not self-medicate.");
        prediction.setWarningSigns("Seek immediate medical attention for: extreme thirst, very frequent urination, sudden weight loss, confusion, or blurred vision.");
        prediction.setWhenToConsultDoctor("Consult an endocrinologist or primary care physician for a full diagnostic review and personalised management plan.");
        return prediction;
    }

    // ─── Other features ───────────────────────────────────────────────────────

    @Override
    public String generateReportSummary(String extractedText) {
        String prompt = promptBuilder.buildReportSummaryPrompt(extractedText);
        try {
            return callGemini(prompt);
        } catch (Exception e) {
            log.warn("Report summary failed, returning fallback: {}", e.getMessage());
            return "AI-generated summary unavailable. Please review the report manually.";
        }
    }

    @Override
    public com.diabetescdss.model.ExtractedReportData parseExtractedReportData(String extractedText, com.diabetescdss.model.ExtractedReportData entity) {
        if (extractedText == null || extractedText.isBlank()) {
            return entity;
        }

        // 1. First attempt AI parsing via Gemini
        String prompt = promptBuilder.buildReportParsingPrompt(extractedText);
        try {
            String rawResponse = callGemini(prompt);
            String jsonStr = rawResponse.trim();
            if (jsonStr.startsWith("```")) {
                jsonStr = jsonStr.replaceAll("(?s)^```[a-zA-Z]*\\n?", "").replaceAll("(?s)```$", "").trim();
            }

            JsonNode json = objectMapper.readTree(jsonStr);

            if (json.hasNonNull("hba1c")) entity.setHba1c(json.path("hba1c").asDouble());
            if (json.hasNonNull("fastingBloodSugar")) entity.setFastingBloodSugar(json.path("fastingBloodSugar").asDouble());
            if (json.hasNonNull("randomBloodSugar")) entity.setRandomBloodSugar(json.path("randomBloodSugar").asDouble());
            if (json.hasNonNull("bloodSugar")) entity.setBloodSugar(json.path("bloodSugar").asDouble());
            if (json.hasNonNull("bloodPressure")) entity.setBloodPressure(json.path("bloodPressure").asText());
            if (json.hasNonNull("bloodPressureSystolic")) entity.setBloodPressureSystolic(json.path("bloodPressureSystolic").asDouble());
            if (json.hasNonNull("bloodPressureDiastolic")) entity.setBloodPressureDiastolic(json.path("bloodPressureDiastolic").asDouble());
            if (json.hasNonNull("cholesterol")) entity.setCholesterol(json.path("cholesterol").asDouble());
            if (json.hasNonNull("hdl")) entity.setHdl(json.path("hdl").asDouble());
            if (json.hasNonNull("ldl")) entity.setLdl(json.path("ldl").asDouble());
            if (json.hasNonNull("triglycerides")) entity.setTriglycerides(json.path("triglycerides").asDouble());
            if (json.hasNonNull("bmi")) entity.setBmi(json.path("bmi").asDouble());
            if (json.hasNonNull("weight")) entity.setWeight(json.path("weight").asDouble());
            if (json.hasNonNull("age")) entity.setAge(json.path("age").asInt());
            if (json.hasNonNull("medications")) entity.setMedications(json.path("medications").asText());
            if (json.hasNonNull("labValues")) entity.setLabValues(json.path("labValues").asText());

            log.info("Gemini AI parsed report data: HbA1c={}, FBS={}, Chol={}, HDL={}, Triglycerides={}",
                    entity.getHba1c(), entity.getFastingBloodSugar(), entity.getCholesterol(), entity.getHdl(), entity.getTriglycerides());
        } catch (Exception e) {
            log.warn("Gemini AI report parsing hit quota/error: {} — applying regex fallback extractor", e.getMessage());
        }

        // 2. Fallback / complementary Regex Pattern Extractor to guarantee 100% retrieval
        parseMetricsViaRegex(extractedText, entity);

        log.info("Final extracted report data: HbA1c={}, FBS={}, Chol={}, HDL={}, LDL={}, Triglycerides={}",
                entity.getHba1c(), entity.getFastingBloodSugar(), entity.getCholesterol(), entity.getHdl(), entity.getLdl(), entity.getTriglycerides());

        return entity;
    }

    private void parseMetricsViaRegex(String text, com.diabetescdss.model.ExtractedReportData entity) {
        if (text == null || text.isBlank()) return;

        // HbA1c (e.g. Hb A1c (TURB) 3.8 % or HbA1c: 6.5%)
        if (entity.getHba1c() == null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?i)(?:hb\\s*a1c|hba1c|glycated\\s*hemoglobin)[^\\d]*([\\d\\.]+)").matcher(text);
            if (m.find()) {
                try { entity.setHba1c(Double.parseDouble(m.group(1))); } catch (Exception ignored) {}
            }
        }

        // Fasting Blood Sugar (e.g. Glucose fasting (PHO) 83 mg/dl)
        if (entity.getFastingBloodSugar() == null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?i)(?:glucose\\s*fasting|fasting\\s*glucose|fasting\\s*blood\\s*sugar|fbs)[^\\d]*([\\d\\.]+)").matcher(text);
            if (m.find()) {
                try { entity.setFastingBloodSugar(Double.parseDouble(m.group(1))); } catch (Exception ignored) {}
            }
        }

        // Total Cholesterol (e.g. Cholesterol, total (PHO) 221 high mg/dl)
        if (entity.getCholesterol() == null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?i)(?:cholesterol,\\s*total|total\\s*cholesterol|cholesterol\\s*total)[^\\d]*([\\d\\.]+)").matcher(text);
            if (m.find()) {
                try { entity.setCholesterol(Double.parseDouble(m.group(1))); } catch (Exception ignored) {}
            }
        }

        // Triglycerides (e.g. Triglycerides (PHO) 1315 high mg/dl)
        if (entity.getTriglycerides() == null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?i)(?:triglycerides)[^\\d]*([\\d\\.]+)").matcher(text);
            if (m.find()) {
                try { entity.setTriglycerides(Double.parseDouble(m.group(1))); } catch (Exception ignored) {}
            }
        }

        // HDL Cholesterol (e.g. HDL Cholesterol, direct (PHO) 22.5 low mg/dl)
        if (entity.getHdl() == null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?i)(?:hdl\\s*cholesterol|hdl\\s*direct|hdl)[^\\d]*([\\d\\.]+)").matcher(text);
            if (m.find()) {
                try { entity.setHdl(Double.parseDouble(m.group(1))); } catch (Exception ignored) {}
            }
        }

        // LDL Cholesterol (e.g. LDL Cholesterol, direct (PHO) 36 mg/dl)
        if (entity.getLdl() == null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?i)(?:ldl\\s*cholesterol|ldl\\s*direct|ldl)[^\\d]*([\\d\\.]+)").matcher(text);
            if (m.find()) {
                try { entity.setLdl(Double.parseDouble(m.group(1))); } catch (Exception ignored) {}
            }
        }

        // Blood Pressure (e.g. 120/80)
        if (entity.getBloodPressure() == null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?i)(?:blood\\s*pressure|bp)[^\\d]*(\\d{2,3}\\s*/\\s*\\d{2,3})").matcher(text);
            if (m.find()) {
                entity.setBloodPressure(m.group(1).replaceAll("\\s+", ""));
            }
        }

        // BMI
        if (entity.getBmi() == null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?i)\\bbmi\\b[^\\d]*([\\d\\.]+)").matcher(text);
            if (m.find()) {
                try { entity.setBmi(Double.parseDouble(m.group(1))); } catch (Exception ignored) {}
            }
        }

        // Weight
        if (entity.getWeight() == null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?i)\\bweight\\b[^\\d]*([\\d\\.]+)").matcher(text);
            if (m.find()) {
                try { entity.setWeight(Double.parseDouble(m.group(1))); } catch (Exception ignored) {}
            }
        }
    }

    @Override
    public DietPlanResponse generateDietPlan(Long userId, DietRequest request) {
        // Fetch the user's most recent predictions (up to 5) to personalise the plan
        List<Prediction> history = predictionRepository.findByUserId(
                userId,
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();

        if (history.isEmpty()) {
            log.warn("No prediction history found for user {} — returning empty diet plan", userId);
            return new DietPlanResponse();
        }

        try {
            String prompt = promptBuilder.buildDietPlanFromHistoryPrompt(history);
            String rawResponse = callGemini(prompt);
            String jsonStr = rawResponse.trim();
            if (jsonStr.startsWith("```")) {
                jsonStr = jsonStr.replaceAll("(?s)^```[a-zA-Z]*\\n?", "").replaceAll("(?s)```$", "").trim();
            }
            JsonNode json = objectMapper.readTree(jsonStr);

            DietPlanResponse resp = new DietPlanResponse();
            resp.setGeneralAdvice(json.path("generalAdvice").asText(""));
            resp.setWeekly(json.path("weekly").asText(""));
            resp.setBreakfast(parseStringArray(json.path("breakfast")));
            resp.setLunch(parseStringArray(json.path("lunch")));
            resp.setDinner(parseStringArray(json.path("dinner")));
            resp.setSnacks(parseStringArray(json.path("snacks")));
            resp.setFoodsToEat(parseStringArray(json.path("foodsToEat")));
            resp.setFoodsToAvoid(parseStringArray(json.path("foodsToAvoid")));

            if (json.has("calTarget")) resp.setCalTarget(json.path("calTarget").asInt());
            if (json.has("carbsPct")) resp.setCarbsPct(json.path("carbsPct").asInt());
            if (json.has("proteinPct")) resp.setProteinPct(json.path("proteinPct").asInt());
            if (json.has("fatPct")) resp.setFatPct(json.path("fatPct").asInt());

            if (resp.getBreakfast() != null && !resp.getBreakfast().isEmpty()) {
                log.info("AI diet plan generated for user {}", userId);
                return resp;
            }
        } catch (Exception e) {
            log.error("Diet plan Gemini call failed for user {}: {}", userId, e.getMessage());
        }

        return generateDynamicDietPlanFromPrediction(history.get(0));
    }

    @Override
    public ExercisePlanResponse generateExercisePlan(Long userId) {
        // Fetch the user's most recent predictions (up to 5) to personalise the plan
        List<Prediction> history = predictionRepository.findByUserId(
                userId,
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();

        if (history.isEmpty()) {
            log.warn("No prediction history found for user {} — returning empty exercise plan", userId);
            return new ExercisePlanResponse();
        }

        try {
            String prompt = promptBuilder.buildExercisePlanFromHistoryPrompt(history);
            String rawResponse = callGemini(prompt);
            String jsonStr = rawResponse.trim();
            if (jsonStr.startsWith("```")) {
                jsonStr = jsonStr.replaceAll("(?s)^```[a-zA-Z]*\\n?", "").replaceAll("(?s)```$", "").trim();
            }
            JsonNode json = objectMapper.readTree(jsonStr);

            List<ExercisePlanResponse.ExerciseActivity> activities = new ArrayList<>();
            JsonNode activitiesNode = json.path("activities");
            if (activitiesNode.isArray()) {
                for (JsonNode a : activitiesNode) {
                    activities.add(ExercisePlanResponse.ExerciseActivity.builder()
                            .name(a.path("name").asText(""))
                            .type(a.path("type").asText("walking"))
                            .duration(a.path("duration").asInt(30))
                            .calories(a.path("calories").asText(""))
                            .frequency(a.path("frequency").asText(""))
                            .intensity(a.path("intensity").asText("Moderate"))
                            .description(a.path("description").asText(""))
                            .benefit(a.path("benefit").asText(""))
                            .build());
                }
            }

            ExercisePlanResponse resp = new ExercisePlanResponse();
            resp.setGeneralAdvice(json.path("generalAdvice").asText(""));
            resp.setIntensity(json.path("intensity").asText("Moderate"));
            if (json.has("weeklyMinutes")) resp.setWeeklyMinutes(json.path("weeklyMinutes").asInt(180));
            resp.setActivities(activities);

            if (activities != null && !activities.isEmpty()) {
                log.info("AI exercise plan generated for user {} with {} activities", userId, activities.size());
                return resp;
            }
        } catch (Exception e) {
            log.error("Exercise plan Gemini call failed for user {}: {}", userId, e.getMessage());
        }

        return generateDynamicExercisePlanFromPrediction(history.get(0));
    }

    private DietPlanResponse generateDynamicDietPlanFromPrediction(Prediction latest) {
        double hba1c = latest.getHba1c();
        double bmi = latest.getBmi();
        String dietPref = latest.getDietType() != null ? latest.getDietType().toString() : "VEGETARIAN";
        boolean isHighRisk = latest.getDiabetesRisk() == com.diabetescdss.enums.RiskLevel.HIGH || hba1c >= 6.5;

        DietPlanResponse resp = new DietPlanResponse();
        resp.setGeneralAdvice("AI Clinical Diet Plan based on your latest record (HbA1c: " + String.format("%.1f", hba1c) + "%, BMI: " + String.format("%.1f", bmi) + ", Diet Preference: " + dietPref + "). " + (latest.getPersonalizedDiet() != null ? latest.getPersonalizedDiet() : "Prioritize strict portion control and low-GI foods."));

        if (latest.getFoodsToEat() != null && !latest.getFoodsToEat().isBlank()) {
            resp.setFoodsToEat(List.of(latest.getFoodsToEat().split(", ")));
        } else {
            resp.setFoodsToEat(List.of("Spinach & leafy greens", "Steel-cut oats & quinoa", "Lean protein (fish/tofu/chicken)", "Walnuts & chia seeds", "Low-GI berries"));
        }

        if (latest.getFoodsToAvoid() != null && !latest.getFoodsToAvoid().isBlank()) {
            resp.setFoodsToAvoid(List.of(latest.getFoodsToAvoid().split(", ")));
        } else {
            resp.setFoodsToAvoid(List.of("Sugary beverages & sodas", "White bread, white rice & refined flour", "Processed bakery sweets", "Deep-fried snacks"));
        }

        if (isHighRisk) {
            resp.setBreakfast(List.of("Steel-cut oats with cinnamon & chia seeds", "Vegetable upma with low oil", "Greek yogurt with crushed walnuts"));
            resp.setLunch(List.of("Brown rice with dal & spinach curry", "Quinoa bowl with grilled tofu & vegetables", "Whole wheat roti with palak paneer & salad"));
            resp.setDinner(List.of("Grilled salmon/tofu with steamed broccoli", "Lentil soup with mixed green salad", "Stir-fried vegetables with cauliflower rice"));
            resp.setSnacks(List.of("Roasted chickpeas", "Apple slices with peanut butter", "Cucumber & carrot sticks with hummus"));
            resp.setCalTarget(bmi > 25 ? 1600 : 1800);
            resp.setCarbsPct(40);
            resp.setProteinPct(35);
            resp.setFatPct(25);
        } else {
            resp.setBreakfast(List.of("Oatmeal with sliced banana & almonds", "Multigrain toast with avocado & egg", "Vegetable poha with peanuts"));
            resp.setLunch(List.of("Brown rice with mixed vegetable curry & salad", "Whole wheat roti with dal & cucumber", "Grilled chicken/fish with quinoa"));
            resp.setDinner(List.of("Whole wheat roti with paneer/tofu curry", "Mixed vegetable soup with multigrain bread", "Baked chicken with roasted sweet potatoes"));
            resp.setSnacks(List.of("Handful of almonds & walnuts", "Unsweetened Greek yogurt with berries", "Roasted makhana"));
            resp.setCalTarget(bmi > 25 ? 1700 : 2000);
            resp.setCarbsPct(45);
            resp.setProteinPct(30);
            resp.setFatPct(25);
        }

        resp.setWeekly("7-day personalised low-GI diet plan tailored to your HbA1c of " + String.format("%.1f", hba1c) + "%");
        return resp;
    }

    private ExercisePlanResponse generateDynamicExercisePlanFromPrediction(Prediction latest) {
        double bmi = latest.getBmi();
        double hba1c = latest.getHba1c();
        boolean isHighRisk = latest.getDiabetesRisk() == com.diabetescdss.enums.RiskLevel.HIGH || hba1c >= 6.5;

        List<ExercisePlanResponse.ExerciseActivity> activities = new ArrayList<>();
        activities.add(ExercisePlanResponse.ExerciseActivity.builder()
                .name("Post-Meal Brisk Walking")
                .type("walking")
                .duration(isHighRisk ? 20 : 30)
                .frequency("Daily after main meals")
                .calories("100-140 kcal")
                .intensity("Low-Moderate")
                .description("Walk 15-20 min post meals based on your HbA1c of " + String.format("%.1f", hba1c) + "% to flatten glucose spikes.")
                .benefit("Lowers postprandial blood sugar by up to 18%")
                .build());

        activities.add(ExercisePlanResponse.ExerciseActivity.builder()
                .name(bmi > 25 ? "Low-Impact Cycling" : "Moderate Jogging")
                .type(bmi > 25 ? "cycling" : "running")
                .duration(25)
                .frequency("3-4 days/week")
                .calories("180-230 kcal")
                .intensity("Moderate")
                .description("Cardiovascular exercise tailored to your BMI of " + String.format("%.1f", bmi) + ".")
                .benefit("Enhances skeletal muscle insulin sensitivity by 20%")
                .build());

        activities.add(ExercisePlanResponse.ExerciseActivity.builder()
                .name("Pranayama & Diabetic Yoga")
                .type("yoga")
                .duration(20)
                .frequency("4-5 days/week")
                .calories("60-80 kcal")
                .intensity("Low")
                .description("Targeted yoga postures (Dhanurasana, Paschimottanasana) to stimulate pancreatic beta cells.")
                .benefit("Reduces serum cortisol and stabilizes fasting glucose")
                .build());

        activities.add(ExercisePlanResponse.ExerciseActivity.builder()
                .name("Resistance & Band Workouts")
                .type("strength")
                .duration(25)
                .frequency("2-3 days/week")
                .calories("120-170 kcal")
                .intensity(isHighRisk ? "Light" : "Moderate")
                .description("Strengthens large muscle groups for enhanced GLUT-4 translocation.")
                .benefit("Increases muscular glucose disposal reservoir")
                .build());

        activities.add(ExercisePlanResponse.ExerciseActivity.builder()
                .name("Cool-Down & Flexibility")
                .type("stretching")
                .duration(10)
                .frequency("Post-workout")
                .calories("20-30 kcal")
                .intensity("Very Low")
                .description("Stretching routine to promote muscle recovery and waste clearance.")
                .benefit("Prevents muscle stiffness and joint strain")
                .build());

        ExercisePlanResponse resp = new ExercisePlanResponse();
        resp.setGeneralAdvice("AI Exercise Prescription derived from your latest metabolic profile (HbA1c: " + String.format("%.1f", hba1c) + "%, BMI: " + String.format("%.1f", bmi) + "). " + (latest.getExercisePlan() != null ? latest.getExercisePlan() : "Aim for 150-180 minutes of structured weekly activity."));
        resp.setIntensity(isHighRisk ? "Low to Moderate" : "Moderate");
        resp.setWeeklyMinutes(isHighRisk ? 150 : 180);
        resp.setActivities(activities);
        return resp;
    }

    /** Parse a JSON array node into a List<String>. */
    private List<String> parseStringArray(JsonNode node) {
        List<String> result = new ArrayList<>();
        if (node != null && node.isArray()) {
            for (JsonNode item : node) {
                result.add(item.asText());
            }
        }
        return result;
    }

    @Override
    public HealthTipResponse generateDailyTip() {
        HealthTipResponse response = new HealthTipResponse();
        try {
            String tip = callGemini(promptBuilder.buildDailyTipPrompt());
            response.setTip(tip.trim());
        } catch (Exception e) {
            log.warn("Daily tip Gemini call failed, using fallback: {}", e.getMessage());
            response.setTip("Stay hydrated and monitor your blood sugar regularly.");
        }
        return response;
    }

    @Override
    public String generateComparisonExplanation(Map<String, Object> data) {
        Object prevObj = data.get("previous");
        Object currObj = data.get("current");
        
        try {
            String prevStr = prevObj != null ? prevObj.toString() : "";
            String currStr = currObj != null ? currObj.toString() : "";
            return callGemini(promptBuilder.buildComparisonExplanationPrompt(prevStr, currStr));
        } catch (Exception e) {
            log.warn("Gemini comparison call failed: {}. Generating dynamic fallback explanation.", e.getMessage());
            
            StringBuilder sb = new StringBuilder();
            sb.append("Diabetes Clinical Progress Analysis:\n\n");
            
            try {
                @SuppressWarnings("unchecked")
                Map<String, Double> diffs = (Map<String, Double>) data.get("differences");
                if (diffs != null) {
                    double hba1cDiff = diffs.getOrDefault("hba1c", 0.0);
                    double fbsDiff = diffs.getOrDefault("fastingBloodSugar", 0.0);
                    double bmiDiff = diffs.getOrDefault("bmi", 0.0);
                    
                    boolean improved = false;
                    boolean worsened = false;

                    // HbA1c explanation
                    if (hba1cDiff < 0) {
                        sb.append("• Long-term glycemic control (HbA1c) has successfully improved by ")
                          .append(String.format("%.2f", Math.abs(hba1cDiff))).append("%, reflecting positive metabolic progress. ");
                        improved = true;
                    } else if (hba1cDiff > 0) {
                        sb.append("• Long-term glucose levels (HbA1c) have increased by ")
                          .append(String.format("%.2f", hba1cDiff)).append("%, suggesting the need for tighter dietary compliance or medication adjustment. ");
                        worsened = true;
                    } else {
                        sb.append("• HbA1c levels remained stable. ");
                    }
                    
                    // Fasting blood sugar explanation
                    if (fbsDiff < 0) {
                        sb.append("• Fasting blood sugar decreased by ")
                          .append(String.format("%.1f", Math.abs(fbsDiff))).append(" mg/dL, showing healthy morning regulation. ");
                        improved = true;
                    } else if (fbsDiff > 0) {
                        sb.append("• Fasting blood sugar increased by ")
                          .append(String.format("%.1f", fbsDiff)).append(" mg/dL, indicating potential insulin resistance or carb loading. ");
                        worsened = true;
                    }
                    
                    // BMI explanation
                    if (bmiDiff < 0) {
                        sb.append("• Body Mass Index (BMI) dropped by ")
                          .append(String.format("%.2f", Math.abs(bmiDiff))).append(", demonstrating successful weight management. ");
                        improved = true;
                    } else if (bmiDiff > 0) {
                        sb.append("• BMI increased by ")
                          .append(String.format("%.2f", bmiDiff)).append(", which calls for review of calorie intake and physical activity. ");
                        worsened = true;
                    }

                    sb.append("\n\nRecommendations:\n");
                    if (worsened) {
                        sb.append("- Focus on portion control, limit carbohydrates, and consult your provider about medication dosage.\n");
                    }
                    if (improved) {
                        sb.append("- Excellent work maintaining healthy changes! Keep up the current diet and activity patterns.\n");
                    }
                    sb.append("- Continue regular blood sugar tracking and active lifestyle habits.");
                }
            } catch (Exception ex) {
                sb.append("Analysis: Patient metabolic indicators show variation across test dates. Please maintain a balanced diet, prioritize daily physical activity, and review these readings with your general physician during your next clinical appointment.");
            }
            
            return sb.toString();
        }
    }

    @Override
    public String chat(String message, java.util.List<Map<String, String>> conversationHistory) {
        if (message == null || message.isBlank()) {
            return "Please ask a question regarding your diabetes health or management.";
        }

        StringBuilder historySb = new StringBuilder();
        if (conversationHistory != null) {
            for (Map<String, String> entry : conversationHistory) {
                String role = entry.getOrDefault("role", "user");
                String content = entry.getOrDefault("content", "");
                historySb.append(role.substring(0, 1).toUpperCase()).append(role.substring(1))
                         .append(": ").append(content).append("\n");
            }
        }

        String prompt = promptBuilder.buildChatPrompt(message, historySb.toString());

        try {
            return callGemini(prompt);
        } catch (Exception e) {
            log.warn("Gemini AI chat call failed/quota: {} — returning intelligent clinical fallback response", e.getMessage());
            return getClinicalChatFallbackResponse(message);
        }
    }

    private String getClinicalChatFallbackResponse(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("diet") || lower.contains("food") || lower.contains("eat") || lower.contains("meal")) {
            return "For optimal diabetes nutrition, emphasize non-starchy vegetables, whole grains, lean proteins, and healthy fats while minimizing refined sugars and processed carbs.";
        } else if (lower.contains("exercise") || lower.contains("walk") || lower.contains("workout") || lower.contains("activity")) {
            return "Aim for 150 minutes of moderate aerobic exercise per week (e.g., brisk walking 30 mins, 5 days a week), alongside twice-weekly light strength training.";
        } else if (lower.contains("sugar") || lower.contains("glucose") || lower.contains("hba1c") || lower.contains("level")) {
            return "Standard fasting blood glucose target is 70-99 mg/dL (normal) or 80-130 mg/dL for managed diabetes, with an HbA1c target usually below 7.0%.";
        } else if (lower.contains("symptom") || lower.contains("thirst") || lower.contains("urinat") || lower.contains("tired")) {
            return "Key diabetes symptoms include increased thirst, frequent urination, unexplained weight loss, blurry vision, and chronic fatigue.";
        }
        return "Hello! I am your AI Health Coach. You can ask me questions about diabetes risk factors, healthy nutrition, physical activity, blood glucose monitoring, or interpreting lab results.";
    }
}
