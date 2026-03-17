#!/usr/bin/env node
// scripts/generate-crosswords.mjs
// Generates 194 daily NYT-style 5×5 mini crossword puzzles.
//
// Design:
//   - 4 grid templates (A/B/C/D) with corner black squares
//   - Word reuse allowed with 14-puzzle cooldown (same word never in back-to-back puzzles)
//   - System dictionary provides the large word pool needed for high-density grids
//   - WORD_CLUES map provides wedding-themed clues for ~500 words
//   - Generic clues auto-generated for fill words
//   - Fast solver: letter-position index + forward checking constraint propagation
//
// Run: node scripts/generate-crosswords.mjs > /tmp/puzzles-out.txt 2>/tmp/gen-log.txt

import { readFileSync } from 'fs';

// ---------------------------------------------------------------------------
// TEMPLATES
// ---------------------------------------------------------------------------
const TEMPLATES = {
  A: { // ■ at top-right (0,4) and bottom-left (4,0)
    slots: [
      {id:'1A', row:0, col:0, len:4, dir:'A'},
      {id:'2A', row:1, col:0, len:5, dir:'A'},
      {id:'3A', row:2, col:0, len:5, dir:'A'},
      {id:'4A', row:3, col:0, len:5, dir:'A'},
      {id:'5A', row:4, col:1, len:4, dir:'A'},
      {id:'1D', row:0, col:0, len:4, dir:'D'},
      {id:'2D', row:0, col:1, len:5, dir:'D'},
      {id:'3D', row:0, col:2, len:5, dir:'D'},
      {id:'4D', row:0, col:3, len:5, dir:'D'},
      {id:'5D', row:1, col:4, len:4, dir:'D'},
    ],
  },
  B: { // ■ at top-left (0,0) and bottom-right (4,4)
    slots: [
      {id:'1A', row:0, col:1, len:4, dir:'A'},
      {id:'2A', row:1, col:0, len:5, dir:'A'},
      {id:'3A', row:2, col:0, len:5, dir:'A'},
      {id:'4A', row:3, col:0, len:5, dir:'A'},
      {id:'5A', row:4, col:0, len:4, dir:'A'},
      {id:'1D', row:1, col:0, len:4, dir:'D'},
      {id:'2D', row:0, col:1, len:5, dir:'D'},
      {id:'3D', row:0, col:2, len:5, dir:'D'},
      {id:'4D', row:0, col:3, len:5, dir:'D'},
      {id:'5D', row:0, col:4, len:4, dir:'D'},
    ],
  },
  C: { // ■ at all 4 corners
    slots: [
      {id:'1A', row:0, col:1, len:3, dir:'A'},
      {id:'2A', row:1, col:0, len:5, dir:'A'},
      {id:'3A', row:2, col:0, len:5, dir:'A'},
      {id:'4A', row:3, col:0, len:5, dir:'A'},
      {id:'5A', row:4, col:1, len:3, dir:'A'},
      {id:'1D', row:1, col:0, len:3, dir:'D'},
      {id:'2D', row:0, col:1, len:5, dir:'D'},
      {id:'3D', row:0, col:2, len:5, dir:'D'},
      {id:'4D', row:0, col:3, len:5, dir:'D'},
      {id:'5D', row:1, col:4, len:3, dir:'D'},
    ],
  },
  D: { // Open — no black squares, all 5-letter
    slots: [
      {id:'1A', row:0, col:0, len:5, dir:'A'},
      {id:'2A', row:1, col:0, len:5, dir:'A'},
      {id:'3A', row:2, col:0, len:5, dir:'A'},
      {id:'4A', row:3, col:0, len:5, dir:'A'},
      {id:'5A', row:4, col:0, len:5, dir:'A'},
      {id:'1D', row:0, col:0, len:5, dir:'D'},
      {id:'2D', row:0, col:1, len:5, dir:'D'},
      {id:'3D', row:0, col:2, len:5, dir:'D'},
      {id:'4D', row:0, col:3, len:5, dir:'D'},
      {id:'5D', row:0, col:4, len:5, dir:'D'},
    ],
  },
};

