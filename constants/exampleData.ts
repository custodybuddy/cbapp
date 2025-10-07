import { EmailBuddyResponse } from '../types/ai';

/**
 * Contains example data for the Email Law Buddy tool.
 * This is used to demonstrate the feature's functionality without requiring
 * the user to provide their own email content initially.
 */
const exampleReceivedEmail = `Subject: URGENT - Weekend Schedule & Right of First Refusal

You were 15 minutes late for pickup last Friday. This is unacceptable and a violation of our agreement. The kids were upset.

I'm taking them to a birthday party on Saturday at 2 PM, so I need you to drop them off at my house at 1 PM instead of the usual 6 PM. This is non-negotiable as I've already RSVP'd. Remember that our order includes a 'Right of First Refusal' clause, which applies here since I'll be with them.

Also, you still haven't paid me for the section 7 expenses from two weeks ago. I need that money by tomorrow.`;


const exampleResponse: EmailBuddyResponse = {
    analysis: {
        tone: "Demanding and Accusatory",
        summary: "The sender is making accusations about tardiness, unilaterally changing the weekend schedule, demanding payment, and referencing legal clauses.",
        key_demands: [
            "Drop kids off at 1 PM on Saturday instead of 6 PM.",
            "Pay for the section 7 expenses by tomorrow."
        ],
        legal_jargon: [
            { term: "Right of First Refusal", context: "Remember that our order includes a 'Right of First Refusal' clause..." },
            { term: "section 7 expenses", context: "Also, you still haven't paid me for the section 7 expenses..." }
        ]
    },
    drafts: {
        biff: `Subject: Re: Weekend Schedule & Right of First Refusal

Hi [Co-Parent's Name],

Thanks for the information about the party.

Per our court order, the exchange time is Saturday at 6 PM. I will be adhering to that schedule. The payment for the Section 7 expense you mentioned was sent via e-transfer this morning.

Best,
[Your Name]`,
        greyRock: `Subject: Re: Weekend Schedule & Right of First Refusal

The 6 PM exchange time on Saturday is noted. The payment was sent.`,
        friendlyAssertive: `Subject: Re: Weekend Schedule & Right of First Refusal

Hi [Co-Parent's Name],

Thanks for the update.

I'll be sticking to the court-ordered exchange time of 6 PM on Saturday. The payment for the expenses was also sent this morning.

To ensure we are on the same page for future planning, could you please confirm you have the latest copy of our court order?

Thanks,
[Your Name]`
    }
};

export const exampleData = {
    email: exampleReceivedEmail,
    response: exampleResponse,
};
