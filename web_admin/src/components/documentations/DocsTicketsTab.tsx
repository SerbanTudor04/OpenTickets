import DocsShowQuestionsAndAnswers from "./DocsShowQuestionsAndAnswers";
import tickets_q_and_a from "./content/DocsTicketsContent";

export default function DocsTicketsTab() {

    
    return(
            <DocsShowQuestionsAndAnswers data={tickets_q_and_a}/>
    )
}