// ---------------------------------------------------------------------------
// WEDDING-THEMED WORD CLUES
// Any word that appears in a puzzle will use these clues if available.
// Multiple clue variants rotate when the same word is reused.
// ---------------------------------------------------------------------------
const WORD_CLUES = {
  // 3-letter
  ACE:["Perfect serve","Flawless"],ACT:["Take action","The next ___"],AGE:["Era","How long they've loved"],
  AID:["Help","Support"],AIM:["Goal","Take ___"],AIR:["Texas breeze","Atmosphere"],
  ASH:["Ashlyn's nickname","The bride, shortened"],AWE:["What their story inspires","Wonder"],
  AYE:["Yes vote","Affirmative"],BAY:["Body of water","Texas inlet"],BOW:["Tie a ___","Take a ___"],
  BUD:["Early bloom","What love starts as"],DAY:["September 26 is THE ___","Unit of countdown"],
  DIM:["Soft, as wedding lighting","Not bright"],DIP:["Dance move","Dunk briefly"],
  DUO:["Jeff and Ashlyn","A pair"],EAR:["Listen well","Corn ___"],ELM:["Shade tree","Sturdy wood"],
  END:["Beginning of forever","Finish line that's a starting line"],ERA:["Chapter","The long-distance ___ is over"],
  EVE:["Night before the big day","Adam's partner"],EYE:["Window to the soul","What caught the ring"],
  FAN:["Admirer","What everyone is of this couple"],FIT:["Just right","What the dress did"],
  FLY:["Soar","What the day will"],FUN:["Guaranteed quality of the evening","Good times"],
  GAP:["The distance they crossed","Opening"],GEM:["Jewel","What she is to him"],
  GOD:["Who brought them together","Center of their faith"],GUY:["Jeff, colloquially","The groom"],
  HIM:["Ashlyn's forever person","Pronoun for the groom"],HOP:["Jump","Dance move"],
  HUG:["Warm embrace","First reunion gesture"],JOY:["What fills the room","The feeling on September 26"],
  KEY:["Essential element","What love is"],KIN:["Family","Who fills the chairs"],
  LAW:["What binds them legally","Rule"],LIT:["Illuminated","The room was ___ beautifully"],
  LOT:["A great ___","Much"],MAY:["Month of possibilities","Permission word"],
  MOM:["A mother's role","Honored guest"],OAK:["Sturdy tree","Symbol of strength"],
  ODE:["Tribute poem","Song of praise"],OUR:["Belongs to us both","Pronoun for two"],
  OWN:["To have and to hold","Possess"],RAY:["Beam of light","Golden hour element"],
  ROW:["Line of chairs","Guest seating unit"],RUN:["Keep going","The day will ___ perfectly"],
  SAY:["Speak","What the vows do"],SKY:["Texas blue","Endless above"],
  SON:["Family member","Jeff to his parents"],SUN:["Shining on September 26","Golden hour source"],
  TAN:["Texas golden glow","Sun-kissed"],TEA:["Southern staple","Brew"],
  TIE:["Groom's neckwear","Tie the ___"],TON:["A lot","Heavy amount"],
  TWO:["Jeff + Ashlyn","The magic number"],VOW:["Sacred promise","What they'll exchange"],
  WED:["Marry","What they'll do September 26"],WIT:["Sharp humor","Jeff's gift"],
  WON:["Victory achieved","Jeff ___ her heart"],WOO:["Court","What Jeff did at the social"],
  YES:["Ashlyn's answer","The word that changed everything"],ZEN:["Peaceful state","What they aim for"],
  // 4-letter
  ABLE:["Capable","Ready and ___"],ACHE:["What long distance feels like","Longing"],
  AMEN:["Prayer conclusion","So be it"],ARCH:["Ceremonial gateway","Wedding structure"],
  AWAY:["At a distance","The long-distance word"],BACK:["Return","Jeff came ___ into her life"],
  BASK:["Enjoy warmth","What they'll do in the spotlight"],BEAM:["Radiate joy","What they'll do all day"],
  BELL:["Church ___","Wedding signal"],BOLD:["Brave","What it took to reach out again"],
  BORN:["Came into being","A new chapter is ___"],CALM:["Peaceful","The eye of the wedding storm"],
  CAME:["Arrived","He ___ back into her life"],CARE:["Tend to","What they do for each other"],
  CHIN:["Keep your ___ up","Face part"],CLAP:["Applaud","What guests do at the kiss"],
  COZY:["Warm and comfortable","How they feel together"],CREW:["The wedding party, informally","Team"],
  CURE:["Fix","Love is the ___"],CUTE:["Adorable","How they describe each other"],
  DARE:["Be bold","What it took to love again"],DAWN:["New beginning","September 26 sunrise"],
  DAYS:["Units of countdown","The best ___ of their lives"],DEAR:["Beloved","Term of endearment"],
  DEEP:["Profound","Their love runs ___"],DONE:["Finished","Long distance? ___"],
  DOVE:["Symbol of peace","Love bird"],DUSK:["Evening light","Golden hour at the farm"],
  EARN:["Deserve through effort","What they did"],EASE:["Comfort","Put at ___"],
  EDGE:["Boundary","On the ___ of forever"],EPIC:["Grand","The scale of their love story"],
  EVER:["Always","Happily ___ after"],FADE:["Diminish","Their love never did"],
  FALL:["To ___ in love","Autumn"],FARM:["Davis & Grey ___","Venue word"],
  FAST:["Quick","How the day will fly"],FATE:["Destiny","What brought them together"],
  FILL:["Complete","What they do for each other"],FIRE:["Passion","What lit between them"],
  FIRM:["Solid","Their commitment is ___"],FLOW:["Move freely","How the evening will ___"],
  FOND:["Affectionate","Grown ___ over time"],GAZE:["Look lovingly","What they'll do at the altar"],
  GLAD:["Happy","Everyone is so ___ for them"],GLOW:["Radiate warmth","What the couple will ___"],
  GONE:["Departed","Long distance is ___"],GOOD:["Excellent","So very ___"],
  GOWN:["Wedding dress","What she'll wear"],GROW:["Develop","What their love does"],
  GULF:["Wide gap","What long distance felt like"],HALO:["Glowing ring","Light around the bride"],
  HAND:["Reach out","Held in ceremony"],HAVE:["Possess","To ___ and to hold"],
  HAZE:["Dream-like state","Golden ___"],HEAL:["Mend","What love does"],
  HELD:["Kept close","She was ___ in his arms"],HELP:["Support","What friends and family give"],
  HERE:["Present","We are all ___ for this"],HOLD:["Keep close","To have and to ___"],
  HOLY:["Sacred","This union is ___"],HOME:["Where the heart is","What they are to each other"],
  HOST:["Welcome","Davis & Grey Farms will ___"],HOUR:["Sixty minutes","Golden ___"],
  HYMN:["Sacred song","What they sang in church"],IDEA:["Thought","The best ___ he ever had"],
  INTO:["Toward","Falling ___ love"],JOIN:["Unite","What they do at the altar"],
  JOLT:["Sudden feeling","When they first met"],KEEN:["Eager","Sharp"],
  KEPT:["Held onto","He ___ coming back"],KIND:["Generous","Their defining quality"],
  KING:["Royalty","Jeff, in her eyes"],KNIT:["Bind together","Their lives ___"],
  LACE:["Delicate fabric","Bridal detail"],LAND:["Arrive","What love helps you ___"],
  LATE:["What he was — then wasn't","Better ___ than never"],LEAN:["Depend on","What they do for each other"],
  LEAP:["Jump with faith","What love requires"],LILY:["White flower","Wedding bloom"],
  LIVE:["Exist fully","How they'll ___"],LONE:["Solo","No longer ___"],
  LONG:["Extended time","A ___ road led here"],LOVE:["The whole reason","What this is all about"],
  LUCK:["Fortune","They made their own"],MADE:["Created","They were ___ for each other"],
  MAID:["___ of honor","Paige's role"],MAIN:["Primary","The ___ event"],
  MANY:["Numerous","___ miles, many calls"],MARK:["Note","Make your ___"],
  MATE:["Partner for life","Soul ___"],MEND:["Repair","What time and love do"],
  MINE:["Belonging to me","She's ___"],MINT:["Fresh start","In ___ condition"],
  MOVE:["Take action","What he finally did"],NAME:["Identity","She'll take his ___"],
  NEED:["Require","What they do — each other"],NEST:["Home base","Building their ___"],
  NOTE:["Message","Love ___"],ONCE:["One time","___ they found each other, everything changed"],
  OPEN:["Begin","Hearts wide ___"],OURS:["Belongs to us","The future is ___"],
  OVER:["Finished","Long distance is so ___"],PACE:["Rhythm","Setting the ___ for forever"],
  PACT:["Agreement","The sacred ___ of marriage"],PAGE:["Paige — the MOH","One ___ of their story"],
  PAIR:["Two together","A perfect ___"],PART:["Section","For better or worse"],
  PAST:["History","Their ___ brought them here"],PAVE:["Lay the road","What faith did for their path"],
  PEAK:["High point","The ceremony is the ___"],PINK:["Blush tone","Wedding color note"],
  PLAY:["Perform","What the band will do"],POUR:["Flow freely","What the love did"],
  PRAY:["Speak to God","What they did throughout"],PURE:["Undefiled","What their love is"],
  PUSH:["Persist","What they did through the distance"],RAIN:["Shower","Something old, new, borrowed, ___"],
  RANG:["Sounded","The bell ___"],RARE:["Uncommon","What this love is"],
  REAL:["Genuine","As ___ as it gets"],RELY:["Depend on","What they do for each other"],
  RICH:["Abundant","Their life together will be ___"],RIDE:["Journey","What a ___"],
  RISE:["Come up","Watch love ___"],RISK:["Bold move","What reaching out was"],
  RITE:["Ceremony","Sacred ___"],ROAD:["Path","The long ___ home"],
  ROCK:["Steady foundation","What they are for each other"],ROLE:["Part to play","Every person has a ___"],
  ROSE:["Flower","Love is a ___"],RULE:["Standard","Love ___s"],
  RUSH:["Hurry","No ___"],SAFE:["Secure","How she makes him feel"],
  SAGE:["Wise","Their families are ___"],SAKE:["For the ___ of love","Benefit"],
  SALT:["Seasoning","Worth their ___"],SAME:["Identical","They want the ___ things"],
  SANG:["Voiced in song","The hymns they ___"],SAVE:["Preserve","What they did for each other"],
  SEAL:["Close permanently","___ it with a kiss"],SEED:["Starting point","The ___ they planted in Commerce"],
  SELF:["Identity","They bring out the best ___"],SIGN:["Signal","Every ___ pointed to them"],
  SILK:["Smooth fabric","Bridal material"],SING:["Voice joy","What the congregation will do"],
  SITE:["Location","Davis & Grey Farms as wedding ___"],SOAK:["Absorb fully","___ it all in"],
  SOAR:["Rise high","What their spirits will do"],SOLD:["Convinced","He was ___ from day one"],
  SOLE:["Only one","Her ___ partner"],SONG:["Music","Their first dance ___"],
  SOUL:["Deep self","Soul ___mate"],SPAN:["Bridge","The years they spanned"],
  STAR:["Shining one","They're the ___s tonight"],STAY:["Remain","He came back to ___"],
  STEP:["Move forward","Next ___"],STIR:["Excite","What the ceremony will ___"],
  SUIT:["Groom's wardrobe","What Jeff will be in"],TALL:["Standing ___ together","Elevated"],
  TEAM:["Partners","The best ___ of two"],TEAR:["Drop of emotion","Happy ___s"],
  TEND:["Care for","What they do for each other"],TEST:["Trial","What long distance was"],
  TIDE:["Current","The turning ___"],TILL:["Until","___ death do us part"],
  TIME:["All the ___ they needed","Precious"],TIRE:["Exhaust","They never ___ of each other"],
  TOLD:["Said aloud","She ___ him yes"],TONE:["Quality","The ___ of the evening"],
  TOUR:["Journey through","Grand ___"],TREE:["Rooted growth","Family ___"],
  TRUE:["Authentic","___ north"],TUNE:["Song","In ___ with each other"],
  TWIN:["Two as one","Mirror image connection"],UNDO:["Unravel","What love does to loneliness"],
  UNIT:["Single entity","They are one ___"],URGE:["Desire","The ___ to be together"],
  VALE:["Valley","Through every ___ and peak"],VEIL:["Bridal covering","Wedding accessory"],
  VEST:["Garment","Groom's ___"],VIEW:["Perspective","The ___ from the altar"],
  VINE:["Growing plant","Sixty ___ — engagement dinner"],VOTE:["Choose","They both voted yes"],
  WAIT:["Worth the ___","What long distance required"],WAKE:["Rise","The morning of September 26"],
  WARM:["Comfortable","The feeling in the room"],WAVE:["Ripple outward","___ of emotion"],
  WEDS:["Marries","She ___ him"],WELD:["Fuse permanently","What the ceremony ___s"],
  WELL:["Healthy and happy","All is ___"],WENT:["Traveled","He ___ the distance"],
  WIDE:["Open","Eyes ___ with wonder"],WIFE:["Ashlyn's new title","Jeff's forever person"],
  WILL:["Determination","The ___ to make it work"],WIND:["Breeze","Texas ___ on the farm"],
  WINE:["Toast beverage","Glasses raised"],WISH:["Desire","Everything you could ___ for"],
  WITH:["Together","___ each other always"],WORD:["Promise","On his ___"],
  WORE:["Had on","She ___ white"],WOVE:["Intertwined","Their lives ___ together"],
  YELL:["Shout for joy","What the crowd will do"],ZEAL:["Enthusiasm","With ___ and love"],
  ZEST:["Energy","What the day will have"],
  // 5-letter
  SONIC:["First date stop","Drive-in chain","Their date night shorthand"],
  ARBOR:["Where he got on one knee","Nature park, proposal setting"],
  HILLS:["Arbor ___, proposal site","Where she said yes"],
  VINES:['Engagement dinner spot, minus "60"',"Post-proposal restaurant"],
  DAVIS:["Half the venue name","___ & Grey Farms"],
  GRACE:["What the timing needed","Gift from God","Spiritual favor"],
  AGGIE:["School connection","Texas A&M vibe word"],
  TEXAS:["State of this whole operation","Where love is big"],
  BRYNN:["Cousin bridesmaid","One of Ashlyn's girls"],
  BLAKE:["Ash's brother in the party","Groomsman"],
  PAIGE:["Maid of honor","Ash's best friend"],
  MEGAN:["Proposal day co-conspirator","Friend who kept the secret"],
  ROMAN:["Groomsman name","One of Jeff's guys"],
  AISLE:["Big walk, bigger moment","Wedding runway","Path to forever"],
  ALTAR:["End of the aisle","Where the vows happen","Sacred meeting point"],
  BRIDE:["One in white","Ash on September 26"],
  GROOM:["Jeff on wedding day","Suit at center stage"],
  VOWED:["Made promises, past tense",'Said "I do"'],
  RINGS:["Two circles, one commitment","The yes accessories"],
  DANCE:["Reception floor mission","First ___ as newlyweds"],
  TOAST:["Speech with a raised glass","Reception tradition"],
  DRESS:["What Ashlyn spent months perfecting","Bridal wardrobe piece"],
  VENUE:["Davis & Grey Farms, in one word","Wedding website must"],
  GUEST:["RSVP page person","Anyone with a seat card"],
  PHOTO:["Wedding gallery material","Captured moment"],
  VIDEO:["Wedding memory format","What you'll watch on anniversaries"],
  MUSIC:["First dance ingredient","Reception soundtrack"],
  STAGE:["Where the band sets up","Where toasts happen"],
  HEART:["What they wear on their sleeves","Home of love"],
  UNITY:["Two becoming one","Marriage ceremony word"],
  FAITH:["Relationship foundation","What guided the reunion","Trust in God's plan"],
  JESUS:["Center of it all","Name above every plan"],
  KNEEL:["Proposal posture","What Jeff did before the yes"],
  SMILE:["Proposal photo requirement","What the yes produced"],
  PARTY:["How the proposal night ended","Wedding ___"],
  HOUSE:["Their next chapter starts here","Home building block"],
  HOTEL:["Travel page staple","Where out-of-towners land"],
  STORY:["Yours is a very good one","Website page title"],
  DRIVE:["Long-distance specialty","4.5-hour routine"],
  MILES:["Long-distance tax","The gap that proved worth it"],
  TEXTS:["How the door reopened","Distance communication"],
  CALLS:["Long-distance lifeline","What bridged the gap"],
  VISIT:["Every-other-weekend mission","Long-distance payoff"],
  ROUTE:["What the drive requires","The way there"],
  PLANS:["The entire season of life right now","What the binder holds"],
  READY:["Wedding planning goal by September","Let's go"],
  SWEET:["Vibe word for the whole thing","Their whole story"],
  HONEY:["Endearment answer","What September tastes like"],
  CHARM:["Jeff's secret weapon at the social","Winning quality"],
  MAGIC:["The evening had it","Unexplainable good feeling"],
  SPARK:["What ignited in Commerce, 2021","Starting point of everything"],
  LIGHT:["What the ring caught","Golden hour quality","God's presence"],
  DREAM:["What the whole day felt like","Vision made real"],
  FIRST:["What this whole journey was","___ dance"],
  WORTH:["What every mile was","Value of the journey"],
  WHOLE:["What they make each other","Complete, in one word"],
  NORTH:["True ___, what they are to each other","Compass word"],
  SOUTH:["Texas compass word","Where Davis & Grey Farms is"],
  HAPPY:["State of everyone September 26","Happily ever after"],
  BLUSH:["Soft pink","Wedding color"],
  PEARL:["Classic gem","Bridal jewelry option"],
  OLIVE:["Earthy green","Branch of peace"],
  SATIN:["Smooth fabric","Gown texture"],
  PIZZA:["Reception dinner plan","Crowd-pleaser choice"],
  SAUCE:["Flavor","Extra detail"],
  FARMS:["Davis & Grey ___","Where it all happens"],
  ANGEL:["Heavenly being","What she is to him"],
  ARRAY:["Beautiful spread","The floral ___"],
  BRAVE:["Courageous","What reaching out again took"],
  CARRY:["Bear forward","What vows do"],
  CATCH:["Bouquet ___","The prize"],
  CHAIR:["Seat for a guest","Pull up a ___"],
  CLEAN:["Fresh start","New beginning"],
  CLEAR:["September Texas sky","The path became ___"],
  CORAL:["Warm pink tone","Wedding color note"],
  COUNT:["Count the days","___ down to September"],
  DAILY:["Every day","___ practice of love"],
  DEPTH:["The ___ of their love","Immeasurable"],
  EARLY:["Ahead of schedule","Not too late — just right"],
  EARTH:["World they share","Ground they stand on"],
  EVERY:["Each one","___ single mile"],
  FAINT:["Soft glow","What the doubts became"],
  FAVOR:["Wedding gift","Goodie for guests"],
  FLAME:["The ___ that never went out","Keep the ___ alive"],
  FLOOR:["Dance ___","Hit the ___"],
  FOCUS:["What they keep on each other","Sharp clarity"],
  FOUND:["He ___ her again","Lost and ___"],
  FRONT:["First row","The ___ of the ceremony"],
  GIANT:["The love is ___","Texas-sized"],
  GIVEN:["___ to each other","Freely ___"],
  GRAND:["Magnificent","Big, sweeping love"],
  GRANT:["Bestow","What God ___ed them"],
  GREAT:["Wonderful","This day is going to be ___"],
  GREEN:["Growing color","Farm backdrop"],
  GREET:["Welcome","What the couple does at the receiving line"],
  GRIND:["Persist","The long-distance ___"],
  GUARD:["Protect","What they do for each other"],
  GUIDE:["Lead with care","What faith does"],
  HARSH:["Difficult","Long distance was ___"],
  HONOR:["Cherish","Love and ___"],
  IDEAL:["Perfect","The ___ partner"],
  INNER:["Deep within","The ___ knowing"],
  KNOWN:["Familiar","He's always ___ she was the one"],
  LARGE:["Big","Texas-sized love"],
  LATER:["After some time","Better ___ than never"],
  LAUGH:["Express joy","What the evening will be full of"],
  LAYER:["Level","___ by ___ they revealed themselves"],
  LEARN:["Discover","They ___ each other every day"],
  LEVEL:["Equal","On the same ___"],
  LIVED:["Experienced","They ___ every moment"],
  LOCAL:["Of this place","Texas ___"],
  LUCKY:["Fortunate","They're so ___ to have each other"],
  MARCH:["Move forward","March toward September"],
  MIGHT:["Strength","With all their ___"],
  MIXED:["Combined","___ emotions — all good ones"],
  MODEL:["Example","A ___ couple"],
  MONTH:["Four weeks","___ by ___ they counted down"],
  MOVED:["Deeply affected","Everyone was ___"],
  NEVER:["Not ever","Said ___ to giving up"],
  NIGHT:["The proposal ___","Reception under the stars"],
  NOBLE:["Dignified","The quality both families brought"],
  NOVEL:["New and exciting","Their story is a great ___"],
  PEACE:["Tranquility","What they give each other"],
  PLANT:["Grow something","What they did in each other's hearts"],
  POINT:["The ___: they were meant to be","Purpose"],
  POWER:["Strength","The ___ of love"],
  PRIDE:["Joyful satisfaction","What their families feel"],
  PRIME:["At their best","In their ___ together"],
  PROOF:["Evidence","Love is the ___"],
  PROUD:["With satisfaction","So ___ of each other"],
  QUEEN:["Royalty","Ashlyn, in Jeff's eyes"],
  QUIET:["Peaceful stillness","Before the ceremony starts"],
  RAISE:["Lift a glass","___ a toast"],
  RANGE:["Expanse","The ___ of emotion today"],
  REACH:["Extend toward","Finally within ___"],
  RELAX:["Let go of worry","What they'll finally do"],
  REPLY:["Respond","The yes was the best ___ ever"],
  RIGHT:["Correct","Mr. ___"],
  RISEN:["Come up","The sun has ___"],
  RIVER:["Flowing water","Texas waterway"],
  ROUGH:["Difficult","___ times made them stronger"],
  ROUND:["Gather around","___ of applause"],
  ROYAL:["Majestic","Treated like ___ty"],
  RURAL:["Country setting","Celeste, Texas — the setting"],
  SCENE:["Farm at golden hour","The ___ was perfect"],
  SERVE:["Give of oneself","What they pledged for each other"],
  SHARP:["Keen","The groom looked ___"],
  SIGHT:["Vision","Love at first ___"],
  SINCE:["From that point","___ Commerce, everything changed"],
  SKILL:["Ability","The ___ of loving well"],
  SLEEP:["Rest","Neither will ___ the night before"],
  SMALL:["The ___ gesture that meant everything","Tiny but real"],
  SOUND:["Resonant","___ advice from those who love them"],
  SPEED:["How fast time flies","At full ___"],
  SPELL:["Cast a ___","She had him under her ___"],
  SPEND:["Invest time","A lifetime to ___"],
  SPOKE:["Said aloud","He finally ___ up"],
  STAND:["Be present","Take a ___"],
  STATE:["Texas — always","Happy ___"],
  STILL:["Even now","Standing ___ at the altar"],
  STORE:["Keep safe","Memories they'll ___"],
  STYLE:["Flair","Ash's ___ is impeccable"],
  SUGAR:["Sweet","Oh ___!"],
  SUPER:["Beyond great","___ couple"],
  SWIFT:["Quick","How the years passed"],
  TABLE:["Reception ___s","Seating"],
  THICK:["Through thick and thin","Deeply bonded"],
  THING:["The real ___","They've got a good ___"],
  THINK:["Reflect","I ___ it's forever"],
  THREE:["Number","___ words: I love you"],
  THROW:["Bouquet ___","Cast out"],
  TOTAL:["Complete","___ commitment"],
  TOUCH:["Physical connection","A gentle ___"],
  TOUGH:["Hard","___ love — worth it"],
  TRACE:["Follow the path","___ of joy in every detail"],
  TRACK:["Record","On ___"],
  TRADE:["Exchange","___ vows"],
  TRAIL:["Path","The ___ that led to yes"],
  TRAIN:["Bridal ___","Gown detail"],
  TREAT:["Delight","What this day is — a ___"],
  TREND:["Movement","Love never goes out of ___"],
  TRUST:["Faith in each other","I ___ you"],
  TRUTH:["Honesty","They were always meant to be"],
  TWICE:["Two times","He fell in love ___ — with the same person"],
  UNDER:["Beneath","___ the same sky"],
  UNION:["Joining","Sacred ___"],
  UNTIL:["Up to the moment","___ forever begins"],
  VALID:["Real","Everything about this is ___"],
  VALUE:["Worth","What they place on each other"],
  VOICE:["Say it aloud","Exchange ___s at the altar"],
  WATCH:["Witness","Count no more"],
  WATER:["Life-giving","Rivers they crossed together"],
  WEAVE:["Intertwine","How their lives came together"],
  WHERE:["Location of forever","___ they always belonged"],
  WHITE:["Bridal color","Pure and beautiful"],
  WOMAN:["The bride","Ashlyn — a remarkable one"],
  WORLD:["Their whole ___","Everything to each other"],
  WORRY:["No more","Leave ___ at the door"],
  WRITE:["Record","___ the next chapter together"],
  YIELD:["Give in to love","Surrender"],
  YOUNG:["Fresh","Their love keeps them ___"],
  YOURS:["Belonging to you","I am ___"],
  AMBER:["Warm honey-gold of sunset","The color of the hour"],
  EMBER:["What never fully went out","Glowing remnant of a fire"],
  SHARE:["What marriage is","One long act of ___"],
  SWING:["Porch fixture at the farm","Dance move"],
  THEME:["The aesthetic of the evening","Their running ___"],
  VISTA:["View from the farm at sunset","Panoramic scene"],
  CHEER:["What erupted at 'husband and wife'","Jubilant shout"],
  ADORE:["Love deeply","What they do"],
  AGREE:["Come to terms","They ___"],
  ALIVE:["Living","Never more ___"],
  ALONE:["By oneself","Never again ___"],
  BLISS:["Pure joy","Newlywed ___"],
  BLOOM:["Flower open","Watch love ___"],
  BOOST:["Lift up","They ___ each other"],
  BOUND:["Heading toward","___ for forever"],
  BRAND:["Mark","___ new chapter"],
  BLESS:["Give grace","God ___ them"],
  BUILD:["Construct","___ a life"],
  BURST:["Sudden release","___ with love"],
  CHECK:["Verify","___ your heart"],
  CLOSE:["Near","Stay ___"],
  COVER:["Protect","___ each other"],
  CRAFT:["Skill","The ___ of loving"],
  CROWN:["Top achievement","Their ___ing glory"],
  DEBUT:["First appearance","Their wedding ___"],
  ENJOY:["Take pleasure in","___ every moment"],
  ENTER:["Go in","___ the next chapter"],
  EQUAL:["Same as","___ partners"],
  EXCEL:["Do very well","They ___ together"],
  FEAST:["Big meal","Wedding ___"],
  FINAL:["Last one","The ___ yes"],
  FLASH:["Quick light","In a ___"],
  FORGE:["Shape by heat","___ a life together"],
  FORTE:["Strong point","Love is their ___"],
  FRAME:["Structure","___ the moment"],
  FRANK:["Honest","Beautifully ___"],
  FREED:["Set loose","___ from distance"],
  FRESH:["New","Brand ___"],
  FULLY:["Completely","___ committed"],
  GAUGE:["Measure","No need to ___ this love"],
  GLIDE:["Smooth move","___ into forever"],
  GOING:["Departing","Where are they ___? Forever"],
  GRASP:["Hold firmly","___ the moment"],
  GROUP:["Collection","Their whole ___"],
  GROVE:["Small forest","Arbor ___"],
  GROWN:["Fully developed","They've ___"],
  GUSTO:["Enthusiasm","With ___"],
  HAVEN:["Safe place","A ___ for two"],
  HURRY:["Move fast","No need to ___"],
  JEWEL:["Precious stone","She's his ___"],
  JOLLY:["Merry","Keeping it ___"],
  KNACK:["Natural skill","The ___ for love"],
  LEGAL:["Lawful","Legally ___"],
  MATCH:["Pair up","A perfect ___"],
  MERRY:["Cheerful","Marry ___ Ashlyn"],
  OCCUR:["Happen","May only good things ___"],
  OFFER:["Put forward","Love's ___"],
  ORDER:["Arrange","In ___"],
  PAUSE:["Brief stop","___ and breathe it in"],
  PIANO:["Keyboard instrument","Wedding ___"],
  PLACE:["Location","This ___"],
  POSED:["Positioned","Wedding ___"],
  POUND:["Strike hard","Heart ___s"],
  PRIZE:["Reward","She's the ___"],
  PROVE:["Show true","They ___ love endures"],
  PULSE:["Heartbeat rhythm","___ of love"],
  RALLY:["Come together","Everyone ___s for them"],
  REALM:["Kingdom","Their ___"],
  REMIT:["Send back","No ___"],
  REPAY:["Pay back","Repay with love"],
  RESET:["Start over","A beautiful ___"],
  RISKY:["Dangerous","Love is worth the ___"],
  RIVAL:["Competitor","Distance was the ___"],
  SAVOR:["Enjoy fully","___ every moment"],
  SEIZE:["Grab","___ the day"],
  SENSE:["Perceive","Common ___"],
  SEVEN:["Lucky number","Lucky ___"],
  SHADE:["Partial darkness","Golden ___"],
  SHAME:["Embarrassment","No ___"],
  SHINE:["Give light","Let it ___"],
  SHOCK:["Sudden surprise","Happy ___"],
  SHORE:["Land by water","Love is the ___"],
  SHOUT:["Yell","Shout it out"],
  SHOWN:["Displayed","Love has been ___"],
  SHIFT:["Move or change","A ___ toward forever"],
  SIXTH:["After fifth","The ___ sense — love"],
  SIXTY:["Six tens","Sixty Vines — the proposal dinner"],
  SLANT:["Angle","A new ___"],
  SLICK:["Smooth","Slickly done"],
  SMART:["Clever","Smart choice"],
  SMASH:["Break","___ all doubts"],
  SOLAR:["Sun-powered","___ energy — like their love"],
  SOLVE:["Find answer","___ every puzzle together"],
  SPARE:["Extra","Not a ___ moment of regret"],
  SPINE:["Back bone","___ of steel, heart of gold"],
  SPORT:["Athletic game","Good ___"],
  SPRAY:["Scatter liquid","Confetti ___"],
  SPREE:["Shopping trip","Bridal ___"],
  STACK:["Pile up","___ of good memories"],
  STARE:["Look intently","___ into each other's eyes"],
  START:["Begin","The ___"],
  STEEP:["Sharp incline","Worth the ___ climb"],
  STICK:["Thin rod","Stick together"],
  STONE:["Hard mineral","Rolling ___s — they've settled"],
  STORM:["Wild weather","Weathered every ___"],
  STOUT:["Strong built","___ of heart"],
  SURGE:["Rush forward","Love ___s"],
  SWEAR:["Promise solemnly","I ___ forever"],
  SWEEP:["Clean up","___ the floor with happiness"],
  SWELL:["Grow bigger","Hearts ___ with love"],
  SWEPT:["Cleaned up","Swept off their feet"],
  SWIRL:["Circular motion","___ of joy"],
  TENSE:["Tight feeling","No longer ___"],
  TITLE:["Name given","New ___: husband and wife"],
  TOXIC:["Poisonous","Nothing ___ here"],
  TRIBE:["Social group","Their ___"],
  TRIED:["Attempted","Love ___ and true"],
  TROOP:["Group","Merry ___"],
  TRULY:["With sincerity","___ forever"],
  TUNED:["Adjusted","Perfectly ___"],
  TWIST:["Turn around","Unexpected ___ — it worked!"],
  ULTRA:["Extreme","___ happy"],
  UNIFY:["Bring together","What vows do"],
  UPSET:["Troubled","No ___s"],
  UTTER:["Completely","___ joy"],
  VAPOR:["Mist","Morning ___"],
  VAULT:["Jump over","___ into the future"],
  VIBES:["Feelings","Good ___"],
  VIGOR:["Energy","Full of ___"],
  VITAL:["Essential","___ to each other"],
  VIVID:["Bright and clear","___ memories ahead"],
  VOCAL:["Out loud","___ about their love"],
  VOGUE:["In fashion","In ___"],
  WALTZ:["Dance","Wedding ___"],
  WRATH:["Fierce anger","No ___ today"],
};

