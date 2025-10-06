import { Analysis, ToneOption } from '../components/EmailLawBuddy';

/**
 * Contains example data for the Email Law Buddy tool.
 * This is used to demonstrate the feature's functionality without requiring
 * the user to provide their own email content initially.
 */

export const exampleReceivedEmail = `Subject: URGENT - Weekend Schedule & Right of First Refusal

You were 15 minutes late for pickup last Friday. This is unacceptable and a violation of our agreement. The kids were upset.

I'm taking them to a birthday party on Saturday at 2 PM, so I need you to drop them off at my house at 1 PM instead of the usual 6 PM. This is non-negotiable as I've already RSVP'd. Remember that our order includes a 'Right of First Refusal' clause, which applies here since I'll be with them.

Also, you still haven't paid me for the section 7 expenses from two weeks ago. I need that money by tomorrow.`;

export const exampleAnalysis: Analysis = {
    tone: "Demanding and Accusatory",
    summary: "The sender is making accusations about tardiness, unilaterally changing the weekend schedule, demanding payment, and referencing legal clauses.",
    key_demands: [
        "Drop kids off at 1 PM on Saturday instead of 6 PM.",
        "Pay for the section 7 expenses by tomorrow."
    ],
    key_points_suggestion: `- Respond to the demand: "Drop kids off at 1 PM on Saturday instead of 6 PM."\n- Respond to the demand: "Pay for the section 7 expenses by tomorrow."`,
    legal_jargon: [
        { term: "Right of First Refusal", context: "Remember that our order includes a 'Right of First Refusal' clause, which applies here since I'll be with them." },
        { term: "section 7 expenses", context: "Also, you still haven't paid me for the section 7 expenses from two weeks ago." }
    ]
};

export const exampleKeyPoints = `1. I will adhere to the court-ordered exchange time of Saturday at 6 PM. I cannot accommodate the 1 PM change.
2. The dentist payment was sent via e-transfer this morning. Please check your email.
3. I was 10 minutes late, not 15, due to unexpected traffic. I texted you that I was running late.`;

export const exampleDrafts: Record<ToneOption, string> = {
    'BIFF': `Subject: Re: URGENT - Weekend Schedule

Hi [Co-Parent's Name],

Thanks for the update.

Per our court order, I will be dropping the children off at the regular time of 6 PM on Saturday. I'm not able to change the time this weekend.

Regarding the section 7 expenses, the e-transfer was sent this morning. The confirmation number is #12345.

Best,
[Your Name]`,
    'Grey Rock': `Subject: Re: URGENT - Weekend Schedule

Noted. I will see you at 6 PM on Saturday as per the schedule. The payment was sent.`,
    'Friendly Assertive': `Subject: Re: Weekend Schedule

Hi [Co-Parent's Name],

Thanks for letting me know about the party.

I'll be sticking to the court-ordered exchange time of 6 PM on Saturday. The payment for the expenses was sent this morning.

To avoid confusion in the future, could you please confirm you have a copy of the finalized schedule so we are both working from the same document?

Thanks,
[Your Name]`,
    'Professional (for Lawyers)': `Subject: Weekend Schedule & Expenses

Dear [Lawyer's Name],

Thank you for your email.

I am writing to confirm that I will be adhering to the court-ordered exchange time of Saturday at 6 PM.

The section 7 payment you referenced was sent on [Date].

Please let me know if your client has any further questions that should be directed through you.

Regards,
[Your Name]`,
    'Passive': `Subject: Re: Weekend Schedule

Hi [Co-Parent's Name],

Okay, I will try to be there at 1 PM but traffic can be bad around then. I will send the money for the expenses as soon as I can.

Thanks,
[Your Name]`,
    'Passive-Aggressive': `Subject: Re: URGENT - Weekend Schedule

It must be nice that you can just decide to change the schedule whenever a party comes up. I'm sure the kids were very "upset" when I was a few minutes late.

I'll see what I can do about the time. I already sent the money, you should have it by now if you checked.`,
    'Aggressive': `Subject: Re: URGENT - Weekend Schedule

Absolutely not. The court order says 6 PM and that's when I'll be there. Your poor planning is not my emergency.

You need to pay attention to the schedule we are supposed to be following. I sent the money, stop harassing me about it.`,
};