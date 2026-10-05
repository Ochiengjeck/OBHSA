<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogPostSeeder extends Seeder
{
    /**
     * Seed OBHSA's blog with real, on-brand posts for per-diem caregivers
     * and the New Hampshire facilities they staff.
     */
    public function run(): void
    {
        $posts = [
            [
                'title' => '5 Tips for Your First Per-Diem Shift',
                'excerpt' => 'Walking into a new facility for the first time is different from your regular job. Here\'s how to start strong.',
                'body' => <<<'BODY'
                    Your first per-diem shift is a little different from showing up to a job you already know. You're walking into a new building, a new team, and a new set of routines, often with only a quick orientation packet to go on. A few minutes of preparation goes a long way toward making that first shift feel less like a cold start.

                    Arrive early and introduce yourself to the charge nurse or shift supervisor right away. Every facility runs a little differently — medication pass times, documentation systems, call-light protocols — and the fastest way to get oriented is to ask directly rather than guess. Most staff are used to working alongside per-diem caregivers and expect a few orientation questions.

                    Bring your own basics: a working pen, a badge holder, a watch with a second hand if your facility still checks pulses manually, and a printed or saved copy of your license and any facility-specific paperwork OBHSA has already sent ahead. Showing up prepared signals that you're reliable, which matters when a facility is deciding whether to request you again.

                    Read the shift report carefully and don't be afraid to ask the outgoing staff follow-up questions about specific residents or patients. You don't have the weeks of background knowledge a permanent staff member has, so a clarifying question about a care plan or a fall risk is always worth the thirty seconds it takes.

                    Keep your OBHSA recruiter in the loop. If a facility's assignment doesn't match what was described, or if you run into a credentialing or scheduling issue mid-shift, let us know the same day. We can only advocate for you and smooth things over with the facility if we hear about it while it's still fresh.

                    Most importantly, remember that a good first shift is what turns into repeat requests. Facilities remember caregivers who show up on time, ask good questions, and leave clear documentation — and those are exactly the per-diem caregivers who get first pick of the best shifts going forward.
                    BODY,
            ],
            [
                'title' => 'How Facilities Can Reduce Reliance on Agency Staffing',
                'excerpt' => 'Agency staffing is a safety net, not a strategy. Here\'s how facility administrators can tighten their core schedule and use per-diem support more intentionally.',
                'body' => <<<'BODY'
                    Every facility administrator has lived through the same math: a handful of call-offs, a resignation nobody saw coming, and suddenly a third of next week's shifts are open. Agency staffing fills the gap, but leaning on it as a permanent fix gets expensive fast and can erode continuity of care if it's not managed deliberately.

                    The first lever most facilities underuse is internal flexibility. A voluntary per-diem or "float pool" of your own core staff — people willing to pick up extra shifts at a modest premium — can absorb a surprising amount of the volatility that would otherwise go to an outside agency. It keeps continuity high because the people filling gaps already know your residents, your charting system, and your team.

                    The second lever is forecasting. Call-offs and vacancies are rarely as random as they feel in the moment. Tracking patterns by day of week, by unit, and by season turns staffing from reactive firefighting into a plan you can act on two or three weeks ahead, which is exactly the window where a staffing partner like OBHSA can line up the right caregiver instead of scrambling for anyone available.

                    The third lever is retention of your core team, since every permanent hire you keep is one less shift that ever needs to be filled externally. Consistent scheduling, predictable float expectations, and simply asking staff what's driving turnover before they hand in notice all cost less than the agency bill that follows a bad quarter of attrition.

                    None of this means agency staffing is something to avoid entirely — it's the right tool for genuine surges, hard-to-fill specialty shifts, and short-notice gaps. The goal isn't zero reliance on outside staffing; it's using it as a deliberate, planned-for tool rather than the default answer to every open shift.

                    That's the kind of partner we aim to be: predictable enough that you can plan around us, and flexible enough to be there on the days you couldn't plan for.
                    BODY,
            ],
            [
                'title' => 'Understanding NH Licensure Requirements for RNs and LPNs',
                'excerpt' => 'A straightforward look at what New Hampshire requires to practice as an RN or LPN, including how the Nurse Licensure Compact affects per-diem work.',
                'body' => <<<'BODY'
                    New Hampshire nursing licensure runs through the New Hampshire Board of Nursing, which issues both RN and LPN licenses and sets the renewal, continuing education, and background-check requirements every caregiver working in the state has to meet. If you're new to NH or new to nursing entirely, it's worth understanding the basics before your first shift, since credentialing delays are one of the most common reasons a start date slips.

                    New Hampshire is a member of the Nurse Licensure Compact, which means an RN or LPN holding a multistate license from another compact state can generally practice in New Hampshire without applying for a separate NH license. This is a major advantage for per-diem caregivers who split time between states — but it only applies if your home-state license is itself issued as a multistate license, not a single-state one, so it's worth checking that detail with your home board before assuming compact privileges apply.

                    If you don't hold compact privileges, you'll need to apply directly to the NH Board of Nursing, which typically involves verifying your original license through Nursys, submitting fingerprints for a background check, and paying the applicable fee. Processing times vary, so anyone relocating to take on per-diem work in New Hampshire should start this process well before their intended start date.

                    Renewal in New Hampshire happens on a set cycle with continuing education requirements attached, and letting a license lapse — even briefly — can pause your eligibility to pick up shifts until it's reinstated. We track every caregiver's license and certification expiration dates on our end and send reminders well ahead of the deadline, but the license itself is always the nurse's own responsibility to keep current.

                    Specialty certifications, like ACLS or PALS, aren't set by the Board of Nursing but are frequently required by individual facilities depending on the unit. When we match you to a shift, we check the facility's specific requirements against your file so there are no surprises on either side when you show up.

                    If you're ever unsure whether your current license status qualifies you for a shift in New Hampshire, ask your OBHSA recruiter before accepting the assignment. It's a quick conversation, and it's always better to sort it out ahead of time than at the door on shift day.
                    BODY,
            ],
            [
                'title' => 'Why Per-Diem Work Is Growing Among Healthcare Caregivers',
                'excerpt' => 'More RNs, LPNs, and CNAs are choosing per-diem work over a single staff position. Here\'s what\'s actually driving the shift.',
                'body' => <<<'BODY'
                    Ask most caregivers who've moved into per-diem work why they made the switch, and the answer usually isn't just "better pay," even though per-diem rates are often higher. It's control — over which shifts they work, which facilities they return to, and how their schedule fits around the rest of their life.

                    A full-time staff position comes with a fixed schedule set months in advance, rotating weekends, and limited say in which unit you're assigned to on a given week. Per-diem work flips that: you choose which shifts to accept, which facilities you want to build a relationship with, and how many hours you want in a given week, whether that's a full schedule or something lighter around school, a second job, or family responsibilities.

                    Burnout is a real part of this trend too. Years of being locked into one unit, one set of coworkers, and one facility's particular pressures wears on people. Per-diem work lets a caregiver step back from a specific environment that's become draining without stepping away from the profession altogether — sometimes that's exactly the reset someone needs to stay in healthcare at all.

                    There's also a skills argument that doesn't get talked about enough: caregivers who rotate through multiple facilities see a wider range of patient populations, documentation systems, and care approaches than someone who's spent years in a single unit. That variety builds adaptability and confidence that's hard to get any other way.

                    Pay transparency matters too. Per-diem rates are typically quoted shift by shift, so there's no ambiguity about what a given day is worth before you accept it — compared to a salaried position where differentials, overtime rules, and raises can feel opaque.

                    None of this means per-diem work is right for every caregiver at every stage of their career — plenty of people want and value the stability of a single staff position, and that's a legitimate choice too. But for caregivers who want more control over their time without leaving the field, it's easy to see why per-diem has become the fastest-growing way to practice.
                    BODY,
            ],
            [
                'title' => 'A Facility Administrator\'s Guide to Staffing Partnerships',
                'excerpt' => 'Choosing a staffing partner is a long-term decision, not a one-time vendor pick. Here\'s what to look for before you sign.',
                'body' => <<<'BODY'
                    Bringing on a staffing agency is easy to treat as a transactional decision — whoever can fill tomorrow's open shift wins the business. But the facilities that get the most value out of a staffing partnership treat it the way they'd treat any long-term vendor relationship: by evaluating fit, not just availability.

                    Start with credentialing rigor. Ask any prospective partner exactly how they verify licenses, run background checks, and confirm required certifications before a caregiver ever shows up at your door. A partner who can walk you through their process in detail, rather than giving a vague assurance, is one who takes it seriously — and it's your facility's liability on the line if they don't.

                    Ask how fill requests actually get handled day to day. Is there a single point of contact who knows your facility's units, preferences, and problem history, or does every request go into a generic queue? Continuity on the agency side — the same recruiter or coordinator who already knows your facility — tends to produce much better matches than a rotating cast of people handling your account.

                    Push for real numbers on fill rate and no-show rate, not just a sales pitch. A partner who's confident in their performance will share this data; one who hedges or deflects is telling you something too.

                    Look closely at how a partner treats their caregivers, not just how they treat you. Agencies that pay promptly, communicate clearly, and advocate for their caregivers tend to retain a deeper, more reliable bench — which directly translates into better coverage for your facility when you need it most. An agency with high caregiver turnover of its own will eventually show up as inconsistency in who shows up at your facility.

                    Finally, treat the relationship as a two-way conversation. The facilities that get the best results from a staffing partnership are the ones that give feedback after each placement, flag issues early, and let their recruiter understand not just "we need an RN Tuesday" but what kind of RN tends to succeed on their specific unit. That context is what turns a vendor into a genuine staffing partner.
                    BODY,
            ],
            [
                'title' => 'Balancing Flexibility and Income as a Per-Diem CNA',
                'excerpt' => 'Per-diem work gives CNAs real control over their schedule — but managing variable income takes a different approach than a steady paycheck.',
                'body' => <<<'BODY'
                    Per-diem work is one of the best ways for a CNA to take control of their schedule, but it does come with one real trade-off compared to a staff position: your income varies week to week based on how many shifts you pick up. Managing that well is less about earning more and more about planning differently.

                    The first step is knowing your real baseline. Look back at a few months of shifts and figure out the minimum number of hours you can commit to in a typical week without burning out, then treat that as your floor for budgeting purposes. Anything above that floor — extra shifts, weekend differentials, holiday premiums — becomes the flexible part of your income rather than something you're depending on to cover fixed bills.

                    Building a small buffer matters more for per-diem caregivers than for salaried staff, simply because a slow week is more likely. Even a modest cushion of one or two weeks' worth of your baseline income takes the pressure off picking up every available shift out of financial necessity rather than genuine availability.

                    Picking up shifts consistently at facilities you like also pays off over time. Facilities remember reliable per-diem CNAs and often extend first pick on high-demand or premium-rate shifts to caregivers they already trust — which means the caregivers who build relationships with a handful of regular facilities often end up with more consistent income than those who take whatever's available wherever.

                    Keep an eye on how taxes work differently for per-diem income depending on how you're classified and paid, and don't assume it works the same way a single W-2 job does. A short conversation with a tax professional familiar with healthcare staffing arrangements is worth it the first year you take on per-diem work seriously.

                    Flexibility and income stability aren't actually opposites — they just take more deliberate planning to balance than a fixed paycheck does. CNAs who treat per-diem work as a schedule to manage, not just shifts to grab, tend to get the best of both.
                    BODY,
            ],
            [
                'title' => 'What to Look for in a Healthcare Staffing Agency',
                'excerpt' => 'Not all staffing agencies operate the same way. Here\'s a practical checklist for caregivers evaluating who to work with.',
                'body' => <<<'BODY'
                    Choosing a staffing agency is choosing who stands behind your paycheck, your credentialing, and your reputation with every facility you work. It's worth being as deliberate about that choice as you'd be about any employer — because that's effectively what it is.

                    Start with pay transparency. A good agency tells you the rate for a shift before you accept it, not after, and doesn't bury differentials or stipends in fine print you only discover on payday. If an agency is vague about pay when you ask directly, that's worth noticing.

                    Ask how quickly they actually pay. Weekly pay is standard among serious healthcare staffing agencies; anything slower is worth asking about directly, and a pattern of late or inconsistent pay is one of the clearest signs of an agency in financial trouble.

                    Look at how much support you get once you're credentialed. Does a real recruiter respond when you have a question about an assignment, or does every message go to a general inbox that takes days to answer? The agencies that retain caregivers long-term are almost always the ones where you can reach an actual person who knows your file.

                    Ask about the range and quality of facilities on their roster. An agency with deep, long-standing relationships with well-run facilities can usually get you into better assignments than one that's constantly chasing whatever desperate, short-notice gap just opened up somewhere.

                    Pay attention to how the agency handles credentialing and compliance tracking. License renewals, certification expirations, and required trainings are easy to lose track of on your own — a good agency tracks these proactively and gives you advance notice, rather than leaving you to discover a lapsed certification the morning of a shift.

                    Finally, trust how you're treated during the hiring and onboarding process itself. An agency that's thorough, responsive, and straightforward before you've even worked your first shift is usually a good preview of what working with them long-term will actually be like.
                    BODY,
            ],
        ];

        foreach ($posts as $index => $post) {
            BlogPost::query()->updateOrCreate(
                ['slug' => Str::slug($post['title'])],
                [
                    'title' => $post['title'],
                    'excerpt' => $post['excerpt'],
                    'body' => $post['body'],
                    'featured_image_path' => null,
                    'author_id' => null,
                    'is_published' => true,
                    'published_at' => now()->subDays(($index + 1) * 12),
                ],
            );
        }
    }
}