// ---------------------------------------------------------------------------
// COMMON FILL WORDS — standard crossword-friendly clues for everyday words.
// These supplement WORD_CLUES to give the solver enough candidates.
// ---------------------------------------------------------------------------
const FILL_CLUES = {
  // 3-letter fill
  ACT:"Take action",ADD:"Put together",AGO:"Time past",ALL:"Every one",
  AND:"Plus",ANT:"Tiny insect",APE:"Mimic",ARC:"Curved line",ARM:"Limb",
  ASK:"Pose a question",ATE:"Had a meal",BAD:"Not good",BAG:"Carry-all",
  BAN:"Prohibit",BAR:"Block",BAT:"Swing",BED:"Rest place",BEG:"Plead",
  BET:"Wager",BIG:"Large",BIT:"Small amount",BOX:"Container",BUS:"Transit",
  BUT:"However",BUY:"Purchase",CAP:"Top it off",CAR:"Vehicle",CAT:"Feline",
  COP:"Officer",COT:"Small bed",COW:"Farm animal",CRY:"Weep",CUP:"Vessel",
  CUT:"Slice",DEW:"Morning drops",DIG:"Excavate",DOC:"Doctor",DOE:"Female deer",
  DOG:"Loyal companion",DOT:"Tiny spot",DRY:"Parched",EGG:"Oval ingredient",
  ELK:"Large deer",FAD:"Brief craze",FAR:"Distant",FAT:"Plump",FEW:"Not many",
  FIG:"Sweet fruit",FIX:"Repair",FOG:"Low cloud",GEL:"Styling product",
  GET:"Obtain",GIG:"Performance",GOT:"Obtained",GUM:"Chewy stuff",GUN:"Weapon",
  HAD:"Possessed",HAM:"Cured meat",HAS:"Possesses",HAT:"Head cover",HAY:"Farm fodder",
  HEN:"Female chicken",HID:"Concealed",HOT:"High temp",HOW:"In what way",
  ICE:"Frozen water",ILL:"Sick",INN:"Country lodging",JAB:"Quick punch",
  JAM:"Fruit spread",JAR:"Glass container",JET:"Fast plane",JIG:"Quick dance",
  JOB:"Occupation",KID:"Young one",KIT:"Equipment set",LAP:"Seated surface",
  LEG:"Limb",LET:"Allow",LIE:"Recline",LOG:"Tree section",LOW:"Not high",
  MAP:"Chart",MAT:"Floor cover",MEN:"Males",MET:"Encountered",MID:"Middle",
  MIX:"Combine",MOB:"Crowd",MOP:"Floor tool",MUD:"Wet earth",MUG:"Face or cup",
  NAP:"Short sleep",NET:"After deductions",NEW:"Not old",NOD:"Head agreement",
  NOR:"Neither",NOT:"Negation",NUT:"Crunchy snack",OAT:"Grain",ODD:"Strange",
  OIL:"Lubricant",OLD:"Aged",ONE:"Single",PAD:"Writing tablet",PAN:"Cooking vessel",
  PAT:"Gentle tap",PAY:"Compensate",PEA:"Green veggie",PEG:"Fastener",
  PEN:"Writing tool",PET:"Cherished animal",PIE:"Baked dish",PIN:"Fasten",
  PIT:"Hollow",POD:"Seed case",POP:"Burst",POT:"Vessel",PUB:"Social spot",
  RAM:"Male sheep",RAP:"Knock",RAT:"Rodent",RED:"Warm color",RIB:"Curved bone",
  RIG:"Equipment",RIP:"Tear",ROB:"Take from",ROD:"Straight stick",ROT:"Decay",
  RUB:"Friction",RUG:"Floor covering",SAP:"Tree fluid",SAT:"Rested",
  SAW:"Cutting tool",SET:"Group",SEW:"Stitch",SHY:"Timid",SIP:"Small drink",
  SIT:"Take a seat",SIX:"Half a dozen",SOB:"Cry hard",SOW:"Plant seeds",
  SPY:"Secret watcher",TAB:"Small bill",TAP:"Light knock",TAR:"Road surface",
  TIP:"Pointed end",TOE:"Foot digit",TOP:"Summit",TOT:"Small child",
  TUB:"Bathing vessel",TUG:"Pull hard",WAX:"Polish",WIG:"Hairpiece",WIN:"Succeed",
  WOK:"Cooking pan",WHY:"For what reason",ZIP:"Move fast",ZAP:"Strike",

  // 4-letter fill
  ABLE:"Capable",ACID:"Sour",AGED:"Old",AIDE:"Helper",AIMS:"Goals",
  ALSO:"In addition",AMID:"In the middle",ANTE:"Stake up",ARMY:"Military force",
  ARTS:"Creative fields",AUNT:"Parent's sister",AVID:"Eager",AWED:"Amazed",
  BABE:"Infant",BAIL:"Get free",BALE:"Bundle",BALL:"Round toy",BAND:"Music group",
  BARE:"Exposed",BARN:"Farm building",BATH:"Wash up",BEAD:"Small jewel",
  BEAT:"Rhythm",BELT:"Waist band",BIND:"Tie together",BIRD:"Feathered friend",
  BITE:"Nibble",BOLT:"Secure",BOOM:"Big sound",BROW:"Forehead",BURN:"On fire",
  CAGE:"Enclosure",CAPE:"Flowing garment",CART:"Wheeled carrier",CAST:"Throw",
  CAVE:"Underground space",CHIP:"Small piece",CITY:"Urban center",CLAN:"Family group",
  CLAY:"Moldable earth",CLIP:"Attach",COAL:"Dark fuel",COAT:"Outer layer",
  COIL:"Spiral",COOL:"Not warm",COPE:"Manage",CORE:"Center",COST:"Price",
  CROP:"Farm harvest",CUBE:"3D square",DALE:"Small valley",DAMP:"Slightly wet",
  DART:"Quick move",DASH:"Sprint",DECK:"Level surface",DEEM:"Consider",
  DEFT:"Skillful",DELI:"Food shop",DENT:"Small hollow",DENY:"Refuse",
  DESK:"Work surface",DIME:"Small coin",DINE:"Eat formally",DISC:"Round object",
  DISH:"Serving plate",DIVE:"Plunge",DOCK:"Harbor stop",DOME:"Rounded top",
  DOOM:"Dark fate",DOOR:"Entry point",DOTE:"Adore",DUAL:"Two-part",
  EACH:"Every one",EARL:"Noble title",EAST:"Direction",EMIT:"Give off",
  EVEN:"Level",EXAM:"Test",FAIR:"Just",FAME:"Renown",FANG:"Sharp tooth",
  FARE:"Journey cost",FEAT:"Achievement",FILM:"Movie",FIND:"Discover",
  FIST:"Closed hand",FLAW:"Imperfection",FLEW:"Past of fly",FLED:"Ran away",
  FLEX:"Show strength",FLIP:"Turn over",FLIT:"Move quickly",FOAM:"Bubbly mass",
  FOLK:"People",FOOD:"Nourishment",FOOL:"Act silly",FORE:"Before",FORK:"Eating tool",
  FORT:"Stronghold",FOUR:"Number after three",FOWL:"Farmyard bird",FRAY:"Unravel",
  FUME:"Smoke",FUND:"Resource",FURY:"Intense anger",FUSE:"Connect",GALE:"Strong wind",
  GEAR:"Equipment",GILD:"Add gold",GIVE:"Offer freely",GLAD:"Happy",GLOB:"Lump",
  GOAD:"Prod forward",GORE:"Wound",GRAB:"Seize",GRIM:"Serious",GRIP:"Hold tight",
  GULF:"Wide gap",GUST:"Wind burst",HALE:"Healthy",HALF:"50 percent",
  HALL:"Corridor",HALT:"Stop",HANG:"Suspend",HARE:"Fast rabbit",HARK:"Listen",
  HASH:"Mix up",HATE:"Strong dislike",HAUL:"Drag along",HAWK:"Sharp-eyed bird",
  HEAD:"Top part",HEAP:"Big pile",HEAT:"Warmth",HEED:"Pay attention",
  HEEL:"Back of foot",HERB:"Cooking plant",HIKE:"Long walk",HILL:"Small rise",
  HIRE:"Bring on board",HOOD:"Cover",HOOP:"Circle",HOSE:"Spray device",
  HUNT:"Search for",HURL:"Throw hard",ICED:"Cooled down",ICON:"Symbol",
  IDOL:"Admired one",INCH:"Small measure",INKY:"Dark",IRIS:"Flower",IRON:"Press flat",
  ISLE:"Small island",ITCH:"Scratchy feeling",JADE:"Green gem",JEST:"Joke",
  JUST:"Fair and right",KEEN:"Sharp",KEYS:"Access tools",KICK:"Strike",
  KILL:"End",LAME:"Weak",LAMP:"Light source",LARK:"Fun adventure",LAST:"Final",
  LAUD:"Praise",LAVA:"Volcanic flow",LAZE:"Relax",LEAF:"Tree part",
  LEND:"Loan out",LENS:"Glass",LEST:"For fear that",LICK:"Quick taste",
  LIFT:"Raise up",LIME:"Citrus",LINK:"Connect",LION:"Brave cat",LISP:"Speech",
  LOFT:"Upper space",LOOP:"Circle back",LOSS:"Defeat",LOUD:"High volume",
  MADE:"Created",MALE:"Masculine",MANE:"Crown of hair",MASK:"Cover face",
  MEAN:"Average",MEAT:"Protein",MENU:"Food choices",MERE:"Simple",MESH:"Interlace",
  MINK:"Soft fur",MIST:"Light fog",MOAN:"Longing sound",MODE:"Method",MOLD:"Shape",
  MOLT:"Shed covering",MOOR:"Open land",MOPE:"Feel blue",MORE:"Additional",
  MOTH:"Night flier",MUTE:"Silent",NAIL:"Secure",NEAT:"Tidy",NEWT:"Pond creature",
  NICE:"Pleasant",NOON:"Midday",NORM:"Standard",OATH:"Solemn promise",ODDS:"Probability",
  ONCE:"One time",PANE:"Glass panel",PALE:"Light color",PASS:"Go through",
  PAVE:"Lay a road",PEAL:"Ring out",PEEL:"Remove layer",PIER:"Dock",
  PILL:"Small tablet",PINE:"Long for",PIPE:"Tube",PITY:"Compassion",
  PLAN:"Organize",PLEA:"Urgent request",PLOW:"Break ground",PLUS:"Add on",
  POLL:"Survey",POOL:"Shared resource",PREY:"Target",PRIM:"Proper",
  PROD:"Nudge",PROP:"Support",PULL:"Draw toward",PUMP:"Push fluid",
  RACK:"Hold things",RAGE:"Strong emotion",RAID:"Sudden move",RAIL:"Guard bar",
  RAMP:"Sloping road",RANK:"Standing",RANT:"Speak loudly",RAPT:"Absorbed",
  RASH:"Hasty",RAYS:"Beams of light",REEL:"Spin",REIN:"Guide",RENT:"Pay to use",
  RICE:"Grain",RICK:"Stack of hay",RIFT:"Gap",RILL:"Small stream",RIND:"Outer skin",
  RIOT:"Wild commotion",ROBE:"Soft garment",ROAM:"Wander",ROAR:"Loud cry",
  RODE:"Past of ride",ROLL:"Turn over",ROMP:"Play freely",ROUT:"Big win",
  RUIN:"Damage",RUSE:"Clever trick",RUST:"Oxidize",RYES:"Grain plural",
  SCAN:"Look over",SCAR:"Mark left behind",SEAM:"Join line",SEAR:"Brown quickly",
  SELL:"Exchange",SEMI:"Half",SEWN:"Stitched",SHED:"Let go",SHUN:"Avoid",
  SILL:"Window base",SIRE:"Father",SLAB:"Flat chunk",SLAP:"Quick hit",
  SLAT:"Thin strip",SLIM:"Narrow",SLIP:"Slide",SLIT:"Narrow cut",SLOT:"Opening",
  SLOW:"Not fast",SLUG:"Move slowly",SOCK:"Cover foot",SOIL:"Earth",SOLO:"Alone",
  SOOT:"Ash residue",SORT:"Categorize",SOUR:"Tart",SPAN:"Bridge across",
  SPAR:"Practice",SPED:"Went fast",SPIN:"Rotate",SPIT:"Eject",SPOT:"Place",
  SPUN:"Rotated",SPUR:"Motivate",STAB:"Pierce",STAG:"Male deer",STEM:"Source",
  STEW:"Slow cook",STUB:"Blunt end",STUD:"Fastener",SUCH:"Of that kind",
  SULK:"Brood",SUNK:"Went down",SURF:"Ride waves",SWAM:"Past swim",
  SWAN:"Graceful bird",SWAP:"Trade",SWAT:"Strike",SWAY:"Move gently",
  TACK:"Change course",TAME:"Gentle",TANG:"Sharp taste",TAPE:"Bind",
  TAUT:"Pulled tight",TICK:"Mark off",TILL:"Until",TOAD:"Frog cousin",
  TOIL:"Hard work",TOLL:"Cost paid",TORE:"Ripped",TORN:"Divided",TOSS:"Throw",
  TOWN:"Small city",TRAY:"Flat carrier",TRIO:"Three",TRIP:"Journey",
  TROD:"Walked on",TROT:"Steady pace",TROY:"Weight system",TUCK:"Fold in",
  TUFT:"Small cluster",TUNA:"Ocean fish",TUSK:"Long tooth",TUTU:"Ballet skirt",
  TYPO:"Typing error",UGLY:"Not pretty",UPON:"On top of",USED:"Previously",
  USER:"One who uses",VAIN:"Self-focused",VARY:"Change",VENT:"Let out",
  VERY:"Extremely",VOID:"Empty",VOLT:"Energy unit",WADE:"Move through",
  WAIL:"Cry out",WANE:"Diminish",WARD:"Protect",WARY:"Cautious",
  WEAL:"Welfare",WEAN:"Move away",WELD:"Fuse",WEND:"Travel",WHET:"Sharpen",
  WHIM:"Passing fancy",WHIP:"Stir fast",WILD:"Untamed",WILE:"Clever trick",
  WILT:"Droop",WING:"Take flight",WINK:"Knowing look",WIRE:"Connect",
  WOKE:"Became aware",WOLF:"Wild canine",WOMB:"Origin",WREN:"Small bird",
  WRIT:"Legal document",YELL:"Shout",ZERO:"Nothing",ZONE:"Area",ZOOM:"Move fast",

  // 5-letter fill
  ABOUT:"Concerning",ABOVE:"Higher than",ABUSE:"Mistreat",ACTED:"Performed",
  ADDED:"Increased",ADMIT:"Confess",ADOPT:"Take as own",AFTER:"Following",
  AGAIN:"Once more",AGREE:"Come to terms",AHEAD:"In front",ALERT:"Watchful",
  ALIKE:"Similar",ALIVE:"Living",ALLOW:"Permit",ALONG:"Forward",ALONE:"By oneself",
  ALOUD:"Out loud",AMONG:"In the middle",AMUSE:"Entertain",ARISE:"Come up",
  ASIDE:"Off to the side",ASSET:"Valuable thing",ATONE:"Make right",AWAKE:"Not sleeping",
  AWARD:"Give recognition",AWARE:"Knowing",AWFUL:"Terrible",AZURE:"Sky blue",
  BASIC:"Fundamental",BEGAN:"Started",BEGIN:"Start",BEING:"Existing",BELOW:"Under",
  BENCH:"Seating",BIBLE:"Holy book",BLACK:"Dark color",BLADE:"Sharp edge",
  BLANK:"Empty space",BLAST:"Explosion",BLAZE:"Fire",BLEAK:"Gloomy",BLEND:"Mix",
  BLOCK:"Solid chunk",BLOWN:"Moved by wind",BOARD:"Flat surface",BONUS:"Extra reward",
  BOUND:"Heading toward",BRAIN:"Thinking organ",BREAK:"Pause",BRIEF:"Short",
  BRING:"Carry here",BROAD:"Wide",BROKE:"No money",BROOK:"Small stream",
  BRUSH:"Light touch",BUILT:"Constructed",BUNCH:"Cluster",BURST:"Sudden release",
  COULD:"Had ability",COVER:"Protect",CRACK:"Split",CRAFT:"Skill",CRISP:"Fresh",
  CROSS:"Angry",CROWD:"Many people",CRUSH:"Strong feeling",CYCLE:"Repeat pattern",
  DEBUT:"First appearance",DENSE:"Packed",DODGE:"Move aside",DOUBT:"Uncertainty",
  DRAFT:"First version",DRAPE:"Hang fabric",DRAWN:"Attracted",DUNES:"Sand hills",
  EAGER:"Enthusiastic",EAGLE:"Soaring bird",EIGHT:"Number 8",ELECT:"Choose",
  ELITE:"Top group",EMAIL:"Digital message",EMPTY:"Nothing inside",ENDED:"Came to close",
  ENEMY:"Opponent",ENJOY:"Take pleasure",ENTER:"Go in",EQUAL:"Same as",
  ESSAY:"Written piece",EXCEL:"Do very well",EXTRA:"More than needed",FABLE:"Short story",
  FALLS:"Tumbles down",FALSE:"Not true",FANCY:"Elaborate",FEAST:"Big meal",
  FENCE:"Boundary",FERRY:"Water transport",FETCH:"Go get it",FIBER:"Thread",
  FIFTH:"After fourth",FIFTY:"Half hundred",FIXED:"Repaired",FIZZY:"Bubbly",
  FLANK:"Side",FLASH:"Quick light",FLASK:"Container",FLEET:"Group",FLESH:"Body tissue",
  FLICK:"Quick snap",FLOCK:"Group of birds",FLOOD:"Overflow",FLOUR:"Baking base",
  FLUID:"Liquid",FLUTE:"Wind instrument",FOGGY:"Hazy",FOLLY:"Foolish act",
  FORAY:"Quick trip",FORTY:"Four tens",FORUM:"Discussion",FRAIL:"Delicate",
  FRAME:"Structure",FRANK:"Honest",FRAUD:"Deception",FRESH:"New",FROST:"Ice coating",
  FRUIT:"Sweet produce",FUNNY:"Amusing",GHOST:"Spirit",GLARE:"Harsh light",
  GLOOM:"Darkness",GLOSS:"Shine",GLOVE:"Hand cover",GOING:"Departing",
  GRADE:"Level",GRASS:"Green cover",GRAZE:"Light touch",GROAN:"Sound of feeling",
  GROSS:"Before deductions",GROVE:"Small forest",GROWN:"Fully developed",
  HABIT:"Regular pattern",HANDY:"Useful",HAZEL:"Light brown",HENCE:"Therefore",
  HERBS:"Plant seasonings",HINGE:"Pivot point",HOMER:"Home run",HORSE:"Riding animal",
  HUMAN:"Person",HUMID:"Moist air",HURRY:"Move fast",INBOX:"Messages in",
  INPUT:"Data in",ISSUE:"Matter",IVORY:"White shade",JAZZY:"Lively",JEWEL:"Precious stone",
  JOINT:"Shared",JOKER:"Funny card",JUMPY:"Nervous",KAYAK:"Paddle boat",
  KNACK:"Natural skill",KNIFE:"Sharp tool",KNOCK:"Tap firmly",LANCE:"Pointed rod",
  LABEL:"Identify",LATCH:"Catch",LEAFY:"Full of leaves",LEGAL:"Lawful",
  LEMON:"Sour citrus",LINGO:"Language",LOGIC:"Reasoned thought",LUNAR:"Moon-related",
  LYRIC:"Song words",MAPLE:"Tree with syrup",MEDIA:"Communications",MERRY:"Cheerful",
  MESSY:"Untidy",METAL:"Hard material",METRO:"City center",MOTIF:"Repeated pattern",
  MOTOR:"Engine",MOUNT:"Climb up",MOUSE:"Small rodent",MOUTH:"Speaking part",
  MOVIE:"Film",MUDDY:"Dirty",NAIVE:"Inexperienced",NOISY:"Loud",NOTCH:"Small cut",
  NOTED:"Well-known",NURSE:"Care giver",OCCUR:"Happen",OCEAN:"Vast water",
  OFFER:"Put forward",OFTEN:"Many times",ONSET:"Beginning",OPERA:"Musical drama",
  OUTER:"Outside",OWNER:"Possessor",PAINT:"Color with brush",PAUSE:"Brief stop",
  PETTY:"Small-minded",PHASE:"Stage",PHONE:"Call device",PIXEL:"Screen dot",
  PLACE:"Location",PLANK:"Flat board",PLAZA:"Open square",PLEAD:"Beg earnestly",
  PLUCK:"Pull out",PLUSH:"Luxurious",POKER:"Card game",POLAR:"Near a pole",
  POSED:"Positioned",POUCH:"Small bag",POUND:"Strike hard",PRANK:"Playful trick",
  PRICE:"Cost",PRINT:"Reproduce",PRISM:"Light bender",PROBE:"Investigate",
  PROSE:"Plain writing",PROVE:"Show true",PROWL:"Roam quietly",PULSE:"Heartbeat",
  QUERY:"Question",QUEUE:"Line up",QUOTA:"Set amount",QUOTE:"Repeat words",
  RADAR:"Detection system",RADIO:"Broadcast",RALLY:"Come together",RAVEN:"Black bird",
  REALM:"Kingdom",REBEL:"Go against",REMIT:"Send back",REPAY:"Pay back",
  RESET:"Start over",RIDGE:"Long crest",RIGID:"Not flexible",RIVAL:"Competitor",
  ROAST:"Cook dry heat",ROCKY:"Uneven",ROUGE:"Red color",SADLY:"With sadness",
  SAINT:"Holy person",SALAD:"Fresh mix",SALON:"Style place",SASSY:"Bold",
  SAVOR:"Enjoy fully",SCONE:"Baked treat",SCOOP:"Gather up",SCOPE:"Extent",
  SCOUT:"Explore",SEIZE:"Grab",SENSE:"Perceive",SEVEN:"Lucky number",
  SHADE:"Partial darkness",SHAKE:"Move rapidly",SHAME:"Embarrassment",SHEAR:"Cut away",
  SHELF:"Storage ledge",SHELL:"Outer casing",SHIFT:"Move or change",SHINE:"Give light",
  SHOCK:"Sudden surprise",SHORE:"Land by water",SHOUT:"Yell",SHOWN:"Displayed",
  SHRUB:"Small bush",SIGMA:"Greek letter",SIXTH:"After fifth",SKATE:"Glide on ice",
  SKULL:"Head bone",SLANT:"Angle",SLATE:"Dark stone",SLICK:"Smooth",SLIDE:"Glide down",
  SLOPE:"Incline",SMART:"Clever",SMASH:"Break",SMOKE:"Fire output",SNACK:"Light bite",
  SNARE:"Trap",SOLAR:"Sun-powered",SOLVE:"Find answer",SORRY:"Regretful",
  SPARE:"Extra",SPAWN:"Give rise to",SPECK:"Tiny dot",SPINE:"Back bone",
  SPOOL:"Winding cylinder",SPOON:"Curved utensil",SPORT:"Athletic game",
  SPRAY:"Scatter liquid",STACK:"Pile up",STALE:"Not fresh",STAMP:"Mark firmly",
  STARE:"Look intently",START:"Begin",STARK:"Bare",STEEP:"Sharp incline",
  STICK:"Thin rod",STING:"Sharp pain",STOCK:"Supply",STOMP:"Step hard",
  STONE:"Hard mineral",STOOP:"Bend down",STORM:"Wild weather",STOUT:"Strong built",
  STOVE:"Cooking surface",STRAP:"Bind",STRAW:"Hollow tube",STRIP:"Remove",
  STUCK:"Unable to move",STUMP:"Tree base",STUNG:"Got bitten",STUNT:"Daring act",
  SUNNY:"Full of sun",SURGE:"Rush forward",SWEAR:"Promise solemnly",SWEEP:"Clean up",
  SWELL:"Grow bigger",SWEPT:"Cleaned up",SWIRL:"Circular motion",SWOOP:"Dive down",
  TAUNT:"Mock",TENSE:"Tight feeling",TENTH:"After ninth",TIGER:"Striped cat",
  TIMER:"Counting device",TITLE:"Name given",TOTEM:"Symbol",TOXIC:"Poisonous",
  TREAD:"Step on",TRIBE:"Social group",TRICK:"Clever move",TRIED:"Attempted",
  TROOP:"Group",TRULY:"With sincerity",TUNED:"Adjusted",TUTOR:"Teacher",
  TWIST:"Turn around",ULTRA:"Extreme",UNIFY:"Bring together",UPSET:"Troubled",
  URBAN:"City-based",USAGE:"How it's used",USUAL:"Normal",UTTER:"Completely",
  VAGUE:"Not clear",VAPOR:"Mist",VAULT:"Jump over",VIGOR:"Energy",VIRAL:"Spreading",
  VITAL:"Essential",VIVID:"Bright and clear",VOCAL:"Out loud",VOWEL:"Open sound",
  WAGER:"Bet",WRATH:"Fierce anger",YACHT:"Sailing vessel",ZEBRA:"Striped animal",
  ZONES:"Areas",ZONAL:"By area",YOUNG:"Fresh and new",YIELD:"Give way",
};

