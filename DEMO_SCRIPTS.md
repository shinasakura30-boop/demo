# Logi-Pro AI - Frontend Demo Scripts (Interactive Grading Mode)

This document contains sample responses that you can copy and paste into the Logi-Pro AI frontend to trigger the **Interactive Mock Grading System**. 

The frontend has been configured to dynamically read these inputs and output different scores (High, Medium, Low) and feedback based on the presence of specific keywords!
1
---

## 🛑 Module A: Emergency Response (Unit 7: Safety Issues)
**Scenario:** "Warehouse Accident: There has been a large chemical spill in Sector B and a worker has sustained a severe injury to their leg. Call emergency services and describe the situation clearly."

### 🟢 Good Response (Trigger: High Score - 92%)
*Triggers on: "Sector B" AND ("First aid" OR "Ambulance")*
> "Emergency! This is the main warehouse facility. We have an incident in **Sector B**. There has been a large chemical spill and a worker has sustained a severe injury to their leg. We need an **ambulance** and a hazmat team immediately. We are currently administering **first aid**."

### 🟡 Average Response (Trigger: Medium Score - 68%)
*Triggers on: "Spill" OR "Hurt" OR "Help"*
> "Hello? We have a problem in the warehouse. There is a **spill** and someone is **hurt** on the floor. Can you send **help** to us right now?"

### 🔴 Poor Response (Trigger: Low Score - 45%)
*Triggers on: Absence of specific safety keywords or locations.*
> "Emergency! Quick! Something fell down! A guy is bleeding! Please come fast, I don't know what to do!"

---

## 💬 Module B: Customer Interaction (Unit 8: Customer Service)
**Scenario:** "Shipment Delay: A VIP client's critical shipment is delayed by 48 hours due to a customs hold. Review SOPs and respond professionally."

### 🟢 Good Response (Trigger: High Score - 95%)
*Triggers on: "Apologies" AND "Overnight" AND "SOP"*
> "Dear Client, please accept my sincere **apologies** for this inconvenience. Your shipment is experiencing a 48-hour delay due to an unexpected customs hold. Our team is working with authorities. As per our **SOP**, I will monitor the clearance process directly. We will also arrange for expedited **overnight** distribution at our expense once released."

### 🟡 Average Response (Trigger: Medium Score - 65%)
*Triggers on: "Sorry" OR "Delay"*
> "**Sorry** for the **delay** with your shipment. It is stuck in customs for 48 hours. We are trying to figure it out and will let you know when it is released."

### 🔴 Poor Response (Trigger: Low Score - 35%)
*Triggers on: Absence of professional empathy or resolution.*
> "I don't know, it's not our fault. Customs has it. You'll just have to wait 48 hours."

---

## 📦 Module C: Supply Chain Flow (Unit 9: Supply Chain)
**Scenario Briefing (Audio):** "To streamline our new product line, we must strictly follow the supply chain flow. Step one is the immediate procurement of high-grade raw materials... step two involves routing to manufacturing... step three is final preparation for distribution to regional hubs."

### 🟢 Good Response (Trigger: High Score - 88.5%)
*Triggers on: "Procurement" AND "Distribution" AND "Hub"*
> "SOP Notes:
> 1. Initiate **procurement** of high-grade raw materials from tier-1 suppliers.
> 2. Route materials directly to the primary manufacturing facility.
> 3. Following QC, finalize staging for outbound **distribution** to regional **hub**s."

### 🟡 Average Response (Trigger: Medium Score - 68%)
*Triggers on: ("Raw material" OR "Manufacturing") AND "Distribution"*
> "Notes: Get **raw material**s from suppliers. Then send them to **manufacturing** to be built. Finally, do the **distribution** out to the branches."

### 🔴 Poor Response (Trigger: Low Score - 42%)
*Triggers on: Missing the critical supply chain lifecycle stages.*
> "Buy things. Make the product. Ship them."

---

## 📊 Dashboard & Admin Review Flow
You can now clearly demonstrate the dynamic AI capabilities:
1. Copy the **Low** or **Average** response into Module B.
2. Observe that the AI correctly identifies the missing concepts and flags it for the Review Queue.
3. Check the **Dashboard**, and you will see dynamic interventions being recommended based on the exact mistakes you made!
