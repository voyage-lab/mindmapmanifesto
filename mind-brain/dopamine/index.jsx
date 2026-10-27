const { useState, useEffect } = React;

const SERIES = 'Dopamine';
const ACCENT = '#22d3ee';
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
        style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'13px 26px', borderRadius:12, fontSize:'0.875rem', fontWeight:600, border:'none', cursor:'pointer', background:`linear-gradient(135deg,${ACCENT},#0891b2)`, color:'#fff', textAlign:'left' }}>
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
        <div style={{ fontSize:'0.65rem', letterSpacing:'0.6em', color:'rgba(34,211,238,0.5)', textTransform:'uppercase', fontWeight:700 }}>The Molecule of More</div>
        <div>
          <h1 style={{ fontSize:'clamp(2.8rem,10vw,6rem)', fontWeight:700, letterSpacing:'-0.02em', color:'white', marginBottom:10 }}>Dopamine</h1>
          <div style={{ fontSize:'clamp(0.9rem,2.2vw,1.3rem)', fontWeight:300, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em' }}>What Hooks You, Why, and How to Take It Back · {PARTS.length} Parts</div>
        </div>
        <div style={{ maxWidth:600, borderLeft:'2px solid rgba(34,211,238,0.3)', paddingLeft:26, textAlign:'left' }}>
          <p style={{ fontStyle:'italic', fontSize:'clamp(0.95rem,1.9vw,1.13rem)', lineHeight:1.8, color:'rgba(255,255,255,0.55)' }}>
            Dopamine isn’t the feeling of pleasure. It’s the feeling of wanting. Everything competing for your attention, from your phone to your plate, is built to make you want one more.
          </p>
        </div>
        <button onClick={onNext}
          style={{ background:'rgba(34,211,238,0.08)', border:'1px solid rgba(34,211,238,0.28)', borderRadius:9999, padding:'18px 52px', fontSize:'0.8rem', fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase', color:'white', cursor:'pointer' }}>
          Begin
        </button>
      </div>
    </div>
  );
}

/* ── Parts ───────────────────────────────────────────────────── */
const PARTS = [
  {
    title: 'What Dopamine Really Does',
    body: <>
      <Prose>Dopamine is a chemical messenger made by a small cluster of neurons deep in the brain. It’s often called the pleasure chemical, but that’s not quite right. Its main job is motivation: it marks what’s worth chasing and pushes you to go get it.</Prose>
      <InsightCard label="Wanting, not liking">Dopamine drives <em>wanting</em>: craving, anticipation, the pull toward a reward. The <em>liking</em>, the actual enjoyment, runs mostly on other chemicals like endorphins. That’s why you can crave something intensely and barely enjoy it once you have it.</InsightCard>
      <Card label="How it learns" title="The prediction error">
        <Terms items={[
          ['Better than expected', 'A big dopamine spike. Your brain flags it: do that again.'],
          ['Exactly as expected', 'Little or no spike. The reward is now old news.'],
          ['Worse than expected', 'Dopamine dips below normal. That drop feels like disappointment, restlessness, craving.'],
        ]}/>
      </Card>
      <Prose>This is why the first bite is the best one, why a new phone excites you for a week, and why a surprise hits harder than a planned treat. Dopamine responds to the gap between what you expected and what you got, not to the reward itself.</Prose>
      <PullQuote>Dopamine isn’t about having. It’s about getting closer to having.</PullQuote>
    </>,
  },
  {
    title: 'The Strongest Natural Triggers',
    body: <>
      <Prose>A rough ranking of what drives the biggest dopamine release in everyday life. The order is approximate and shifts from person to person and day to day.</Prose>
      <Card label="The top of the list">
        <Terms items={[
          ['1 · Sex and orgasm', 'Among the strongest natural dopamine responses, with a large spike around climax. Built in by evolution: few things matter more to a species.'],
          ['2 · Video games', 'Unpredictable rewards, levels and achievement unlocks keep the loop running. One brain-scan study found dopamine in the reward center roughly doubled during play.'],
          ['3 · Shorts and reels', 'Variable rewards and very fast feedback: every swipe might be the good one, and the next one is always a second away.'],
          ['4 · Gambling and betting', 'The uncertainty of winning is extremely reinforcing. Near-misses light up the brain almost like wins, which keeps people playing.'],
          ['5 · Pornography and erotic media', 'Uses the same anticipation and novelty machinery as sex, with endless novelty on tap. A separate category from sex itself.'],
          ['6 · Alcohol', 'A quick dopamine release on the way up, though alcohol is a depressant overall, and the dip afterward feeds the next drink.'],
          ['7 · Salt, fat and sugar', 'The combination, especially engineered into processed food, is more rewarding than anything found in nature. That’s the point.'],
        ]}/>
      </Card>
    </>,
  },
  {
    title: 'The Rest of the Top Thirteen',
    body: <>
      <Card label="Still strong">
        <Terms items={[
          ['8 · Chocolate and dessert', 'A specific sweet-and-fat combination many people find especially rewarding.'],
          ['9 · Scrolling and browsing', 'Feeds, apps, news. The endless feed is the same variable-reward loop as shorts and reels, just slower.'],
          ['10 · Notifications and likes', 'The anticipation of checking, plus social approval. The buzz in your pocket is a cue; the like is the reward.'],
          ['11 · Gacha and loot boxes', 'The gambling mechanism inside games, often aimed at kids: pay, open, maybe win.'],
          ['12 · Laughing', 'Moderate but social, and usually comes with endorphins too.'],
          ['13 · Movies and TV', 'Narrative anticipation and emotional payoff. Steadier and less intense, until autoplay turns one episode into six.'],
        ]}/>
      </Card>
      <InsightCard label="Notice the pattern">Most of the top thirteen are <em>modern.</em> Sex, food and laughter are ancient. Feeds, games, porn, loot boxes and processed food are engineered, and they beat the ancient rewards at their own game by being faster, more novel and always available.</InsightCard>
    </>,
  },
  {
    title: 'Moderate Triggers',
    body: <>
      <Prose>These give a real lift without the extreme spike, and many of them leave you better off afterward.</Prose>
      <Card label="Moderate, and mostly good for you">
        <Terms items={[
          ['Exercise', 'Running and intense workouts release dopamine along with endorphins, and regular training is linked to healthier dopamine signaling over time.'],
          ['Music', 'Especially the anticipation of your favorite part. Brain scans show dopamine rising in the seconds before the drop, then again at the peak.'],
          ['Winning and achievement', 'Finishing goals, getting promoted, solving a problem.'],
          ['Hobbies and creative work', 'Drawing, building, playing an instrument: steady dopamine from mastery and visible progress.'],
          ['Compliments and being noticed', 'Praise and recognition, especially from people whose opinion you value.'],
          ['Anticipation itself', 'Planning a trip or waiting for a concert can give as much dopamine as the event.'],
          ['Gossip and new information', 'Curiosity is rewarding in itself; the brain treats new information like food.'],
          ['Cold exposure and novelty', 'Cold showers, new places, new experiences. One study of cold-water immersion found dopamine levels raised about 2.5 times, for hours.'],
        ]}/>
      </Card>
      <Card label="Moderate, but handle with care">
        <Terms items={[
          ['Caffeine', 'Boosts dopamine signaling. The morning coffee ritual can matter as much as the caffeine itself.'],
          ['Nicotine', 'Among the most reinforcing substances there is, despite a moderate spike.'],
          ['Shopping and new things', 'The thrill of buying, then anticipating the delivery. The box is often more exciting than what’s in it.'],
          ['Dating, flirting, romantic attention', 'Uncertainty and anticipation can feel as strong as the relationship itself, which is why mixed signals are so addictive.'],
          ['Surprises and unexpected gifts', 'Unpredictability drives the response, so surprises hit harder than planned treats.'],
          ['Spicy food', 'The pain, then relief and rush, can activate reward circuitry.'],
        ]}/>
      </Card>
    </>,
  },
  {
    title: 'The Extreme End',
    body: <>
      <Prose>Drugs don’t just trigger dopamine; they hijack the system directly. Cocaine, amphetamines and opioids act on dopamine far more strongly than anything natural, and they’re the substances most closely linked to addiction.</Prose>
      <Card label="Rough scale" title="How far above normal dopamine rises" intro="Approximate figures from classic animal studies, popularized in Anna Lembke’s Dopamine Nation. They show the scale, not exact human numbers.">
        <Terms items={[
          ['Chocolate', 'About 55% above baseline.'],
          ['Sex', 'About 100% above baseline.'],
          ['Nicotine', 'About 150% above baseline.'],
          ['Cocaine', 'About 225% above baseline.'],
          ['Amphetamine', 'About 1,000% above baseline.'],
        ]}/>
      </Card>
      <InsightCard label="Why that matters">No natural reward can compete with a tenfold spike. After it, ordinary life (food, friends, work) <em>feels flat by comparison,</em> and that flatness is a big part of what drives people back.</InsightCard>
    </>,
  },
  {
    title: 'The Four Drivers',
    body: <>
      <Prose>Almost everything on the list runs on the same four levers. Learn to spot them and you’ll see them everywhere.</Prose>
      <Card label="What makes something hook you">
        <Steps items={[
          <><strong>Unpredictability.</strong> Not knowing when, or whether, the reward comes. Psychologists call it a variable reward schedule, and it’s the most addictive schedule known: pigeons in B.F. Skinner’s experiments pecked hardest when food came at random.</>,
          <><strong>Novelty.</strong> New stimuli produce stronger responses. Old rewards fade; new ones spike.</>,
          <><strong>Anticipation.</strong> The wait can be as rewarding as the outcome, sometimes more.</>,
          <><strong>Speed of feedback.</strong> The faster and more endless the loop, the more reinforcing it is. Seconds beat days.</>,
        ]}/>
      </Card>
      <InsightCard label="The formula">Shorts and reels score high on all four at once: random good videos, always new, the next one already loading, a reward every few seconds. <em>That’s why they top the list of things people can’t put down.</em></InsightCard>
    </>,
  },
  {
    title: 'How Apps Are Built Around You',
    body: <>
      <Prose>None of this is accidental. Product teams study these levers and build them in, because your attention is what they sell.</Prose>
      <Card label="The toolkit">
        <Terms items={[
          ['Pull to refresh', 'A slot-machine lever: pull, wait a beat, see what you got.'],
          ['Infinite scroll and autoplay', 'Remove the natural stopping point, so stopping becomes a decision you have to make.'],
          ['Notifications and red badges', 'Cues that trigger the urge to check, timed to bring you back.'],
          ['Likes, views, followers', 'Social approval, delivered unpredictably.'],
          ['Streaks', 'Loss aversion: breaking a 200-day streak feels worse than the streak ever felt good.'],
          ['Loot boxes and daily rewards', 'Gambling mechanics with a friendly face.'],
        ]}/>
      </Card>
      <PullQuote>If you aren’t paying for the product, your attention is the product.</PullQuote>
    </>,
  },
  {
    title: 'The Pleasure–Pain Balance',
    body: <>
      <Prose>Your brain wants balance. Every spike of dopamine is followed by a dip below where you started, as the brain pushes back to restore its set point. That dip is the craving, the low, the “one more.”</Prose>
      <InsightCard label="Tolerance">Hit the same reward over and over and the brain adapts: it turns down its own dopamine signaling. You need more to feel the same, and <em>less than usual</em> feels like misery. The baseline itself sinks.</InsightCard>
      <Card label="Signs your baseline is low">
        <Points items={[
          'Ordinary things (a walk, a book, a conversation) feel boring.',
          'You reach for your phone in every gap: the queue, the lift, the toilet.',
          'You need background noise or a second screen to do anything.',
          'Hard tasks feel impossible to start, but scrolling is effortless.',
          'You feel flat or irritable when you can’t get your usual hit.',
        ]}/>
      </Card>
      <PullQuote>The cheaper and faster the pleasure, the bigger the bill that comes afterward.</PullQuote>
    </>,
  },
  {
    title: 'Restore Your Baseline',
    body: <>
      <Prose>Some things work in the other direction: instead of spiking dopamine and crashing it, they restore your sensitivity so normal life feels good again.</Prose>
      <Card label="The restorers">
        <Terms items={[
          ['Sleep and rest', 'Restores dopamine sensitivity. Even one night of poor sleep has been linked to fewer available dopamine receptors.'],
          ['Morning sunlight and nature', 'Time outdoors and daylight, especially early, are linked to mood-related dopamine activity and a steadier day.'],
          ['Exercise', 'A moderate lift now, and healthier dopamine signaling over weeks.'],
          ['Cold water', 'A long, slow rise rather than a spike-and-crash.'],
          ['Boredom', 'Underrated. Letting your brain sit with nothing is how it recalibrates.'],
        ]}/>
      </Card>
      <Card label="The reset" title="A 30-day fast from your biggest hit" intro="Psychiatrist Anna Lembke suggests about four weeks away from your most compulsive reward, roughly how long the brain needs to rebalance.">
        <Steps items={[
          'Pick one thing: the app, the game, the snack, the habit you can’t stop.',
          'Expect the first one to two weeks to feel worse. That’s the dip, not failure.',
          'Add friction: delete the app, log out, move it out of the house.',
          'Notice what comes back: interest in slow things, focus, calm.',
          'When it’s over, decide deliberately how, and how much, it returns.',
        ]}/>
      </Card>
    </>,
  },
  {
    title: 'Use It on Purpose',
    body: <>
      <Prose>Dopamine isn’t the enemy. It’s the engine of drive, learning and ambition. The goal is to point it at things that build your life instead of draining it.</Prose>
      <Card label="Make dopamine work for you">
        <Steps items={[
          <><strong>Earn the reward.</strong> Put the easy pleasure after the hard thing, not before it.</>,
          <><strong>Learn to enjoy the effort itself.</strong> Rewarding yourself after every workout can make the workout feel like a chore. Tell yourself the struggle is the point.</>,
          <><strong>Don’t stack.</strong> Music plus phone plus snack plus a second screen flattens each one, and raises the bar for everything else.</>,
          <><strong>Make good habits feel like games.</strong> Visible progress, small wins, a little randomness in the reward.</>,
          <><strong>Use anticipation.</strong> Plan things to look forward to; you get dopamine for weeks before they happen.</>,
          <><strong>Add friction to bad loops, remove it from good ones.</strong> Phone in another room; guitar on the stand; running shoes by the door.</>,
        ]}/>
      </Card>
      <InsightCard label="The principle">The best rewards are the slow ones: mastery, relationships, building something. They spike less, but <em>they don’t crash,</em> and they keep paying.</InsightCard>
    </>,
  },
  {
    title: 'Your Dopamine Audit',
    body: <>
      <Card label="Ask yourself">
        <Points items={[
          'What do I reach for first in the morning, and last at night?',
          'Which of the top thirteen do I do daily without deciding to?',
          'What do I keep doing that I no longer enjoy?',
          'What did I love before my phone, that I don’t do anymore?',
          'Which slow rewards (skills, people, projects) am I starving?',
        ]}/>
      </Card>
      <Card label="Swap the loop">
        <Terms items={[
          ['Scrolling in the gaps', '→ A walk, a book, or just sitting with it.'],
          ['Shorts before bed', '→ Phone out of the bedroom; sleep is the restorer.'],
          ['Sugar for an afternoon lift', '→ Daylight, a few minutes of movement, water.'],
          ['Gaming for achievement', '→ A skill with real progress you can see.'],
          ['Likes for approval', '→ A real conversation with someone whose opinion you value.'],
        ]}/>
      </Card>
      <PullQuote>You can’t stop wanting. You can choose what you want.</PullQuote>
    </>,
  },
].map((p, i) => ({ ...p, label: `Part ${NUMBERS[i + 1]} · ${SERIES}` }));

/* ── Completion Screen ──────────────────────────────────────── */
function CompletionScreen({ onNext }) {
  return (
    <div style={{ background:'#000', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', overflow:'hidden' }} onClick={onNext}>
      {[0, 1, 2].map(i => (<div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:100+i*90, height:100+i*90, borderRadius:'50%', border:`1px solid ${['rgba(34,211,238,0.35)','rgba(167,139,250,0.25)','rgba(244,114,182,0.18)'][i]}`, animation:`waveExpand 5s ease-out ${i*1.6}s infinite` }}/>))}
      <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'40px 24px', maxWidth:760 }}>
        <div style={{ fontSize:'0.62rem', letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(34,211,238,0.4)', marginBottom:36 }}>Complete · Dopamine</div>
        <h1 style={{ fontSize:'clamp(2.2rem,8vw,5rem)', fontWeight:700, color:'#e8e8ed', letterSpacing:1, marginBottom:32, animation:'mmm-reveal 2s ease-out 0.5s both', lineHeight:1.1 }}>CHOOSE WHAT<br/>YOU WANT</h1>
        <p style={{ fontStyle:'italic', fontSize:'clamp(1rem,2.4vw,1.25rem)', color:'rgba(210,200,255,0.55)', lineHeight:1.8, marginBottom:44, animation:'mmm-fadeUp 1.5s ease-out 1.5s both' }}>Spot the four levers.<br/>Rest your baseline.<br/>Point the engine at slow rewards.</p>
        <div style={{ background:'rgba(34,211,238,0.06)', border:'1px solid rgba(34,211,238,0.15)', borderRadius:16, padding:'26px 36px', maxWidth:600, margin:'0 auto 48px', animation:'mmm-fadeUp 1.5s ease-out 2.2s both' }}>
          <p style={{ fontStyle:'italic', fontSize:'1.05rem', color:'rgba(220,200,255,0.72)', lineHeight:1.8 }}>“Dopamine isn’t about having. It’s about getting closer to having.”</p>
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