// ---------------------------------------------------------------------------
// Build word pool: WORD_CLUES + FILL_CLUES (curated, real clues) PLUS system
// dictionary as extended fill pool. System dict provides the volume needed for
// the word-square constraint; curated words are always preferred by the solver.
// ---------------------------------------------------------------------------
process.stderr.write('Building word pool...\n');

// Quality filter for system dict words.
// 5-letter: ≥2 vowels, no 3+ consecutive consonants, no unusual starting clusters.
// 4-letter: ≥1 vowel, no 3+ consecutive consonants.
// 3-letter: ≥1 vowel.
const VOWELS = new Set(['A','E','I','O','U']);
const BAD_START_CLUSTERS = new Set(['PF','TZ','SZ','KN','GN','BH','DH','GH','PH','KH','CZ']);
function isUsableWord(w) {
  const len = w.length;
  let consRun = 0;
  let vowelCount = 0;
  for (const ch of w) {
    if (VOWELS.has(ch)) { vowelCount++; consRun = 0; }
    else { consRun++; if (consRun >= 3) return false; }
  }
  if (len >= 5 && vowelCount < 2) return false;
  if (len < 5 && vowelCount < 1) return false;
  // Filter unusual 2-letter starting clusters
  if (len >= 3 && BAD_START_CLUSTERS.has(w.slice(0, 2))) return false;
  return true;
}

