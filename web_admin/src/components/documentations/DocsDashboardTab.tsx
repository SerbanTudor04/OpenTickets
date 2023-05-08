import DocsShowQuestionsAndAnswers from "./DocsShowQuestionsAndAnswers";
import { dashboard_q_and_a } from "./content/DocsDashboardContent";

export default function DocsDashboardTabs() {

    // console.log(dashboard_q_and_a);
    return(
            <DocsShowQuestionsAndAnswers data={dashboard_q_and_a}/>
    )
}