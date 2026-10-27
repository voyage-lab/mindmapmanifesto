const { useState, useEffect } = React;

const SERIES = 'Conversations';
const ACCENT = '#f472b6';
const NUMBERS = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty','Twenty-One','Twenty-Two'];

/* ── Shared Components ───────────────────────────────────────── */

function ProgressBar({ pct }) {
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, height:3, background:'#14141c' }}>
      <div style={{ height:'100%', width:`${pct}%`, background:ACCENT, transition:'width 0.5s ease' }}/>
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div style={{ fontSize:'0.7rem', letterSpacing:'0.2em', textTransform:'uppercase', color:ACCENT, marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:500 }}>
      <span style={{ width:28, height:1, background:ACCENT, opacity:0.5, flexShrink:0, display:'block' }}/>
      {children}
    </div>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div style={{ fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#8888a0' }}>
      Part <span style={{ color:ACCENT, fontWeight:600 }}>{current}</span> of {total}
    </div>
  );
}

function ArrowRight({ size = 16 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
}

function ArrowLeft({ size = 16 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>);
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:6, color:'#8888a0', background:'none', border:'none', cursor:'pointer', fontSize:'0.82rem' }}>
      <ArrowLeft size={15}/> Back
    </button>
  );
}

function BottomNav({ onBack, onNext, nextLabel = 'Continue' }) {
  return (
    <div style={{ display:'flex', justifyContent: onBack ? 'space-between' : 'flex-end', alignItems:'center', gap:16, marginTop:64, paddingTop:32, borderTop:'1px solid #1e1e2a' }}>
      {onBack && <BackBtn onClick={onBack}/>}
      <button onClick={onNext}
        style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'13px 26px', borderRadius:12, fontSize:'0.875rem', fontWeight:600, border:'none', cursor:'pointer', background:`linear-gradient(135deg,${ACCENT},#db2777)`, color:'#fff', textAlign:'left' }}>
        {nextLabel} <ArrowRight/>
      </button>
    </div>
  );
}

function InsightCard({ label = 'Key Insight', children }) {
  return (
    <div style={{ background:'#0d0d12', border:`1px solid ${ACCENT}33`, borderRadius:18, padding:34, marginBottom:36, position:'relative' }}>
      <div style={{ fontSize:'0.68rem', letterSpacing:'0.2em', textTransform:'uppercase', color:ACCENT, marginBottom:14, fontWeight:600 }}>{label}</div>
      <p style={{ fontSize:'clamp(1.05rem,2.4vw,1.3rem)', lineHeight:1.72, color:'#e8e8ed', position:'relative' }}>{children}</p>
    </div>
  );
}

function Footer() { return <footer style={{ textAlign:'center', marginTop:56, color:'#8888a0', fontSize:'0.75rem' }}>© 2026 MindMapManifesto.com</footer>; }
function PageWrapper({ children, maxWidth = 820 }) { return <div style={{ position:'relative', zIndex:1, maxWidth, margin:'0 auto', padding:'60px 24px 100px' }}>{children}</div>; }

function Prose({ children }) {
  return <p style={{ fontSize:'clamp(0.95rem,2.1vw,1.1rem)', lineHeight:1.88, color:'rgba(220,215,240,0.72)', marginBottom:22 }}>{children}</p>;
}

function PullQuote({ children }) {
  return (
    <div style={{ borderLeft:`2px solid ${ACCENT}40`, paddingLeft:24, marginBottom:30, marginTop:4 }}>
      <p style={{ fontStyle:'italic', fontSize:'clamp(1rem,2.2vw,1.18rem)', lineHeight:1.78, color:`${ACCENT}a0` }}>{children}</p>
    </div>
  );
}

/* a paper note with an optional label, title and intro line */
function Card({ label, title, intro, children }) {
  return (
    <div style={{ background:'#0d0d12', border:`1px solid ${ACCENT}2e`, borderRadius:16, padding:'26px 28px', marginBottom:30 }}>
      {label && <div style={{ fontSize:'0.63rem', letterSpacing:'0.22em', textTransform:'uppercase', color:`${ACCENT}99`, marginBottom: title ? 8 : 16, fontWeight:600 }}>{label}</div>}
      {title && <h3 style={{ fontSize:'1.35rem', fontWeight:700, color:'#e8e8ed', marginBottom:14 }}>{title}</h3>}
      {intro && <p style={{ fontSize:'1rem', lineHeight:1.65, color:'#b8b8c8', marginBottom: children ? 16 : 0 }}>{intro}</p>}
      {children}
    </div>
  );
}

function Points({ items }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {items.map((t, i) => (
        <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:ACCENT, flexShrink:0, opacity:0.6, marginTop:12 }}/>
          <p style={{ fontSize:'1rem', lineHeight:1.65, color:'rgba(220,215,240,0.78)' }}>{t}</p>
        </div>
      ))}
    </div>
  );
}