const PRIMARY_WORDS = new Set(Object.keys(WORD_CLUES));
const ALL_CLUE_WORDS = new Set([...Object.keys(WORD_CLUES), ...Object.keys(FILL_CLUES)]);
const WORDS_BY_LEN = { 3: [], 4: [], 5: [] };

// Load curated words first (into pool)
for (const word of ALL_CLUE_WORDS) {
  const len = word.length;
  if (WORDS_BY_LEN[len] !== undefined) WORDS_BY_LEN[len].push(word);
}

// Load system dictionary as extended fill
try {
  const dictRaw = readFileSync('/usr/share/dict/words', 'utf8');
  let added = { 3: 0, 4: 0, 5: 0 };
  for (const line of dictRaw.split('\n')) {
    const w = line.trim().toUpperCase();
    if (w.length < 3 || w.length > 5) continue;
    if (!/^[A-Z]+$/.test(w)) continue;
    if (ALL_CLUE_WORDS.has(w)) continue; // already in pool
    if (!isUsableWord(w)) continue;
    WORDS_BY_LEN[w.length].push(w);
    added[w.length]++;
  }
  process.stderr.write(`  Dict added: 3=+${added[3]}, 4=+${added[4]}, 5=+${added[5]}\n`);
} catch (e) {
  process.stderr.write(`  No system dict: ${e.message}\n`);
}

