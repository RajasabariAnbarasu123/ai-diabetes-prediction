package com.diabetescdss.util;

import com.diabetescdss.model.Prediction;
import org.springframework.stereotype.Component;

@Component
public class PromptBuilder {

    /**
     * Build the prompt for Gemini to generate a full diabetes risk assessment.
     */
    public String buildPredictionPrompt(Prediction prediction) {
        String dietTypeStr = prediction.getDietType() != null ? prediction.getDietType().toString() : "VEGETARIAN";
        String activityStr = prediction.getPhysicalActivity() != null ? prediction.getPhysicalActivity() : "Moderate";
        String stressStr = prediction.getStressLevel() != null ? prediction.getStressLevel() : "Moderate";
        String medsStr = prediction.getCurrentMedications() != null && !prediction.getCurrentMedications().isBlank()
                ? prediction.getCurrentMedications() : "None reported";

        double cholesterolVal = prediction.getCholesterol();
        double hdlVal = prediction.getHdl();
        double ldlVal = prediction.getLdl();
        double trigVal = prediction.getTriglycerides();

        return """
                You are an experienced diabetologist and clinical decision support AI.
                Analyze the EXACT patient values below strictly according to ADA and WHO guidelines.
                CRITICAL RULES:
                - Every text field MUST cite the patient's actual numbers (e.g. "Your HbA1c of 7.5%% indicates...")
                - Do NOT produce generic or templated advice. Tailor every field to the specific values given.
                - personalizedDiet, exercisePlan, foodsToEat, foodsToAvoid, medicationReminders, lifestyleChanges
                  must each reflect the patient's dietType, existing medications, symptoms, BMI, and risk level.
                - warningSigns and whenToConsultDoctor must be relevant to this patient's specific readings.
                - confidenceScore: reflect how many markers are abnormal (0-100 integer).
                
                Return a JSON object with EXACTLY these keys (all values strings except confidenceScore):
                {
                  "diabetesRisk": "Low|Moderate|High|Critical",
                  "diabetesStage": "Normal|Prediabetes|Type2_Controlled|Type2_Uncontrolled|Type1",
                  "confidenceScore": <integer 50-99>,
                  "explanation": "<2-3 sentences referencing the patient's exact HbA1c, FBS, BMI values>",
                  "riskFactors": "<comma-separated list of this patient's specific risk factors>",
                  "clinicalSummary": "<3-4 sentences specific to these readings>",
                  "personalizedDiet": "<diet advice specific to dietType=%s, BMI=%.1f, HbA1c=%.1f%%>",
                  "exercisePlan": "<exercise plan tailored to physical activity level=%s and BMI=%.1f>",
                  "lifestyleChanges": "<3-4 changes specific to stress=%s, sleep=%.1f h, smoking=%s>",
                  "foodsToEat": "<6-8 specific foods appropriate for dietType=%s and this risk level>",
                  "foodsToAvoid": "<6-8 specific foods to avoid for this patient>",
                  "medicationReminders": "<reminders considering current meds: %s>",
                  "warningSigns": "<warning signs relevant to this patient's readings>",
                  "whenToConsultDoctor": "<specific advice based on risk level and markers>"
                }
                
                Patient Data:
                Age: %d, Gender: %s
                Height: %.1f cm, Weight: %.1f kg, BMI: %.1f
                Fasting Blood Sugar: %.1f mg/dL, Random Blood Sugar: %.1f mg/dL
                HbA1c: %.1f%%
                Blood Pressure: %s
                Cholesterol: %.1f mg/dL, HDL: %.1f mg/dL, LDL: %.1f mg/dL, Triglycerides: %.1f mg/dL
                Family History of Diabetes: %s, Smoking: %s, Alcohol: %s
                Physical Activity Level: %s
                Daily Water Intake: %.1f L, Sleep: %.1f hours/night
                Diet Type: %s, Stress Level: %s
                Existing Diseases: %s
                Current Medications: %s
                Active Symptoms — Frequent Urination: %s, Increased Thirst: %s, Unexplained Weight Loss: %s,
                Blurred Vision: %s, Fatigue: %s, Slow Wound Healing: %s, Tingling/Numbness: %s, Increased Hunger: %s
                
                Return ONLY the raw JSON object. No markdown, no code fences, no extra text.
                """.formatted(
                // inline hints in schema
                dietTypeStr, prediction.getBmi(), prediction.getHba1c(),
                activityStr, prediction.getBmi(),
                stressStr, prediction.getSleepHours(),
                prediction.isSmoking() ? "Yes" : "No",
                dietTypeStr,
                medsStr,
                // patient data
                prediction.getAge(),
                prediction.getGender() != null ? prediction.getGender() : "Other",
                prediction.getHeight(),
                prediction.getWeight(),
                prediction.getBmi(),
                prediction.getFastingBloodSugar(),
                prediction.getRandomBloodSugar(),
                prediction.getHba1c(),
                prediction.getBloodPressure() != null ? prediction.getBloodPressure() : "Not provided",
                cholesterolVal,
                hdlVal,
                ldlVal,
                trigVal,
                prediction.isFamilyHistory() ? "Yes" : "No",
                prediction.isSmoking() ? "Yes" : "No",
                prediction.isAlcohol() ? "Yes" : "No",
                activityStr,
                prediction.getDailyWaterIntake(),
                prediction.getSleepHours(),
                dietTypeStr,
                stressStr,
                prediction.getExistingDiseases() != null && !prediction.getExistingDiseases().isBlank()
                        ? prediction.getExistingDiseases() : "None reported",
                medsStr,
                prediction.isFrequentUrination() ? "Yes" : "No",
                prediction.isIncreasedThirst() ? "Yes" : "No",
                prediction.isWeightLoss() ? "Yes" : "No",
                prediction.isBlurredVision() ? "Yes" : "No",
                prediction.isFatigue() ? "Yes" : "No",
                prediction.isSlowWoundHealing() ? "Yes" : "No",
                prediction.isTinglingSensation() ? "Yes" : "No",
                prediction.isIncreasedHunger() ? "Yes" : "No"
        );
    }

