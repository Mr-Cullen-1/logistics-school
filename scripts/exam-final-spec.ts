import type { Item } from "./exam-content-spec";
import type { ExamQuestion } from "../src/lib/exams/types";
export const passages=[
{id:"A",title:"A morning at the dispatch desk",text:`Aziz works as a dispatcher for Coliseum Logistics. He has been in logistics for two years. Every morning, he checks the appointment list and contacts the drivers. Today, one driver is waiting at the gate. The receiver normally opens at 6 AM, but the driver needs the reference number before checking in. Aziz has already received the number from the broker. He has not sent it to the driver yet.

At 7:30 AM, Aziz calls Emma about load 624. He introduces himself and his company, then asks for the pickup requirements. Emma says there are thirty pallets. To avoid confusion with thirteen, she repeats the quantity as three-zero. The load weighs forty-two thousand pounds. Pickup is on Friday at 8:15 AM, not in the evening. Emma spells the reference as Kilo Tango, hyphen, four eight two one. Aziz reads back KT-4821 and asks her to confirm it.

The driver delivered a different load yesterday at 3 PM and sent its POD. For today's load, Aziz needs the rate confirmation. He asks, 'Could you please send the rate confirmation?' Emma says she will send it in five minutes. Aziz replies that he will call the driver when he receives it. He does not describe the missing document as already attached.

Before ending the call, they agree a total rate of $2,350. Aziz prepares a short email with the load number in the subject. The first draft accidentally says $2,530 and 8:15 PM. He checks it against the call notes and corrects both details. His final recap says Friday, 8:15 AM, $2,350 total, and asks Emma for written confirmation. He leaves the delivery appointment as TBD because no delivery time has been agreed. He uses the same confirmed reference in the driver message and the form.`},
{id:"B",title:"A revised pickup and an open payment request",text:`Load 480 goes from Dallas to Tulsa. The equipment requirement is a dry van. The accepted total is $2,200, including fuel and no extra stop. A later $2,300 counteroffer has been sent, but the broker has not accepted it. The dispatcher keeps $2,200 as the current agreement. The carrier documents have been sent; carrier approval is still pending.

Pickup was planned for 10:00 Central. A revised rate confirmation still shows 9:00 Central, so the dispatcher asks for a correction before dispatch. The driver reports 50 minutes of remaining driving time, while the stated route takes 70 minutes. Correcting the document alone will not resolve that mismatch. The dispatch lead must review the plan rather than promise an arrival that the available information does not support.

Later, the pickup plan changes to 11:30 Central. Loading takes one hour and travel takes three hours. The earliest arrival is therefore 15:30 Central. The confirmed delivery appointment remains 15:00 Central. The broker requests 16:00, but only the receiver scheduling team can approve that slot in this case. Until approval arrives, the dispatcher records the revision as requested. The driver is told to check in at Gate B and wait for a dock assignment. A short 'OK' does not replace a read-back of the gate and load ID.

For a separate completed load, a signed record shows 09:00 to 12:30 at the receiver. The agreed terms give two free hours and charge $40 per hour for actual billable minutes. The resulting request is $60. This calculation supports a request; it is not payment approval. Mira owns the review and will send an update at 15:00 Central. That update time is a communication commitment, not an arrival estimate. The handover keeps the payment issue open until the decision is received.`}
];
type FinalItem={module:number;lesson:number;section:"reading"|"writing"|"grammar";bloom:ExamQuestion["bloom"];item:Item;passageId?:string;type?:ExamQuestion["type"];maxWords?:number};
export const finalTheoryRefs=[1,4,1,4,4,1,4,5,2,4,2,2,5,6,3,1,7,3,7,5,3,2,4,4,2,2,1,4,2,1,3,5,2,6,9,3,1,1,4,3,3,4,4,2,2,3,5,6,9,10];
const r=(module:number,lesson:number,bloom:ExamQuestion["bloom"],type:ExamQuestion["type"],item:Item):FinalItem=>({module,lesson,bloom,type,item,section:"reading",passageId:module<3?"A":"B"});
const w=(module:number,lesson:number,bloom:ExamQuestion["bloom"],item:Item):FinalItem=>({module,lesson,bloom,item,section:"writing"});
const g=(module:number,lesson:number,bloom:ExamQuestion["bloom"],item:Item):FinalItem=>({module,lesson,bloom,item,section:"grammar"});
export const finalItems:FinalItem[]=[
 r(1,2,"remember","single_choice",["Passage A: What does the receiver normally do at 6 AM?","Opens","Closes","Sends a POD"]),
 r(1,4,"understand","single_choice",["Passage A: What does 'has not sent it yet' tell us about the reference number?","The driver has not been sent it","The broker has not supplied it","The reference number is invalid"]),
 r(1,3,"understand","matching",["Match the completed past event in Passage A to its time.","Yesterday at 3 PM","Every morning","Friday at 8:15 AM"]),
 r(1,5,"analyze","matching",["Match Aziz's promised call to its trigger; distinguish it from Emma's five-minute promise.","Receiving the rate confirmation","Finishing yesterday's delivery","Changing the total rate"]),
 r(1,4,"analyze","typed",["The driver needs one item before check-in. Compare that requirement with Aziz's completed and pending actions, excluding the document Emma has promised to send. What must Aziz send the driver? Write TWO words from the passage.","reference number"]),
 r(2,3,"remember","single_choice",["Passage A: What quantity does Emma confirm?","30 pallets","13 pallets","42 pallets"]),
 r(2,6,"understand","single_choice",["Why does Aziz leave the delivery time as TBD?","No delivery time was agreed","The delivery is already complete","The delivery time changed to evening"]),
 r(2,7,"understand","matching",["Match the purpose of Aziz's final recap to the correct description.","Request written confirmation of the agreed details","Announce a new counteroffer","Confirm completed delivery"]),
 r(2,4,"analyze","typed",["A second form draft says KT4821, but the spoken reference and Aziz's read-back agree. Which named separator was lost in the form draft? Write ONE word from the passage.","hyphen"]),
 r(2,8,"analyze","typed",["The email draft and call notes disagree. Complete the agreed TOTAL RATE field in digits only, without a comma or dollar sign.","2350"]),
 r(3,1,"remember","single_choice",["Passage B: What equipment is required for load 480?","Dry van","Reefer","Flatbed"]),
 r(3,2,"understand","single_choice",["In Passage B, 'including fuel' means what?","Fuel is part of $2,200","Fuel must be added to $2,200","Fuel has not been included in any offer"]),
 r(3,6,"understand","matching",["Match the status of the 16:00 slot before receiver approval.","Requested","Confirmed","Completed"]),
 r(3,4,"analyze","matching",["Match Mira's 15:00 time to its role, distinguishing it from delivery times.","Next update","Earliest arrival","Delivery appointment"]),
 r(3,4,"apply","typed",["Complete the earliest-arrival field from Passage B after adding loading and travel. Write HH:MM Central.","15:30 Central"]),
 r(4,4,"remember","single_choice",["Passage B: At which gate should the driver check in?","Gate B","Gate A","Door 7"]),
 r(4,1,"understand","single_choice",["Carrier documents have been sent. What remains pending in Passage B?","Carrier approval","Sending the documents","Selecting the dry van requirement"]),
 r(4,7,"understand","matching",["Match the status of the calculated $60 in Passage B.","Payment request","Approved payment","Received payment"]),
 r(4,3,"analyze","typed",["Compare the accepted amount with the unanswered counteroffer. Complete CURRENT ACCEPTED TOTAL in digits only, without a comma or dollar sign.","2200"]),
 r(4,7,"apply","typed",["Complete from the stated billing terms in Passage B: 3.5 hours minus 2 free hours at $40/hour = $___ requested. Write digits only.","60"]),
 w(1,3,"apply",["Rewrite using Past Simple and add no other words: 'We send the BOL yesterday.' Include the final period.","We sent the BOL yesterday."]),
 w(1,4,"apply",["Correct only the verb after have: 'I have took the BOL.' Write the whole sentence with its period.","I have taken the BOL."]),
 w(1,5,"apply",["Remove the unnecessary future auxiliary after when: 'I will call when I will arrive.' Write the full corrected sentence with its period.","I will call when I arrive."]),
 w(1,6,"evaluate",["A site's stated rule forbids parking. The draft says 'You don't have to park here.' Rewrite it with mustn't so it communicates the actual rule. Preserve 'park here' and the period.","You mustn't park here."]),
 w(2,1,"apply",["Complete this introduction with exactly two words: 'I work ___ ___ dispatcher.'","as a"]),
 w(2,2,"apply",["Rewrite the indirect question in the correct order: 'Could you tell me where is the dock?' Keep every word and the question mark.","Could you tell me where the dock is?"]),
 w(2,7,"apply",["Write a subject line using exactly this format: 'Subject: BOL attached — Load N'. The load number is 624. Replace only N.","Subject: BOL attached — Load 624"]),
 w(2,8,"evaluate",["Review this recap against the call: Friday, 8 AM, $2,350 total. The draft says 'Friday, 8 PM; $2,530 total.' Write the corrected recap in the same format, preserving its semicolon and period.","Friday, 8 AM; $2,350 total."]),
 w(3,5,"apply",["Replace the cause connector with due to and remove 'the traffic is heavy': 'We are delayed because the traffic is heavy.' End the new sentence with 'heavy traffic.'","We are delayed due to heavy traffic."]),
 w(3,6,"apply",["Write the update using this fixed template: 'ETA is TIME Central; next update is TIME Central.' Arrival estimate: 4 PM. Communication commitment: 3 PM.","ETA is 4 PM Central; next update is 3 PM Central."]),
 w(3,7,"apply",["Write an instruction using exactly these chunks in the correct sequence: 'First call the office,' / 'then check in at gate 2.' Separate them with one space.","First call the office, then check in at gate 2."]),
 w(3,8,"evaluate",["A new message requests an appointment but provides no approval. The draft 'The revised appointment is confirmed.' overstates the evidence. Replace only confirmed with the correct request-status word and write the full sentence.","The revised appointment is requested."]),
 w(4,4,"apply",["Write a hold instruction using exactly these chunks: 'Do not proceed' / 'until the office confirms the assignment.' Separate them with one space.","Do not proceed until the office confirms the assignment."]),
 w(4,7,"apply",["Use the exact template '$X approved; $Y under review.' A $100 request has $80 written approval. Complete X and Y.","$80 approved; $20 under review."]),
 w(4,8,"evaluate",["A handover says 'Load 480 is dispatched.' Driver availability is still an unmet dispatch condition. Replace dispatched with the taught three-word hold status and write the full sentence.","Load 480 is on hold."]),
 g(1,2,"remember",["Recall the auxiliary: ___ he work at night?","Does"]),
 g(1,2,"understand",["Which sentence expresses a regular schedule rather than a current action?","He closes at 5 PM every day","He is closing the gate now","He closed the gate yesterday"]),
 g(1,7,"apply",["Complete the first conditional: If you ___ $100, I'll take it. (add)","add"]),
 g(1,6,"analyze",["Compare a prohibition with absence of obligation. Which sentence forbids unloading?","You mustn't unload","You don't have to unload","You should unload"]),
 g(2,1,"remember",["Complete with the preposition for a starting point: I've been in logistics ___ 2024.","since"]),
 g(2,2,"understand",["Which question uses the statement order needed inside an indirect question?","Do you know when the delivery is?","Do you know when is the delivery?","Do you know when does the delivery is?"]),
 g(2,3,"apply",["Complete: We deliver ___ October 5th.","on"]),
 g(2,8,"analyze",["Which correction preserves the agreed $2,350 and explicitly rejects $2,530?","The agreed rate is $2,350, not $2,530","The agreed rate is $2,530, not $2,350","The agreed rate is $2,350 plus $2,530"]),
 g(3,5,"remember",["Complete the taught cause phrase with one word: delayed due ___ heavy traffic.","to"]),
 g(3,4,"understand",["Which sentence means loading is still incomplete?","We have not loaded yet","We have already loaded","We finished loading yesterday"]),
 g(3,7,"analyze",["The instruction is 'Call before entering.' Which paraphrase keeps its sequence?","First call, then enter","First enter, then call","Enter without calling"]),
 g(4,3,"remember",["Complete the conditional phrase from negotiation: provided ___.","that"]),
 g(4,1,"understand",["Which sentence preserves the conditional meaning of subject to approval?","We can cover if approval is given","Approval has already been given","We can cover without approval"]),
 g(4,4,"apply",["Complete the fallback: If Gate B ___ closed, contact dispatch. (be)","is"]),
 g(4,8,"analyze",["The original says 'Do not depart until written approval.' Which revision reverses its permission condition?","Depart before written approval","Wait until written approval","Do not depart before written approval"])
];