process.stderr.write(`  Pool total: 3=${WORDS_BY_LEN[3].length}, 4=${WORDS_BY_LEN[4].length}, 5=${WORDS_BY_LEN[5].length}\n`);

// ---------------------------------------------------------------------------
// Letter-position index: wordIdx[len][pos][letter] = array of word strings
// ---------------------------------------------------------------------------
process.stderr.write('Building letter-position index...\n');
const wordIdx = {};
for (const len of [3, 4, 5]) {
  wordIdx[len] = [];
  for (let pos = 0; pos < len; pos++) {
    wordIdx[len][pos] = {};
    for (let c = 65; c <= 90; c++) {
      wordIdx[len][pos][String.fromCharCode(c)] = [];
    }
  }
  for (const word of WORDS_BY_LEN[len]) {
    for (let pos = 0; pos < len; pos++) {
      wordIdx[len][pos][word[pos]].push(word);
    }
  }
}
process.stderr.write('  Index built.\n');

// ---------------------------------------------------------------------------
// Clue generation
// ---------------------------------------------------------------------------
const clueRotation = {};

function getClue(word) {
  if (WORD_CLUES[word]) {
    const clues = Array.isArray(WORD_CLUES[word]) ? WORD_CLUES[word] : [WORD_CLUES[word]];
    const idx = (clueRotation[word] || 0) % clues.length;
    clueRotation[word] = (clueRotation[word] || 0) + 1;
    return clues[idx];
  }
  if (FILL_CLUES[word]) {
    return FILL_CLUES[word];
  }
  // Pattern-based clues for system dictionary words
  const w = word.toLowerCase();
  if (w.endsWith('ing') && word.length > 4) {
    const root = w.slice(0, -3);
    return `___ (ongoing action)`;
  }
  if (w.endsWith('ness') && word.length > 5) return `State of being`;
  if (w.endsWith('less') && word.length > 5) return `Without`;
  if (w.endsWith('ful') && word.length > 4) return `Full of`;
  if (w.endsWith('ish') && word.length > 4) return `Somewhat`;
  if (w.endsWith('ion') && word.length > 4) return `State or action`;
  if (w.endsWith('est') && word.length > 4) return `Most`;
  if (w.endsWith('ed') && word.length > 4) return `Past tense`;
  if (w.endsWith('er') && word.length > 4) return `Comparative`;
  if (w.endsWith('ly') && word.length > 4) return `In this way`;
  if (w.endsWith('al') && word.length > 4) return `Of or relating to`;
  if (w.startsWith('un') && word.length > 4) return `Not ___`;
  if (w.startsWith('re') && word.length > 4) return `Do again`;
  if (['tion','sion','ment','ence','ance'].some(s => w.endsWith(s))) return `Noun form`;
  // Fallback: use the word itself in a fill-in-the-blank style
  return `___ (dictionary word)`;
}