    /**
     * Build a diet plan prompt from the user's most recent prediction history.
     */
    public String buildDietPlanFromHistoryPrompt(java.util.List<Prediction> history) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
                You are a clinical nutritionist specialised in diabetes management.
                Based on the patient's clinical history below, generate a detailed, PERSONALISED meal & nutrition plan.
                The plan MUST be tailored to the patient's exact lab values, diet preference, risk level, and active symptoms.
                Do NOT produce generic advice.
                
                Return a JSON object with EXACTLY these keys:
                {
                  "generalAdvice": "<2-3 sentences personalised to this patient's exact HbA1c, FBS, and BMI readings>",
                  "breakfast": ["item 1 specific to diet type & risk", "item 2", "item 3"],
                  "lunch": ["item 1", "item 2", "item 3"],
                  "dinner": ["item 1", "item 2", "item 3"],
                  "snacks": ["item 1", "item 2"],
                  "foodsToEat": ["specific food 1 with benefit", "specific food 2", "specific food 3", "specific food 4", "specific food 5"],
                  "foodsToAvoid": ["specific food 1 to avoid & why", "specific food 2 to avoid", "specific food 3 to avoid", "specific food 4 to avoid", "specific food 5 to avoid"],
                  "calTarget": 1800,
                  "carbsPct": 45,
                  "proteinPct": 30,
                  "fatPct": 25,
                  "weekly": "<brief 7-day meal schedule summary tailored to this patient>"
                }
                