function Steps({ items, start = 1 }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {items.map((t, i) => (
        <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1px solid ${ACCENT}55`, fontSize:'0.78rem', marginTop:1 }}>{i + start}</div>
          <p style={{ fontSize:'1rem', lineHeight:1.65, color:'rgba(220,215,240,0.78)' }}>{t}</p>
        </div>
      ))}
    </div>
  );
}

function Terms({ items }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {items.map(([t, d], i) => (
        <div key={i} style={{ borderLeft:`2px solid ${ACCENT}4d`, paddingLeft:14 }}>
          <div style={{ fontWeight:700, fontSize:'1.1rem', color:'#e8e8ed', marginBottom:2 }}>{t}</div>
          <p style={{ fontSize:'0.95rem', color:'#8888a0', lineHeight:1.6 }}>{d}</p>
        </div>
      ))}
    </div>
  );
}

function Chapter({ children, n, label, title, nextLabel, onBack, onNext }) {
  return (
    <div style={{ background:'#050507', minHeight:'100vh', position:'relative' }}>
      <ProgressBar pct={n / PARTS.length * 100}/>
      <PageWrapper>
        <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:56 }}>
          <BackBtn onClick={onBack}/>
          <StepIndicator current={n} total={PARTS.length}/>
        </nav>
        <div style={{ marginBottom:36, animation:'mmm-fadeUp 0.7s ease-out' }}>
          <Eyebrow>{label}</Eyebrow>
          <h1 style={{ fontSize:'clamp(1.9rem,4.6vw,2.95rem)', fontWeight:700, lineHeight:1.18, marginBottom:8, color:'#e8e8ed' }}>{title}</h1>
        </div>
        {children}
        <BottomNav onBack={onBack} onNext={onNext} nextLabel={nextLabel}/>
        <Footer/>
      </PageWrapper>
    </div>
  );
}

/* ── Screen 0: Landing ───────────────────────────────────────── */
function LandingScreen({ onNext }) {
  return (
    <div style={{ background:'#000', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'40px 24px', maxWidth:820, display:'flex', flexDirection:'column', alignItems:'center', gap:36, animation:'mmm-reveal 1.5s cubic-bezier(0.16,1,0.3,1) forwards' }}>
        <div style={{ fontSize:'0.65rem', letterSpacing:'0.6em', color:'rgba(244,114,182,0.5)', textTransform:'uppercase', fontWeight:700 }}>On The Diary of a CEO</div>
        <div>
          <h1 style={{ fontSize:'clamp(2.8rem,10vw,6rem)', fontWeight:700, letterSpacing:'-0.02em', color:'white', marginBottom:10 }}>Vanessa Van Edwards</h1>
          <div style={{ fontSize:'clamp(0.9rem,2.2vw,1.3rem)', fontWeight:300, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em' }}>Conversations · Twenty-Two Parts</div>
        </div>
        <div style={{ maxWidth:600, borderLeft:'2px solid rgba(244,114,182,0.3)', paddingLeft:26, textAlign:'left' }}>
          <p style={{ fontStyle:'italic', fontSize:'clamp(0.95rem,1.9vw,1.13rem)', lineHeight:1.8, color:'rgba(255,255,255,0.55)' }}>
            “A fact is a stop sign; a story is a doorway.” How to connect with anyone, level by level, from someone who calls herself a recovering awkward person.
          </p>
        </div>
        <button onClick={onNext}
          style={{ background:'rgba(244,114,182,0.08)', border:'1px solid rgba(244,114,182,0.28)', borderRadius:9999, padding:'18px 52px', fontSize:'0.8rem', fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase', color:'white', cursor:'pointer' }}>
          Begin
        </button>
      </div>
    </div>
  );
}

/* ── Parts ───────────────────────────────────────────────────── */
const PARTS = [
  {
    title: 'The Connection Crisis',
    body: <>
      <Prose>Conversations are getting harder, more awkward and less satisfying. Vanessa Van Edwards, author of <em>Conversations: How to Connect With Anyone and Make Every Interaction Count</em>, calls conversation skills career insurance. We want to work with, be with and date people who are good at conversation, and in a time of huge technological change, the people who master it will have an advantage.</Prose>
      <InsightCard label="The last generation">She thinks this is <em>the last generation that will learn conversation from other humans.</em> The next will talk to technology more than to people.</InsightCard>
      <Card label="Conversation is the vehicle for getting what you want">
        <Points items={[
          <><strong>A promotion:</strong> a boss who connects with you is more likely to think of you.</>,
          <><strong>A soulmate:</strong> you need deep, connected conversation to really know each other.</>,
          <><strong>Less loneliness:</strong> fulfilling friendships give you a longevity boost.</>,
        ]}/>
      </Card>
      <Prose>The mistake is treating conversation as extra. Leaders focus on the idea, the tech or the business and forget the human element. Think of it like the gym: social health is critical to emotional health, and you need “conversation reps.” It’s a learnable skill, not something you’re born with, and it keeps paying off. She calls herself “a recovering awkward person”: she struggled for years because she asked the wrong questions and approached conversation the wrong way.</Prose>
      <Card label="The wrong way" title="Trying to impress, not discover" intro="Trying to impress makes conversation performative and deeply unfulfilling; that’s when small talk becomes soul-crushing. Master conversationalists, whom she has studied for 20 years, are more joyful, more confident and more authentically assertive. Conversations give them energy instead of draining it, whether they’re introverts or extroverts."/>
      <Card label="Symptoms of an exhausted conversationalist">
        <Steps items={[
          <><strong>Dread.</strong> You open your calendar and feel only dread about social plans.</>,
          <><strong>Overwhelm.</strong> You overthink socially, can’t switch your brain off, and worry only about what to say next. Usually you just haven’t learned the mechanics. There’s a blueprint, and once you know it, it gets easier.</>,
          <><strong>Leaving misunderstood.</strong> You walk away feeling you weren’t your best self.</>,
        ]}/>
      </Card>
      <PullQuote>Great conversationalists leave people thinking, “After talking to you, I understand myself better.”</PullQuote>
    </>,
  },
  {
    title: 'The Speed-Networking Experiment',
    body: <>
      <Prose>Twenty years ago she noticed that good conversationalists follow hidden blueprints, and eight years ago she started researching them formally. Across three experiments, she filmed 500 speed networkers with cameras in all four corners of the room. Good conversations look different: lots of gestures, leaning in, high energy, vocal charisma, rising volume. Bad ones look low-energy, with apologetic facial expressions and low volume.</Prose>
      <Prose>She gave them six conversation starters. After each timed conversation, people rated it from 1 (“the most awkward conversation ever”) to 5 (“I want to marry them, or at least connect on LinkedIn”).</Prose>
      <Card label="The results">
        <Terms items={[
          ['1 · “What was the highlight of your day?” (by far)', 'Not too deep, and a subtle swap for “How are you?” It asks the brain to search for something good and breaks autopilot: “Ooh, something new.”'],
          ['2 · “Working on anything exciting?”', 'A swap for “What do you do?” People who like their work talk about it with excitement; people who aren’t defined by their work share something better.'],
          ['3 · “Any fun plans coming up?”', 'Brings up a possible shared future. We bond when someone is doing something fun we’d like to do too.'],
          ['4 · “What’s your story?” (split)', 'People gave it a 5, or a “0,” which wasn’t even on the scale. Extroverts default to it, but it’s a level 3 question that puts introverts into cortisol, fight-or-flight and conversational fear.'],
          ['5 · “How are you?”', 'Socially scripted. Autopilot.'],
          ['6 · The weather, or “What do you do?” (worst)', 'Scripted, factual, a dead end. People ran out of things to say.'],
        ]}/>
      </Card>
      <InsightCard label="What the winners share">The top three all <em>hunt for something good</em> and build excitement about other parts of the person’s life. The extroverts’ mistake is asking questions that are too deep, too fast: “What’s your greatest goal in life?” “I don’t know you.” That split result led to her key insight: there’s a hierarchy, and conversation moves through levels.</InsightCard>
    </>,
  },
  {
    title: 'The Three Levels',
    body: <>
      <Prose>Conversation is less fluid than we think. Building on the work of Dr. Dan McAdams, she argues that the brain processes social facts from least to most intimate, so you can’t reach someone’s dreams and worries without the basics first. Skipping ahead feels invasive, or like an interrogation.</Prose>
      <Card label="The levels">
        <Terms items={[
          ['Level 1 · General traits', 'The treasure hunt. Put the person at ease, keep the facts, and add story and emotion.'],
          ['Level 2 · Personal concerns', 'Dream building. Motivations, goals, values and worries: where real connection starts.'],
          ['Level 3 · Self-narrative', 'The story someone tells themselves about themselves. Reserve it for your most important people.'],
        ]}/>
      </Card>
      <InsightCard label="Her challenge">Think of the <em>five people you interact with most</em> and place each one on a level. Patterns will show up.</InsightCard>
    </>,
  },
  {
    title: 'Level 1: The Treasure Hunt',
    body: <>
      <Prose>This is why the first minutes with someone feel like “Googling” them: where are you from, what do you do, are you married, where do you live? The goal is to put the person at ease, keep the facts, and add story and emotion.</Prose>
      <PullQuote>A fact is a stop sign; a story is a doorway.</PullQuote>
      <Card label="Three level 1 questions">
        <Steps items={[
          <><strong>“What’s your personal passion project?”</strong> A hunt for stories that hints at values; you’ll often find out about marriage and kids without asking. Ask it in the first few minutes, after the basic greeting, not as your literal first line.</>,
          <><strong>“Working on anything exciting these days?”</strong></>,
          <><strong>“Have any fun plans coming up?”</strong> These also become callbacks later (“Last time you mentioned X, how’s it going?”), and people start bringing these things to you.</>,
        ]}/>
      </Card>
      <InsightCard label="Conversational courage">“How are you?” is safe. <em>Better questions make you memorable,</em> and they take courage.</InsightCard>
      <Prose>Conversation now has to compete with the feed. At a PTA meeting she went to so she could meet other moms, everyone was scrolling. So your questions and answers need to be “dopamine-worthy”: give people a little chemical boost, what she calls conversational confetti.</Prose>
    </>,
  },
  {
    title: 'Making Level 1 Memorable',
    body: <>
      <Card label="Howard Stern" title="Information gaps" intro="She analyzed thousands of his transcripts. The brain hates not knowing, so words like the weirdest, most surprising, biggest, worst and most embarrassing create intrigue.">
        <Points items={[
          '“What’s the weirdest thing you’ve ever done?”',
          '“The most surprising thing happened yesterday. Want to hear it?”',
          '“Guys, the craziest thing happened yesterday…” and the phones go down.',
        ]}/>
      </Card>
      <Card label="Jerry Seinfeld" title="Number questions" intro="Fans are often too starstruck to talk, so he asks, “How long have you two been together?” If it’s 38 years: “What’s been the highlight?” If it’s short: “You’re in the honeymoon phase, the best part.” It’s factual, so it’s easy for introverts and CEOs, and it opens into a story."/>
      <InsightCard label="Not toxic positivity">It doesn’t have to be positive. <em>Look for real emotion and story.</em> If someone says “I don’t have a passion project, I’m going through a hard time,” that’s a chance to connect more deeply: “Is there anything I can do?” or “Do you want to talk about it?”</InsightCard>
      <Prose>At one party, shoes came off at the door and the rule was that you couldn’t talk about what you do. It forced her off autopilot and into creativity. Great conversation doesn’t have to stick to the same boring topics.</Prose>
      <PullQuote>“What do you talk about when you don’t talk about work?”</PullQuote>
    </>,
  },
  {
    title: 'Level 1 at Work',
    body: <>
      <Card label="For introverts" title="Choose your hard" intro="Effortful conversation is tiring, but shallow small talk is exhausting too: standing around at events talking about nothing, waiting to get home to Netflix. Choose your hard: boring and forgettable, or breaking the script to learn something and maybe find joy."/>
      <Prose>Many founders think conversation is anti-productive. The research shows the opposite: connected people collaborate better, and engaged employees work better together. Communication friction costs money, through self-doubt, no psychological safety, poor brainstorming, withheld information and silos.</Prose>
      <InsightCard label="Great level 1 is enough">You don’t need level 3 with everyone at work, or with your Uber driver. Easy level 1 builds <em>“loose ties”</em> that make us more productive: the first five minutes of meetings become enjoyable, and people show up on time. It’s also the shortcut for time-poor leaders, who often try to act warm out of obligation (“How are the kids?”) and get scripted answers back (“Good, busy, but good”).</InsightCard>
      <Card label="The team intervention" title="“Tell me something good”" intro="Once a week, start the meeting with it. Everyone shares one win, small or big. It takes three to five minutes, gives good level 1 a safe, framed, time-boxed space, and prevents complaining. Her team does it on Tuesdays."/>
      <Card label="Adapt it">
        <Points items={[
          'At book signings she asks “What was your favorite part?” or “What did you learn most?” That’s actually level 2, which is fine after someone has listened to you for an hour.',
          'With a taxi driver: “Going anywhere exciting today?”',
          'The questions are guidelines, not prescriptions. Adapt them to your context.',
          'If someone doesn’t want to talk, respect it. Questions are bids; if they don’t take the bait, they’re not your person or it’s not their day. Have the courage to be disliked, and don’t waste your energy.',
        ]}/>
      </Card>
    </>,
  },
  {
    title: 'Level 2: Dream Building',
    body: <>
      <Prose>Level 2 is motivations, goals, values and worries, and it’s where real connection starts. You’re at level 2 when you know what gets someone up in the morning and what keeps them up at night. She loves level 2, and admits she sometimes jumps there too fast.</Prose>
      <InsightCard label="Dream building">The goal is to make someone feel heard and understood: help them reveal a secret desire, dream, side hustle or passion. <em>Ask what they daydream about.</em> (Her own level 2: she’s quietly pitching a TV show.)</InsightCard>
      <Card label="Pet project vs. pest project" intro="People need to feel safe to share either one.">
        <Terms items={[
          ['Pet project', 'Something they love and think about. It carries pride.'],
          ['Pest project', 'A worry they want gone but are afraid to ask for help with. It carries shame.'],
        ]}/>
      </Card>
      <Card label="Level 2 questions">
        <Steps start={4} items={[
          <><strong>“What have you always wanted to learn?”</strong> It triggers a growth mindset, and quietly asks, “Will you grow with me?”</>,
          <><strong>“What’s your biggest goal right now?”</strong> Tie it to a moment: a birthday (“What’s your big goal this year?”), New Year, a new quarter, a performance review. Talking about goals releases dopamine, and thinking about your future self is motivating.</>,
          <><strong>Your signature question,</strong> built from what you love to talk about. More on that next.</>,
        ]}/>
      </Card>
      <Prose>We’ve become intrapersonal: mindset, mantras, affirmations, journaling, to-do lists, all done alone. People seem embarrassed to bring side hustles and passions into conversation. Give them permission and you become an ally. If they have no answer, that’s fine; introverts need time to process. Share your own.</Prose>
      <Card label="Do you have to genuinely care?" intro="She doesn’t always know yet whether she cares; you can’t know until you hear the answer. Your next best friend, or an insight that changes your business, can come from a random conversation, and many pivots in her business came from asking the right question. Leaders may not feel warm, but they know they need to be. That intention is enough."/>
      <PullQuote>“If you’re asking the question, you care enough to try.”</PullQuote>
    </>,
  },
  {
    title: 'Your Signature Question',
    body: <>
      <Prose>Reverse-engineer what you love to talk about, then ask questions that lead there. Steven loves psychology and behavior, so his would be “why” and “how” questions: “Why did you make that choice?” “What made you choose that path?”</Prose>
      <Card label="Signature questions">
        <Terms items={[
          ['Vanessa, while writing Conversations', '“What’s your favorite conversation starter?”'],
          ['Vanessa, while researching Cues', '“Who’s the most charismatic person you know?”'],
          ['Vanessa, while writing Captivate', '“What’s your favorite body language cue?”'],
          ['Amy Poehler', 'Ends her podcast with “What’s making you laugh lately?”'],
          ['Ginny Yurich, 1000 Hours Outside', '“What’s your favorite outdoor memory?”'],
        ]}/>
      </Card>
      <Card label="A tangent" title="Interview questions that get real answers">
        <Points items={[
          '“What’s your greatest weakness?” gets a rehearsed, fake answer.',
          <>Better: <strong>“What would your last manager say is your greatest weakness?”</strong> It’s less practiced, makes them see themselves from the outside, and you can verify it with a reference call: “When I call your previous manager, what will they say?”</>,
          <>Instead of “Tell me about a time you managed a project” (they’ll pick their best), ask <strong>“Tell me about the most recent time you managed a project,”</strong> within the last two or three months.</>,
        ]}/>
      </Card>
      <InsightCard label="The principle"><em>Recency plus other people’s views</em> gets real answers instead of rehearsed ones.</InsightCard>
    </>,
  },
  {
    title: 'Level 3: Your Self-Narrative',
    body: <>
      <Prose>Level 3 is the story you tell yourself about yourself: how you make sense of your journey and purpose. And it’s self-fulfilling. A narrative of hardship and bad luck brings more hardship and creates bad luck.</Prose>
      <InsightCard label="Gate level 3">Going too deep too fast is weird, especially at work, and causes <em>“vulnerability regret”:</em> you shared something in an unsafe place and it went badly. Authenticity is great; too much vulnerability too soon is awkward and sometimes unsafe. (Steven once had a candidate spend the first 25 minutes of an interview on very personal childhood experiences, and felt himself switching into counselor mode.)</InsightCard>
      <Card label="Two kinds of narrative">
        <Terms items={[
          ['Redemption', '“With hard work, grit and resilience I can overcome anything,” across work, love and parenting. These people live longer, have better immune systems and connections, feel happier, and have a strong internal locus of control.'],
          ['Contamination', 'Hardship happened to them and they can’t get through it. They’re victims of circumstance: unlucky and out of control.'],
        ]}/>
      </Card>
      <Prose>It’s about the frame, not the facts. Narratives aren’t fixed traits, and conversation is the main way to change them. Her hope: in a safe relationship, you can rewrite a contamination narrative into a redemption one.</Prose>
      <Card label="Hints people let slip">
        <Terms items={[
          ['Contamination', '“Everyone zigs and I zag.” “Bad things always happen to me.” “Of course, yet another thing.” Lots of always and never, black-and-white thinking, things seen as permanent.'],
          ['Redemption', '“Good things always happen to me.” “There’s always a silver lining.” “Just my luck, I got it!”'],
        ]}/>
      </Card>
      <Card label="Locus of control">
        <Terms items={[
          ['Internal', 'You have agency over your decisions and how you respond to what happens.'],
          ['External', 'Your worth comes from outside: compliments, likes, follows, invitations, friend counts.'],
        ]}/>
      </Card>
      <Prose>Steven’s analogy: a bird, free to fly anywhere, versus someone on a roller coaster, on a fixed track, just holding on. Believing in fate may go with the roller-coaster view, and possibly with worse mental health. “Do you believe in fate?” is a good level 3 question.</Prose>
    </>,
  },
  {
    title: '“Are You Lucky?”',
    body: <>
      <Prose>A casual-sounding level 3 question that tells you a lot. Steven calls it a great question for interviews and first dates. Vanessa says it predicts how someone will be as a partner, friend and colleague, because level 3 is about predicting behavior.</Prose>
      <Card label="Three kinds of answer">
        <Terms items={[
          ['A quick yes', 'High gratitude, agency and confidence; the speed of the answer matters. (Steven and Vanessa both said yes, and feel privileged.)'],
          ['“No, I don’t think I’m lucky”', 'Important to know. Don’t argue them out of it; that’s toxic positivity and makes them dig in. Get curious: why, what forces, when did it start, did you ever feel lucky? A bad event can flip someone from lucky to unlucky. Understand before you judge.'],
          ['“Well… kind of”', 'Either they’re not very introspective (they’ve never thought about it and are re-examining their whole life in front of you), or they don’t feel safe yet: you went too fast, or there’s shame or something unlucky they’re not ready to share.'],
        ]}/>
      </Card>
      <InsightCard label="Lucky people make their luck">In Richard Wiseman’s luck research (her lab has used his 10-question luck diagnostic), people who say they’re lucky have <em>lower anxiety, more extraversion, high openness to experience and relentless optimism.</em> They talk to lots of people. She’d like to study whether self-rated luck relates to income, age or privilege.</InsightCard>
      <Prose>She has thought about running “luck labs,” workshops that help people harvest their own sense of luck. She calls herself “kind of anti-gratitude”: gratitude can feel shaming, while feeling lucky is empowering.</Prose>
      <Card label="Rewriting your story" title="Fact vs. frame" intro="Self-authorship means asking: why do I believe this, and what’s the evidence? The facts stay the same; the frame changes. The breakup test almost always reveals someone’s narrative:">
        <Terms items={[
          ['Contamination', '“It nearly destroyed me. I don’t trust men or women anymore. I’m a shell of myself.” And it stays that way.'],
          ['Redemption', '“It was one of the worst times of my life, but it made me stronger. I know who not to choose now.” That’s anti-fragile.'],
        ]}/>
      </Card>
      <Prose>Would Steven go on a second date with someone who answered “absolutely not”? Probably not, he admitted, and Vanessa joked he’d get roasted for it. He’d stay curious, he clarified, but if they were very pessimistic he’d assume it wasn’t a match, because it drains him.</Prose>
    </>,
  },
  {
    title: 'The Five Archetypes',
    body: <>
      <Prose>From hundreds of narratives she has collected, she sees five self-narrative archetypes. They’re more art than science, and they aren’t fixed personality types like Myers-Briggs or the Enneagram; they’re a fluid frame on your story right now. They shape how you talk and bond, who you’re drawn to platonically and romantically, and what effectiveness and efficiency mean to you at work.</Prose>
      <Card label="How to find someone’s archetype">
        <Points items={[
          '“If you wrote a memoir, what would the title be?”',
          <>“What book, movie or TV character are you most like, in life choices, personality and core values (not looks)? Why?” <strong>The why matters most.</strong> Don’t assume: the traits they name tell you how they see themselves, whether or not you agree. If someone says Mother Teresa, you might not see it, but their reasons tell you a lot.</>,
        ]}/>
      </Card>
      <InsightCard label="The inconvenient truth of level 3">You often <em>won’t agree</em> with people’s self-narratives.</InsightCard>
      <Card label="Their answers">
        <Terms items={[
          ['Steven: Chris Gardner in The Pursuit of Happyness', 'At 18 or 19 he was shoplifting food, five months behind on rent and dodging landlords, and he watched it in bed. The bathroom-floor scene with the son felt like his own life, Gardner’s success gave him hope, and Gardner being Black mattered too.'],
          ['Vanessa: Claire Dunphy in Modern Family', 'Especially in her entrepreneurial years. She identifies first as a mother, spends most of her day with her kids, and is a bit awkward and neurotic. Her constant struggle: being an ambitious working mom who wants to do both perfectly, and can’t.'],
        ]}/>
      </Card>
      <Prose>Stuck? Try an AI prompt: “What book, movie or TV character is most like me? I am [mom, entrepreneur, neurotic]. My personality is [__]. My core values are [__].” It brainstorms characters with those traits.</Prose>
      <Card label="The five">
        <Steps items={['The Ambitious Hero', 'The Contented Pragmatist', 'The Selfless Helper', 'The Creative Disruptor', 'The Unlucky Struggler']}/>
      </Card>
    </>,
  },
  {
    title: 'The Ambitious Hero and the Contented Pragmatist',
    body: <>
      <Card label="Archetype one" title="The Ambitious Hero" intro="Has faced challenges and overcome them with grit. Never satisfied. Steven and Vanessa are both here.">
        <Terms items={[
          ['Inner voice', '“I got this. Hustle more. Bigger, better.”'],
          ['Shiny-object syndrome', 'Throwing new initiatives on the table before finishing the first. Steven has systems to stop it sinking the company, citing Jeff Bezos: he has enough ideas to sink the company and has to release them at a pace it can handle. Vanessa calls that self-knowledge: telling your team, “When I come with a new idea next week, say no.”'],
          ['Risks', 'Dreaming so big you burn out, using work to regulate yourself (“help more people, help all the people”), being accused of hustle culture, and burning others out with your pace and hours.'],
          ['Talk to them about', 'Goals, progress, metrics, growth. (Vanessa holds back from answering “How are you?” with “305% growth on Instagram.”) They love hearing about other people’s ambition too; her check-in texts are “How’s the biz? How are book sales?”'],
        ]}/>
      </Card>
      <Card label="Archetype two" title="The Contented Pragmatist" intro="Likes things as they are: if it’s not broken, don’t fix it. Grounded, not very ambitious, and loves habit, ritual and tradition.">
        <Terms items={[
          ['Struggles', 'When pushed to try harder or do more: “I’m good, life is good, why change?” Often seen as unambitious when they’re actually content. Two people in Vanessa’s life make great granola or smoothies; she says “Bottle it and sell it at the farmers market!” and they ask, “Why?”'],
          ['In relationships', 'They can hold back an ambitious partner (“my girlfriend tells me to be realistic”), and can be fear-based, or simply very practical.'],
          ['At work', 'In stable, traditional, heavily regulated industries like banking, a contented pragmatist can thrive where an ambitious hero gets crushed. Consider them for running the books: conservative, no big leaps. Ambitious heroes suit growth, rainmaker and change roles.'],
          ['Talk to them about', 'Rituals, what works, savoring life’s pleasures, gratitude: a three-hour Thanksgiving dinner about last year, not next year’s goals. They’re good for ambitious heroes, because they remind you to enjoy the view.'],
        ]}/>
      </Card>
    </>,
  },
  {
    title: 'The Helper, the Disruptor and the Struggler',
    body: <>
      <Card label="Archetype three" title="The Selfless Helper" intro="The least understood, she says. Their whole story is about giving, and their worth comes from being of service, so they often choose service careers: teacher, coach, trainer, nurse, doctor. Many parents become selfless helpers once a baby arrives.">
        <Terms items={[
          ['Risks', 'They don’t feel worthy unless they’re helping, give until there’s nothing left (compassion burnout or fatigue), can’t say no, people-please, struggle with boundaries, and put themselves last.'],
          ['They attract takers', 'And high-conflict people: about 10% of the population, by Bill Eddy’s estimate. They thrive on drama, think in absolutes with no nuance, weaponize emotions, and are often enablers who get others to do their dirty work. They plant a seed, and the selfless helper goes to fight for them.'],
          ['In conversation', 'They think talking about themselves is taking (“Enough about me, how can I help you?”) and won’t take a turn. The greatest gift: “Getting to know you isn’t taking from me, it’s giving to me. It makes me feel good to help you.” Be very generous with them.'],
          ['At work', 'Often excellent managers, tuned into what each person needs while still tracking ROI and KPIs. They can be conflict-avoidant, but the great ones frame hard feedback as “I’m telling you this because I want you to succeed,” and people trust it because it comes from a good place.'],
        ]}/>
      </Card>
      <Card label="Archetype four" title="The Creative Disruptor" intro="Her hardest archetype. Doesn’t like rules, wants to break things, go against the norm, be countercultural: “I don’t need a blueprint.” (Probably the commenters saying “this doesn’t apply to me.”)">
        <Terms items={[
          ['Strengths', 'Very creative, thinks outside the box, challenges how things have always been done.'],
          ['Risks', 'Rubs people the wrong way, sometimes enjoys conflict (negotiating, pushing), can be exhausting, and can tip into pessimism.'],
          ['Examples', 'Litigators; very disruptive entrepreneurs who want to build and break and reinvent the whole system; Edward Snowden. A friend of hers constantly texts “I hate everything.” When she posted about this archetype, the algorithm served him the video and he asked, “Is this me?” (Yes.)'],
          ['Talking with them', 'Steven finds them great interviews: contrarian by default, they sharpen your own views. Vanessa calls them natural dream killers, so go in prepared: “I want to get stronger” (they’ll stress-test you), or “I’m a delicate flower today and can’t handle it.”'],
        ]}/>
      </Card>
      <Card label="Archetype five" title="The Unlucky Struggler" intro="A contamination narrative: whatever they do, they feel unlucky, stuck, misunderstood and overlooked.">
        <Terms items={[
          ['Character', 'George Costanza from Seinfeld. Often hilarious and self-deprecating, humble, with low self-esteem; many great comedians are unlucky strugglers. Beautiful to be around, but tortured, and you wish they had the confidence you see in them.'],
          ['The challenge', 'Especially for ambitious heroes: not trying to flip them, or convince them they’re actually lucky.'],
        ]}/>
      </Card>
    </>,
  },
  {
    title: '“What Do You Do?”',
    body: <>
      <Prose>Boring questions make you boring, but boring questions asked of you are an opportunity to surprise someone by breaking the script. You’ll be asked “What do you do?” constantly, so have a great answer (there’s a full chapter on it in the book). People are trying to understand who you are, and maybe what you’re worth.</Prose>
      <InsightCard label="The formula">Give a clear <em>what</em> first, then a hook: a small curiosity gap. <em>“I do [what] for [who] by [how].”</em> The label lets people put you in a box (we hate it, but brains need it), and the who answers “Could you help me, my friend, my sister?”</InsightCard>
      <Card label="The coffee-shop example">
        <Terms items={[
          ['Too many “conversation calories”', 'A man on a date: “I have a system for maximizing achievement in young learners.” “What?” “I work with fifth graders on math and reading.” “Oh, you’re a teacher.” He wanted to sound interesting, but it came out jargon-filled, too formal and too complex, like reading a résumé, and it skipped the social order: the what comes before the how.'],
          ['Better', '“I’m a fifth-grade teacher. Over the last 10 years I developed a unique system that speeds up reading.” The what, how long, and a hook.'],
        ]}/>
      </Card>
      <Prose>People handle complexity fine. Multi-hyphenates: “By day I’m a fifth-grade teacher, by night a cinematographer.” Career changers: people love a hero story. “I’ve worked in marketing for 20 years, but I’m thinking about going back to school for psychology.”</Prose>
      <Card label="The worst question in the history of conversation" title="“Been busy?”" intro="She wants it gone from our vocabulary."/>
      <Card label="Prepare for your most common questions" intro="Write down the questions you’re asked most (they depend on your job, industry and location) and plan better answers. Make them gifts to the other person, not just interesting facts about you: answers that get “Me too!”, “Really?” or “What got you into that?” That’s conversationally generous, and it avoids dead ends.">
        <Points items={[
          'Everyone has a most interesting thing that draws the same questions. Steven knows someone who spent three years at Bible school, and everyone asks about it.',
          'Her friend Jason, an editor at Entrepreneur, has no sense of taste or smell and is always at dinners. When asked what he’s ordering, he says: “I can’t taste or smell. What’s your favorite thing? If I could taste one thing, what would you have me try?” It leads to great conversations; Nicole Lapin remembered him for exactly that answer.',
          'Think about your usual settings (coffee, meals) and prepare answers that set the other person up to succeed.',
        ]}/>
      </Card>
    </>,
  },
  {
    title: 'Talking Too Much, or Too Little',
    body: <>
      <Prose>Conversation has two sides: the art (weaving in excitement, harvesting stories) and the mechanics. The mechanics can be measured.</Prose>
      <Card label="The CANDOR corpus" intro="A large study of conversation mechanics.">
        <Terms items={[
          ['15–30 seconds', 'An ideal turn.'],
          ['45 seconds', 'Okay, but it’s becoming a monologue.'],
          ['Under 15 seconds', 'You may be undertalking, creating “conversational scarcity” by not sharing or asking enough. (Vanessa, an overtalker, jokes that undertalking is worse.)'],
        ]}/>
      </Card>
      <Card label="Why our conversation muscles are weakening">
        <Steps items={[
          <><strong>Podcasts aren’t real conversation.</strong> They’re interviews with notes and long turns, so we absorb performative conversations that don’t follow normal mechanics.</>,
          <><strong>Asynchronous conversation.</strong> She sends 9-minute voice notes to friends and gets them back. But a voice note is a monologue with no “me too!” or “I disagree,” so she calls it the most selfish form of conversation: you never hear the other opinion, you can go as long as you like, and the listener is usually cleaning, cooking or working out.</>,
          <><strong>Conversing less.</strong> Only 3 in 10 Americans socialize on a given day. Async work and time spent on self-care, longevity and workouts mean less time with people, and about 1 in 6 people worldwide are affected by loneliness.</>,
          <><strong>Talking to technology.</strong> Her husband told his AI, “Do better, that’s terrible work,” then turned to her, and she said, “You’d better not tell me to do better.” We talk to tech in ways we’d never talk to people, and our brains don’t always know the difference.</>,
        ]}/>
      </Card>
      <InsightCard label="The overtalker at work">In a study of 1,000+ Americans, <em>95%</em> had worked with someone who talks too much. Chatty coworkers spend about <em>90 minutes a workday</em> just talking, and <em>71%</em> said they kept them from getting work done.</InsightCard>
      <Card label="How to tell if it’s you" title="Time yourself, then watch for cues">
        <Points items={[
          'Re-listen to your recorded Zoom calls and time your turns: 15–45 seconds at most.',
          'The “open fish”: someone opens their mouth as if to speak, a subtle sign they want a turn. (Steven did it mid-interview, and Vanessa stopped right away.)',
          'People glancing around the room, or checking out.',
          'No eyebrow raises, and no “ooh,” “aah” or “wow.”',
        ]}/>
      </Card>
      <Card label="Do you talk too much?" intro="Answer often, sometimes or rarely. If you answer “often” to more than three, you’re probably an overtalker.">
        <Steps items={[
          'I leave a conversation realizing I don’t know much about the other person.',
          'After I finish speaking, people nod politely but don’t always respond.',
          'I love telling long, detailed stories, especially when people are too polite to interrupt.',
          'I’ve been told, gently or not, that I talk a lot.',
          'While I’m mid-story, I notice people glancing around the room.',
        ]}/>
      </Card>
      <Prose>Steven passed: rarely, sometimes, sometimes (only on stage when paid, which doesn’t count), rarely, sometimes. Every item secretly asks the same thing: are you curious enough? Curiosity is the antidote, and you can’t get to level 2 if you talk too much.</Prose>
      <InsightCard label="The yap challenge">Open your phone camera and, with no notes, teach something or share an opinion, say about veganism. <em>15–30 seconds is good, 45 is the max,</em> and a minute or two means you probably talk too much. Introverts often go too short.</InsightCard>
    </>,
  },
  {
    title: 'Eyebrows, Entertainers and Appreciators',
    body: <>
      <Prose>Neil deGrasse Tyson says every book he’s written is a collection of the eyebrow-raising things he’s said: he talks to people on planes and writes down what makes them go “huh.” Vanessa watches Steven’s eyebrows closely (“don’t ever get Botox”).</Prose>
      <InsightCard label="Follow the eyebrows">When someone raises their eyebrows, <em>go deeper,</em> with an example or a story. Those are the moments that go viral and get replayed.</InsightCard>
      <Prose>To interrupt politely, use the same open-mouth cue yourself. After about 700 interviews, Steven notices that some guests watch him constantly for cues and change direction if he moves or looks away, while others don’t notice him at all, which he prefers. Vanessa’s view: people like Steven are better conversationalists because they treat conversation as continuous feedback, not a megaphone.</Prose>
      <Card label="The green-room story" intro="A very famous person came into the green room. Person after person approached with a compliment (“I’ve watched you since I was a kid, you changed my life”) or a question (“What’s the best thing you’ve done?” “Any advice for a young person?”). He wasn’t interested: “Nice to meet you,” a quick selfie. Then the AV guy who was miking him said, “Can I tell you the funniest story?” and told funny stories about first watching his movies and playing sports with his siblings. The celebrity laughed and started asking him questions. He wanted to be entertained, not to entertain."/>
      <Card label="Two kinds of people">
        <Terms items={[
          ['Entertainers → ask them questions', 'They want to entertain, talk longer (and are more likely to overtalk), want laughs, and love sharing stories and giving advice. Adoration and people listening energize them.'],
          ['Appreciators → tell them stories', 'They talk less, love laughing at other people’s stories, love hearing interesting, surprising, weird or embarrassing things, and are slow to open up. Don’t fire questions at them. (Steven and Vanessa are both appreciators, though it doesn’t look that way on podcasts. After talking all day for work, she doesn’t want to talk at dinner: “Can we go back to level 1 and you just tell me everything?”)'],
        ]}/>
      </Card>
      <Prose>With a boss or a VIP, know which one you’re dealing with. With an entertainer friend, choose: lean into their strength and let them entertain you, or ask for the ball.</Prose>
    </>,
  },
  {
    title: 'Conversational Narcissists and Dream Killers',
    body: <>
      <Prose>Some people walk themselves up all three levels: they answer their own level 1, share all their goals, then tell you deep things you didn’t want to know. That’s verbal vomit. It usually comes from insecurity and trying to impress, looking for raised eyebrows without realizing that the more they talk, the more you want to go home. Some know they do it and hate it (“Why am I doing this?”) but can’t stop, because they’re terrified of awkward silence.</Prose>
      <InsightCard label="The biggest fear">In her survey of about 4,000 people, the biggest conversational fear wasn’t rejection or judgment, though both were options. It was <em>awkward silences and not knowing what to say.</em> That’s very mechanical, and fixable.</InsightCard>
      <Card label="What you can do with one">
        <Points items={[
          'Stand up for your turn: “Is it my turn yet?” “Do you want to hear about my goal?” It also tests whether they’re curious about you.',
          'Consider, gently, that maybe you’re not giving them enough to be curious about.',
          'Try a “cornerstone conversation”: “My friend Vanessa came on the podcast and gave us nine questions. Want to do them together? I’ll go first.” The structure enforces turn-taking and breaks conversational ruts, like overtalker friendships and marriages that only talk logistics.',
          'Ask them better, deeper questions. Make them feel understood, chosen and loved, and their insecurity may settle. Steven noticed his friend gets worse around people he wants to impress; the quieter Steven got out of respect, the less chosen and understood his friend felt, so he kept talking.',
        ]}/>
      </Card>
      <Prose>Think of a bad driver: the passengers think “this person is terrible,” so the driver gets tenser and worse. Make them feel like a better driver. And if the narcissist is you, the fix is curiosity, what she calls assertive curiosity: go beyond “tell me more” to what, how, why and when, and really dig into the other person’s dream.</Prose>
      <Card label="Dream killing" intro="The opposite of dream building: shutting down someone’s dream so they feel unliked and misunderstood. Very smart people often do it by accident, with logic: fact-checking instead of gut-checking, “accuracy-killing” before the person is ready. That creates conversational scarcity. The person feels they have to prove themselves and talks more to convince you, connection shuts down, and you never get past level 1. (Steven’s example: a candidate with remarkable intellect and credentials got neutral or negative interview feedback, because they cared only about whether things were true, not about being liked.)"/>
      <InsightCard label="Warmth first">Competence without warmth makes people suspicious. You can be the smartest person in the room, but if people don’t feel connected to you, <em>they don’t believe your smarts.</em> Level 1 builds ease, which is warmth, and from ease comes understood, then chosen, then loved.</InsightCard>
      <PullQuote>Be interested, not interesting.</PullQuote>
      <Prose>That’s Dale Carnegie. Going in focused on yourself (how to seem smart and funny, how to get them to like you) is selfish, and a lot of pressure. Going in thinking “how do I put them at ease and let them impress me?” is conversational generosity, and it tends to make you interesting in return. The research Steven recalled: the most popular kids had the longest lists of people they liked. To be likable, go around liking as many people as you can.</Prose>
    </>,
  },
  {
    title: 'Numbers, Not Handles',
    body: <>
      <Prose>A yap-challenge prompt: someone asked Vanessa’s friend for her Instagram handle instead of her number. Agree or disagree?</Prose>
      <Card label="The debate">
        <Terms items={[
          ['Steven, in about 12 seconds', 'It depends on her vibe and the context. With a stranger on the street, he agrees, because it’s less invasive: “Give me the chance to earn your number.” Your number is for your personal and professional life; Instagram is public.'],
          ['Vanessa disagrees', 'Instagram is performative. Scrolling someone’s feed (a dog named Stewie, Thanksgiving photos, hiking, siblings) takes the joy out of discovery and uses up level 1 ahead of time, so the first date has to jump unnaturally to level 2. She thinks that’s why first dates have gotten more awkward. And feeds are curated highlight reels anyway.'],
        ]}/>
      </Card>
      <Prose>Asked for her handle, she’d say: “I have one just for friends and family; maybe you can get there one day.” She’d rather banter by text or phone, see if they’re funny, whether they ask good questions and whether they’re a conversational narcissist, and then get asked to dinner.</Prose>
      <InsightCard label="Her challenge to single people">Ask for <em>numbers, not handles.</em></InsightCard>
      <Prose>She is in favor of dating apps, though. They’re limited (6–10 photos, set prompts) rather than an endless feed going back to high school, and they connect people fast. With AirPods in at the gym you won’t hear anyone flirting, so apps may be one of the only ways left to meet. Steven conceded.</Prose>
    </>,
  },
  {
    title: 'Leaving Gracefully',
    body: <>
      <Prose>The peak-end effect: we remember the peak and the end of an experience. We obsess over first impressions and forget about last ones.</Prose>
      <Card label="Future cue + compliment or action">
        <Steps items={[
          <><strong>Future cue.</strong> Ask about or mention something coming up, which quietly shifts the brain to “later, not here.” “Any fun plans this weekend?” “A wine bar across town.” “I hope it’s lovely. Try the Chardonnay.”</>,
          <><strong>Compliment.</strong> “It was so lovely talking to you.”</>,
          <><strong>Action.</strong> “I’m going to grab more coffee,” “say hi to the host,” “run to the restroom,” “head home,” “connect with me on LinkedIn,” “so glad we traded numbers.”</>,
        ]}/>
      </Card>
      <Card label="Make it land">
        <Points items={[
          'Use an “exit voice”: a closing tone.',
          'Add non-verbal cues. Step back slowly and angle your body toward the door; the brain reads it as disengaging.',
          'If they keep talking, the action and the compliment close it.',
        ]}/>
      </Card>
      <InsightCard label="Be assertive">The worst last impression is lingering awkwardness: “Well, this has been good… it’s been good for me… so…” She calls it <em>kryptonite for charisma.</em></InsightCard>
    </>,
  },
  {
    title: 'Charisma',
    body: <>
      <Prose>Her definition, from explaining it to her 8-year-old daughter: someone you really want to be around. When they walk in, you want to talk to them, sit near them, listen to them, work and play with them. Her daughter named the exact two classmates Vanessa had already identified as charismatic.</Prose>
      <Card label="The basics">
        <Steps items={[
          <><strong>Be really easy to talk to.</strong> That’s the whole point of level 1: putting people at ease.</>,
          <><strong>Signal clearly that you like people.</strong> We don’t like people who are “mute” or under-signal with body language, so say it: “It’s always so fun talking to you,” “You always have the best stories,” “I love when you’re on my team.” Signal amplification bias means we think our cues are obvious when they aren’t, and the liking gap means people underestimate how much others like them.</>,
          <><strong>Warmth + competence.</strong> About 82% of our impressions of people come from these two. Everyone we meet is asking: can I trust you, and can I rely on you? Charismatic people signal both. They’re open and friendly, then capable, efficient and assertive, so you feel in good hands.</>,
        ]}/>
      </Card>
      <Card label="The “Schmobert” story" intro="Friends often ask Vanessa to size up new partners. At a Mediterranean dinner she found one just okay. The next day her friend said he loved Vanessa, thought she was so funny and had already bought her Audible book, and Vanessa caught herself liking him more on the spot (“He’s clever, so smart!”). She was horrified at herself. We want so badly to be liked that clear signs of liking make us like people back."/>
      <InsightCard label="Have a plan">Having a plan is a <em>secret door to charisma.</em> Her book Cues was about choosing your signals; Conversations is about being assertive about the plan. Charismatic people carry the conversation, and people like that.</InsightCard>
      <Card label="What kills charisma" title="Trying to be impressive" intro="At a VIP party in Austin, she arrived with imposter syndrome, recognizing YouTubers. The host had everyone introduce themselves in a circle, and each introduction got more impressive (in her words, things like “I’m a billionaire and invented the internet” and “I cured cancer”). Her turn: “My name is Vanessa, I’m a recovering awkward person, I help smart awkward people with my books and YouTube channel… and I don’t know why I was invited.” Everyone laughed and exhaled, everyone after her started with “I’m a recovering awkward person,” and during networking most people came to her, not the billionaire. She was the easiest person to talk to."/>
      <Prose>The really impressive people she has met, billionaires included, are humble and downplay their success, because they’ve already made it. Take the pressure off; just connect. Steven agreed: the people in his life with aura aren’t the most accomplished, they’re the ones you most want to spend time with. And master conversationalists aren’t usually extroverts. Extroverts can fall into conversational narcissism, while ambiverts and introverts do very well.</Prose>
    </>,
  },
  {
    title: 'Aura, Voice, Eyes and Listening',
    body: <>
      <Prose>Aura is taking up space, physically and vocally. Think of Michelle Obama or Tony Robbins walking into a room; it’s both internal and external. Whether short or tall, “winners” take up more space: more distance between ears and shoulders, more space between torso and arms. It comes from small movements, like a slight drop of the shoulders and a slight lift of the head, and those adjustments change your voice too.</Prose>
      <Card label="Your maximum resonance point" intro="The lowest end of your natural vocal range, which signals pride and calm. Nervous people tighten their vocal cords, shoulders, neck and chin, speak higher, rush, and run out of breath. At work, people who speak from their maximum resonance point get listened to more: we hear their confidence and relaxation and want to catch it.">
        <Steps items={[
          'Take a deep breath and say “hello” at the top of the breath. It sounds tense.',
          'Now say “hello” on the out-breath. Relaxed.',
          'Notice the Zoom version: people hold their breath and squeak “Good morning! Hello everyone!”, which gives away their vocal confidence.',
        ]}/>
      </Card>
      <InsightCard label="How you say it">How you say something matters as much as what you say. Asked flatly, “So… what’s your personal passion project, I guess” tunes people out. That’s why intention matters: <em>if you’re not trying, it leaks into your voice.</em></InsightCard>
      <Card label="Eye contact">
        <Points items={[
          'It produces oxytocin, but you can’t think complex thoughts while holding it. We look away to remember things or do math.',
          'The ideal in Western cultures is about 60–70%, not 100%. Allow less when someone is thinking deeply or recalling memories.',
          'Make eye contact in the first few seconds of a greeting, in person or on video, for the oxytocin burst. Then it’s fine to look away and think.',
          'Look back when you deliver your point. You want them to feel it, and you’re checking their reaction: do they believe you, did their eyebrows go up, is there disgust, did their lower lids harden? That lets you pivot toward what lights them up and away from what doesn’t.',
        ]}/>
      </Card>
      <Card label="How to be a great listener">
        <Terms items={[
          ['Bad listening', 'Interrupting with “yeah yeah yeah,” or scowling without knowing it. Watch for facial punctuators: resting expressions that don’t reflect emotion. A friend of hers defaults to a disgust micro-expression he doesn’t mean.'],
          ['Warm cues', 'Nodding, especially the triple nod (nodding means something different in India, Bulgaria and Pakistan). The head tilt, a universal warmth signal that exposes the ear. Leaning in, which is warm and competent: getting closer to understand.'],
          ['The competent cue: the lower-lid flex', 'Hardening the lower eyelids is a universal “I’m trying to see more clearly” signal. When someone does it while you talk, it means intense focus, neither positive nor negative, so note what you just said. In a presentation you can bookmark it, or switch to dynamic presenting: “Does that make sense? Any questions? Let me give another example.”'],
        ]}/>
      </Card>
      <PullQuote>Have a plan, but be dynamic. Don’t use the nine questions like a checklist: if one lights you both up, spend hours there. And if you’re not feeling the person, you can leave.</PullQuote>
    </>,
  },
  {
    title: 'The Nine Questions',
    body: <>
      <Card label="Level 1 · General traits">
        <Terms items={[
          ['1 · What’s your personal passion project?', 'Hunt for stories and values.'],
          ['2 · Working on anything exciting these days?', 'A better “What do you do?”'],
          ['3 · Have any fun plans coming up?', 'A shared future, and callbacks.'],
        ]}/>
      </Card>
      <Card label="Level 2 · Personal concerns">
        <Terms items={[
          ['4 · What have you always wanted to learn?', 'A growth mindset.'],
          ['5 · What’s your biggest goal right now?', 'Tie it to a moment. Dopamine, motivation, dream building.'],
          ['6 · Your signature question', 'Built from what you love to talk about, to steer toward your passion.'],
        ]}/>
      </Card>
      <Card label="Level 3 · Self-narrative">
        <Terms items={[
          ['7 · Are you lucky?', 'Redemption vs. contamination, and locus of control.'],
          ['8 · Do you believe in fate?', 'The bird or the roller coaster.'],
          ['9 · What book, movie or TV character are you most like, and why?', 'Reveals the archetype.'],
        ]}/>
      </Card>
      <Prose>The episode lays out questions 1–6 explicitly. For level 3 it discusses “Are you lucky?”, the fate question, the memoir-title question and the character question, so the book’s exact level 3 set may differ slightly.</Prose>
      <Prose>Who it’s for: people who want to stop dreading small talk, like networking events, talking to the boss, the first five minutes of team calls and first dates. With a conversational plan, first dates can be fun even when the person isn’t for you, and meetings can open well. The deeper goal: we’re in a loneliness epidemic, and if we forget how good conversation feels, we’ll stop doing it. “Kind of sounds like it’s for all of us,” Steven said. Teachers tell him kids lack basic conversational skills; the book took her 20 years and was “meant to be now.”</Prose>
      <Card label="What she’d get back" intro="Asked whether she sacrificed anything in her personal life for success that she regrets: yes. She moved to Austin for work and gave up time with friends and family in the hustle. She doesn’t regret Austin, where she grew a lot, but she regrets being away from family when her children were very little. Having babies without her mom and sister nearby was very hard. She felt very alone as a new mom, and wishes it had felt more communal, since having a baby should be shared with family and friends. She has since moved to the beach in LA to be closer to family; her sister was at her house with her kids during the recording."/>
      <InsightCard label="In one paragraph">Conversation is a learnable skill with a blueprint, and it matters more as people talk more to screens than to each other. Go up the levels in order: make level 1 a treasure hunt for stories, use level 2 to build people’s dreams instead of killing them, and save level 3 for the people closest to you. Keep turns to 15–30 seconds, watch for cues, and be curious instead of impressive. <em>Show clearly that you like people,</em> lead with warmth and then competence, speak from your lowest relaxed tone, and end conversations as deliberately as you start them.</InsightCard>
    </>,
  },
].map((p, i) => ({ ...p, label: `Part ${NUMBERS[i + 1]} · ${SERIES}` }));

/* ── Completion Screen ──────────────────────────────────────── */
function CompletionScreen({ onNext }) {
  return (
    <div style={{ background:'#000', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', overflow:'hidden' }} onClick={onNext}>
      {[0, 1, 2].map(i => (<div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:100+i*90, height:100+i*90, borderRadius:'50%', border:`1px solid ${['rgba(244,114,182,0.35)','rgba(167,139,250,0.25)','rgba(6,182,212,0.18)'][i]}`, animation:`waveExpand 5s ease-out ${i*1.6}s infinite` }}/>))}
      <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'40px 24px', maxWidth:760 }}>
        <div style={{ fontSize:'0.62rem', letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(244,114,182,0.4)', marginBottom:36 }}>Complete · Conversations</div>
        <h1 style={{ fontSize:'clamp(2.2rem,8vw,5rem)', fontWeight:700, color:'#e8e8ed', letterSpacing:1, marginBottom:32, animation:'mmm-reveal 2s ease-out 0.5s both', lineHeight:1.1 }}>INTERESTED,<br/>NOT INTERESTING</h1>
        <p style={{ fontStyle:'italic', fontSize:'clamp(1rem,2.4vw,1.25rem)', color:'rgba(210,200,255,0.55)', lineHeight:1.8, marginBottom:44, animation:'mmm-fadeUp 1.5s ease-out 1.5s both' }}>Make level 1 a treasure hunt.<br/>Build people’s dreams.<br/>Save level 3 for the people closest to you.</p>
        <div style={{ background:'rgba(244,114,182,0.06)', border:'1px solid rgba(244,114,182,0.15)', borderRadius:16, padding:'26px 36px', maxWidth:600, margin:'0 auto 48px', animation:'mmm-fadeUp 1.5s ease-out 2.2s both' }}>
          <p style={{ fontStyle:'italic', fontSize:'1.05rem', color:'rgba(220,200,255,0.72)', lineHeight:1.8 }}>“After talking to you, I understand myself better.”</p>
          <div style={{ fontSize:'0.6rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(244,114,182,0.3)', marginTop:12 }}>Vanessa Van Edwards · The Diary of a CEO</div>
        </div>
        <div style={{ fontSize:'0.72rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', animation:'mmm-blink 2.5s ease-in-out 3.5s infinite' }}>*click anywhere to restart*</div>
      </div>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────────── */
function App() {
  const [screen, setScreen] = useState(0);
  const go = n => setScreen(n);
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  if (screen === 0) return <LandingScreen onNext={() => go(1)}/>;
  if (screen > PARTS.length) return <CompletionScreen onNext={() => go(0)}/>;
  const part = PARTS[screen - 1];
  const next = PARTS[screen];
  return (
    <Chapter key={screen} n={screen} label={part.label} title={part.title} nextLabel={next ? next.title : 'Finish'} onBack={() => go(screen - 1)} onNext={() => go(screen + 1)}>
      {part.body}
    </Chapter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