// ---------------------------------------------------------------------------
// Word reuse cooldown (same word allowed again after COOLDOWN puzzles)
// ---------------------------------------------------------------------------
const WORD_COOLDOWN = 14;
const lastUsedAt = {};

function wordAvailable(word, puzzleIdx) {
  return lastUsedAt[word] === undefined || puzzleIdx - lastUsedAt[word] >= WORD_COOLDOWN;
}
function markWordUsed(word, puzzleIdx) {
  lastUsedAt[word] = puzzleIdx;
}

// ---------------------------------------------------------------------------
// Grid helpers
// ---------------------------------------------------------------------------
function cellKey(r, c) { return r * 10 + c; }

function getConstraints(slot, grid) {
  const cons = {};
  for (let i = 0; i < slot.len; i++) {
    const r = slot.row + (slot.dir === 'D' ? i : 0);
    const c = slot.col + (slot.dir === 'A' ? i : 0);
    const v = grid[cellKey(r, c)];
    if (v !== undefined) cons[i] = v;
  }
  return cons;
}

function applyWord(slot, word, grid) {
  const g = Object.assign({}, grid);
  for (let i = 0; i < word.length; i++) {
    const r = slot.row + (slot.dir === 'D' ? i : 0);
    const c = slot.col + (slot.dir === 'A' ? i : 0);
    g[cellKey(r, c)] = word[i];
  }
  return g;
}