                Patient's prediction history (most recent first):
                """);

        for (int i = 0; i < history.size(); i++) {
            Prediction p = history.get(i);
            sb.append(String.format("""
                Record %d (date: %s):
                  HbA1c=%.1f%%, FastingBS=%.1f mg/dL, RandomBS=%.1f mg/dL, BMI=%.1f
                  Risk=%s, Stage=%s, DietType=%s
                  Symptoms: FreqUrination=%s, Thirst=%s, Fatigue=%s
                  CurrentMeds=%s, ExistingDiseases=%s
                """,
                    i + 1,
                    p.getCreatedAt() != null ? p.getCreatedAt().toLocalDate().toString() : "unknown",
                    p.getHba1c(), p.getFastingBloodSugar(), p.getRandomBloodSugar(), p.getBmi(),
                    p.getDiabetesRisk() != null ? p.getDiabetesRisk().name() : "Unknown",
                    p.getDiabetesStage() != null ? p.getDiabetesStage().name() : "Unknown",
                    p.getDietType() != null ? p.getDietType().toString() : "Not specified",
                    p.isFrequentUrination() ? "Yes" : "No",
                    p.isIncreasedThirst() ? "Yes" : "No",
                    p.isFatigue() ? "Yes" : "No",
                    p.getCurrentMedications() != null && !p.getCurrentMedications().isBlank()
                            ? p.getCurrentMedications() : "None",
                    p.getExistingDiseases() != null && !p.getExistingDiseases().isBlank()
                            ? p.getExistingDiseases() : "None"
            ));
        }
        sb.append("\nReturn ONLY the raw JSON object. No markdown, no code fences.");
        return sb.toString();
    }

    /**
     * Build an exercise plan prompt from the user's most recent prediction history.
     */
    public String buildExercisePlanFromHistoryPrompt(java.util.List<Prediction> history) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
                You are a certified exercise physiologist specialised in diabetes rehabilitation.
                Based on the patient's clinical history below, generate a detailed, PERSONALISED weekly exercise plan.
                The plan MUST account for the patient's BMI, current physical activity level, risk level, and any active symptoms like fatigue.
                Do NOT produce generic advice.
                
                Return a JSON object with EXACTLY this structure:
                {
                  "generalAdvice": "<2-3 sentences personalised exercise guidance based on patient history>",
                  "intensity": "Moderate",
                  "weeklyMinutes": 180,
                  "activities": [
                    {
                      "name": "Brisk Walking",
                      "type": "walking",
                      "duration": 30,
                      "calories": "120-150 kcal",
                      "frequency": "Daily",
                      "intensity": "Low-Moderate",
                      "description": "Walk 20-30 minutes after meals to flatten postprandial glucose spikes.",
                      "benefit": "Lowers post-meal blood sugar by up to 15%"
                    }
                  ]
                }
                Include 5 activities appropriate for this patient's condition (types: walking, running, yoga, cycling, swimming, strength, stretching).
                
                Patient's prediction history (most recent first):
                """);

        for (int i = 0; i < history.size(); i++) {
            Prediction p = history.get(i);
            sb.append(String.format("""
                Record %d (date: %s):
                  Age=%d, Gender=%s, BMI=%.1f, Weight=%.1f kg
                  Risk=%s, Stage=%s, PhysicalActivity=%s
                  HbA1c=%.1f%%, FastingBS=%.1f mg/dL
                  Symptoms: Fatigue=%s, Tingling=%s
                  ExistingDiseases=%s
                """,
                    i + 1,
                    p.getCreatedAt() != null ? p.getCreatedAt().toLocalDate().toString() : "unknown",
                    p.getAge(), p.getGender(), p.getBmi(), p.getWeight(),
                    p.getDiabetesRisk() != null ? p.getDiabetesRisk().name() : "Unknown",
                    p.getDiabetesStage() != null ? p.getDiabetesStage().name() : "Unknown",
                    p.getPhysicalActivity() != null ? p.getPhysicalActivity() : "Not specified",
                    p.getHba1c(), p.getFastingBloodSugar(),
                    p.isFatigue() ? "Yes" : "No",
                    p.isTinglingSensation() ? "Yes" : "No",
                    p.getExistingDiseases() != null && !p.getExistingDiseases().isBlank()
                            ? p.getExistingDiseases() : "None"
            ));
        }
        sb.append("\nReturn ONLY the raw JSON object. No markdown, no code fences.");
        return sb.toString();
    }

    public String buildReportSummaryPrompt(String extractedText) {
        return """
                You are a medical report analyst. Summarize the following extracted text from a diabetes-related lab report.
                Provide a concise patient summary (2-3 sentences) highlighting key findings such as HbA1c, blood sugar, cholesterol, and any abnormalities.
                Use plain English. Do not include any JSON formatting.
                                
                Extracted Text:
                """ + extractedText;
    }

    public String buildReportParsingPrompt(String extractedText) {
        return """
                You are an expert clinical laboratory data parser.
                Parse the following raw medical report text and extract all quantitative lab values related to diabetes and metabolic health.
                Carefully look for HbA1c (%), Fasting Blood Glucose (mg/dL), Random Blood Glucose (mg/dL), Total Cholesterol (mg/dL or mmol/L converted to mg/dL), HDL, LDL, Triglycerides, Blood Pressure, BMI, Weight, Age, and any medications listed.
                
                Return a raw JSON object with EXACTLY these keys (use numbers for numeric values or null if not found in text):
                {
                  "hba1c": <number or null, e.g. 3.8 or 6.5>,
                  "fastingBloodSugar": <number or null in mg/dL, e.g. 83.0>,
                  "randomBloodSugar": <number or null in mg/dL>,
                  "bloodSugar": <number or null in mg/dL>,
                  "bloodPressure": <string e.g. "120/80" or null>,
                  "bloodPressureSystolic": <number or null>,
                  "bloodPressureDiastolic": <number or null>,
                  "cholesterol": <number or null in mg/dL, e.g. 221.0>,
                  "hdl": <number or null in mg/dL, e.g. 22.5>,
                  "ldl": <number or null in mg/dL, e.g. 36.0>,
                  "triglycerides": <number or null in mg/dL, e.g. 1315.0>,
                  "bmi": <number or null>,
                  "weight": <number or null in kg>,
                  "age": <integer or null>,
                  "medications": <string summary of medications or null>,
                  "labValues": <short string summary of key findings>
                }

                Extracted Report Text:
                """ + extractedText + "\n\nReturn ONLY the raw JSON object. No markdown code blocks, no extra text.";
    }

    public String buildDietPlanPrompt(String userProfileSummary, String dietType, String region) {
        return """
                You are a nutritionist specialized in diabetes care.
                Generate a JSON diet plan for a diabetic patient based on the following profile.
                Output JSON with keys:
                {
                  "generalAdvice": "...",
                  "breakfast": ["item1", "item2", ...],
                  "lunch": ["item1", "item2", ...],
                  "dinner": ["item1", "item2", ...],
                  "snacks": ["item1", "item2", ...],
                  "weekly": "brief weekly plan description"
                }
                                
                Profile: %s
                Diet preference: %s
                Region: %s
                                
                Important: Return ONLY the JSON object.
                """.formatted(userProfileSummary, dietType, region);
    }

    public String buildExercisePlanPrompt(String userProfileSummary) {
        return """
                You are a physical therapist. Create a JSON exercise plan for a diabetic patient.
                Output JSON:
                {
                  "activities": [
                    {"name": "...", "type": "...", "duration": minutes, "calories": "...", "frequency": "..."}
                  ]
                }
                Profile: %s
                Return ONLY the JSON.
                """.formatted(userProfileSummary);
    }

    public String buildDailyTipPrompt() {
        return """
                You are a health coach for diabetics. Provide one short, actionable daily health tip.
                The tip should be encouraging and easy to follow. Return it as plain text (no JSON).
                """;
    }

    public String buildComparisonExplanationPrompt(String previous, String current) {
        return """
                You are a clinical decision support assistant. Explain the changes between two diabetes prediction results.
                Previous: %s
                Current: %s
                Provide a short, encouraging explanation highlighting improvements or concerns.
                """.formatted(previous, current);
    }

    public String buildChatPrompt(String message, String conversationHistory) {
        return """
                You are an AI health coach for diabetic patients.
                Use the conversation history to maintain context. Answer the user's question helpfully, empathetically, and concisely.
                If the question is not related to health/diabetes, politely redirect.
                                
                Conversation history:
                %s
                                
                User: %s
                Assistant:
                """.formatted(conversationHistory, message);
    }
}