// ---------------------------------------------------------------------------
// Fast constraint matching using letter-position index
// ---------------------------------------------------------------------------
function getMatchingWords(len, cons, usedSet, puzzleIdx) {
  const conEntries = Object.entries(cons).map(([k, v]) => [+k, v]);

  if (conEntries.length === 0) {
    return WORDS_BY_LEN[len].filter(w => !usedSet.has(w) && wordAvailable(w, puzzleIdx));
  }

  // Sort by smallest set first for faster intersection
  conEntries.sort((a, b) => {
    const aLen = (wordIdx[len][a[0]][a[1]] || []).length;
    const bLen = (wordIdx[len][b[0]][b[1]] || []).length;
    return aLen - bLen;
  });

  const firstList = wordIdx[len][conEntries[0][0]][conEntries[0][1]] || [];
  if (firstList.length === 0) return [];

  let candidates = new Set(firstList);

  for (let i = 1; i < conEntries.length; i++) {
    const nextList = wordIdx[len][conEntries[i][0]][conEntries[i][1]] || [];
    if (nextList.length === 0) return [];
    const nextSet = new Set(nextList);
    for (const w of candidates) {
      if (!nextSet.has(w)) candidates.delete(w);
    }
    if (candidates.size === 0) return [];
  }

  return [...candidates].filter(w => !usedSet.has(w) && wordAvailable(w, puzzleIdx));
}

// ---------------------------------------------------------------------------
// Forward checking: verify all future slots still have >= 1 valid option
// ---------------------------------------------------------------------------
function forwardCheck(futureSlots, newGrid, usedSet, puzzleIdx) {
  for (const slot of futureSlots) {
    const cons = getConstraints(slot, newGrid);
    if (getMatchingWords(slot.len, cons, usedSet, puzzleIdx).length === 0) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Shuffle helper (seeded per attempt via closure over Math.random)
// ---------------------------------------------------------------------------
function shuffleArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------------------
// Pre-compute slot ordering for each template (greedy most-constrained-first)
// ---------------------------------------------------------------------------
function buildSlotOrder(slots) {
  const slotsWithCells = slots.map(s => {
    const cells = new Set();
    for (let i = 0; i < s.len; i++) {
      const r = s.row + (s.dir === 'D' ? i : 0);
      const c = s.col + (s.dir === 'A' ? i : 0);
      cells.add(r * 10 + c);
    }
    return { ...s, _cells: cells, _neighbors: new Set() };
  });

  for (let i = 0; i < slotsWithCells.length; i++) {
    for (let j = i + 1; j < slotsWithCells.length; j++) {
      for (const cell of slotsWithCells[i]._cells) {
        if (slotsWithCells[j]._cells.has(cell)) {
          slotsWithCells[i]._neighbors.add(j);
          slotsWithCells[j]._neighbors.add(i);
          break;
        }
      }
    }
  }

  const ordered = [];
  const placed = new Set();
  // Start with longest slot
  let startIdx = slotsWithCells.reduce((bi, s, i) => s.len > slotsWithCells[bi].len ? i : bi, 0);
  ordered.push(slotsWithCells[startIdx]);
  placed.add(startIdx);

  while (ordered.length < slotsWithCells.length) {
    let best = -1, bestScore = -1;
    for (let i = 0; i < slotsWithCells.length; i++) {
      if (placed.has(i)) continue;
      let score = 0;
      for (const ni of placed) {
        if (slotsWithCells[i]._neighbors.has(ni)) score++;
      }
      if (score > bestScore || (score === bestScore && best >= 0 && slotsWithCells[i].len > slotsWithCells[best].len)) {
        bestScore = score;
        best = i;
      }
    }
    ordered.push(slotsWithCells[best]);
    placed.add(best);
  }

  return ordered;
}

const templateOrders = {};
for (const [name, tmpl] of Object.entries(TEMPLATES)) {
  templateOrders[name] = buildSlotOrder(tmpl.slots);
}

// ---------------------------------------------------------------------------
// Fast solver: backtracking with forward checking + themed-word preference
// ---------------------------------------------------------------------------
const MAX_POOL_PER_SLOT = 60;
const MAX_RESTARTS_PER_PUZZLE = 300;
const PUZZLE_TIMEOUT_MS = 60000; // 60 seconds max per puzzle

let _puzzleDeadline = 0;

function solvePuzzle(orderedSlots, puzzleIdx) {
  function place(slotIdx, grid, usedInPuzzle, assignment) {
    if (Date.now() > _puzzleDeadline) return null;
    if (slotIdx === orderedSlots.length) return assignment;

    const slot = orderedSlots[slotIdx];
    const cons = getConstraints(slot, grid);
    const futureSlots = orderedSlots.slice(slotIdx + 1);

    // Tiered word selection: themed → curated fill → system dict
    let candidates = getMatchingWords(slot.len, cons, usedInPuzzle, puzzleIdx)
      .filter(w => PRIMARY_WORDS.has(w));

    if (candidates.length === 0) {
      candidates = getMatchingWords(slot.len, cons, usedInPuzzle, puzzleIdx)
        .filter(w => ALL_CLUE_WORDS.has(w));
    }

    if (candidates.length === 0) {
      candidates = getMatchingWords(slot.len, cons, usedInPuzzle, puzzleIdx);
    }

    // Shuffle for variety
    shuffleArr(candidates);
    const pool = candidates.slice(0, MAX_POOL_PER_SLOT);

    for (const word of pool) {
      const newGrid = applyWord(slot, word, grid);
      const newUsed = new Set(usedInPuzzle);
      newUsed.add(word);

      // Forward check: ensure all future slots still have valid options
      if (!forwardCheck(futureSlots, newGrid, newUsed, puzzleIdx)) {
        continue;
      }

      usedInPuzzle.add(word);
      assignment[slot.id] = word;
      const result = place(slotIdx + 1, newGrid, usedInPuzzle, assignment);
      if (result) return result;
      usedInPuzzle.delete(word);
      delete assignment[slot.id];
    }

    return null;
  }

  return place(0, {}, new Set(), {});
}

// ---------------------------------------------------------------------------
// Generate all 194 puzzles sequentially with cooldown tracking
// ---------------------------------------------------------------------------
process.stderr.write('Generating 194 puzzles sequentially...\n');

const TEMPLATE_CYCLE = ['A', 'B', 'C', 'D'];
const THEME_RANGES = [
  { end: 15,  theme: 'How They Met' },
  { end: 45,  theme: 'Long Distance Era' },
  { end: 76,  theme: 'Proposal Season' },
  { end: 106, theme: 'Engagement' },
  { end: 137, theme: 'Wedding Party' },
  { end: 168, theme: 'Countdown & Faith' },
  { end: 193, theme: 'Final Countdown' },
  { end: 194, theme: 'Wedding Day' },
];
function themeFor(i) {
  for (const r of THEME_RANGES) if (i < r.end) return r.theme;
  return 'Wedding Day';
}

const startDate = new Date('2026-03-17T00:00:00Z');
const puzzles = [];

for (let i = 0; i < 194; i++) {
  const tName = TEMPLATE_CYCLE[i % 4];
  const orderedSlots = templateOrders[tName];

  let assignment = null;
  _puzzleDeadline = Date.now() + PUZZLE_TIMEOUT_MS;

  for (let r = 0; r < MAX_RESTARTS_PER_PUZZLE && !assignment; r++) {
    if (Date.now() > _puzzleDeadline) break;
    assignment = solvePuzzle(orderedSlots, i);
  }

  // If primary template failed, try fallback templates
  if (!assignment) {
    for (const t2 of ['A','B','C','D'].filter(t => t !== tName)) {
      for (let r = 0; r < MAX_RESTARTS_PER_PUZZLE && !assignment; r++) {
        if (Date.now() > _puzzleDeadline) break;
        assignment = solvePuzzle(templateOrders[t2], i);
      }
      if (assignment) {
        process.stderr.write(`  Puzzle ${i+1}: used fallback template ${t2}\n`);
        break;
      }
    }
  }

  if (assignment) {
    for (const word of Object.values(assignment)) markWordUsed(word, i);
    puzzles.push({ tName, assignment });
  } else {
    process.stderr.write(`  WARNING: puzzle ${i+1} failed\n`);
    puzzles.push(null);
  }

  if ((i+1) % 25 === 0) process.stderr.write(`  Completed ${i+1}/194\n`);
}

const good = puzzles.filter(Boolean).length;
process.stderr.write(`Generated ${good}/194 puzzles\n`);

// ---------------------------------------------------------------------------
// TypeScript output
// ---------------------------------------------------------------------------
const lines = [];
lines.push(`// AUTO-GENERATED — ${good}/194 puzzles, 2026-03-17 to 2026-09-26`);
lines.push(`// Word reuse allowed after ${WORD_COOLDOWN}-puzzle cooldown.`);
lines.push(`const RAW_PUZZLES: RawPuzzleData[] = [`);

for (let i = 0; i < 194; i++) {
  const p = puzzles[i];
  const d = new Date(startDate);
  d.setUTCDate(d.getUTCDate() + i);
  const dateStr = d.toISOString().slice(0, 10);
  const id = `p${String(i+1).padStart(3,'0')}`;
  const theme = themeFor(i);
  const tName = TEMPLATE_CYCLE[i % 4];

  if (!p) {
    lines.push(`  // ${id} — ${dateStr} — MISSING`);
    continue;
  }

  lines.push(`  // ${id} — ${dateStr} — ${theme} — template ${tName}`);
  lines.push(`  { id: "${id}", rows: 5, cols: 5, words: [`);

  const tmpl = TEMPLATES[tName];
  for (const slot of tmpl.slots) {
    const word = p.assignment[slot.id];
    if (!word) continue;
    const clue = getClue(word);
    lines.push(`    { word: "${word}", clue: ${JSON.stringify(clue)}, row: ${slot.row}, col: ${slot.col}, dir: "${slot.dir}" },`);
  }

  lines.push(`  ] },`);
}

lines.push(`];`);
process.stdout.write(lines.join('\n') + '\n');
process.stderr.write('Done!\n');
