const wordList = [
  // --- 第1组 ---
  {
    word: "ambivalent",
    phonetic: "[æmˈbɪvələnt]",
    enDefinition: "Having mixed feelings or contradictory ideas about something or someone.",
    zhDefinition: "adj. 矛盾的；犹豫不决的",
    example: "He has an ambivalent attitude towards his job; he loves the pay but hates the hours.",
    category: "考研高频"
  },
  {
    word: "capricious",
    phonetic: "[kəˈprɪʃəs]",
    enDefinition: "Given to sudden and unaccountable changes of mood or behavior.",
    zhDefinition: "adj. 反复无常的；任性的",
    example: "The court ruled that the government's decision was arbitrary and capricious.",
    category: "考研高频"
  },
  {
    word: "ephemeral",
    phonetic: "[ɪˈfemərəl]",
    enDefinition: "Lasting for a very short time.",
    zhDefinition: "adj. 短暂的；转瞬即逝的",
    example: "Fame in the world of pop music is often ephemeral.",
    category: "考研高频"
  },
  {
    word: "mitigate",
    phonetic: "[ˈmɪtɪɡeɪt]",
    enDefinition: "Make less severe, serious, or painful.",
    zhDefinition: "v. 减轻；缓和",
    example: "Drainage schemes have helped to mitigate the effects of floods.",
    category: "考研高频"
  },
  {
    word: "obdurate",
    phonetic: "[ˈɒbdjərət]",
    enDefinition: "Stubbornly refusing to change one's opinion or course of action.",
    zhDefinition: "adj. 固执的；顽固不化的",
    example: "The president remained obdurate on the question of tax cuts.",
    category: "考研高频"
  },
  {
    word: "pragmatic",
    phonetic: "[præɡˈmætɪk]",
    enDefinition: "Dealing with things sensibly and realistically in a way that is based on practical considerations.",
    zhDefinition: "adj. 务实的；实际的",
    example: "We need to adopt a pragmatic approach to this problem.",
    category: "考研高频"
  },
  {
    word: "reticent",
    phonetic: "[ˈretɪsnt]",
    enDefinition: "Not revealing one's thoughts or feelings readily.",
    zhDefinition: "adj. 沉默寡言的；含蓄的",
    example: "She was extremely reticent about her personal affairs.",
    category: "考研高频"
  },
  {
    word: "ubiquitous",
    phonetic: "[juːˈbɪkwɪtəs]",
    enDefinition: "Present, appearing, or found everywhere.",
    zhDefinition: "adj. 普遍存在的；无处不在的",
    example: "Coffee shops are ubiquitous in the downtown area.",
    category: "考研高频"
  },
  {
    word: "venerate",
    phonetic: "[ˈvenəreɪt]",
    enDefinition: "Regard with great respect; revere.",
    zhDefinition: "v. 崇敬；敬仰",
    example: "The monk was venerated by the local community as a saint.",
    category: "考研高频"
  },
  {
    word: "alacrity",
    phonetic: "[əˈlækrəti]",
    enDefinition: "Brisk and cheerful readiness.",
    zhDefinition: "n. 敏捷；欣然；乐意",
    example: "She accepted the invitation with alacrity.",
    category: "考研高频"
  },

  // --- 第2组 ---
  {
    word: "deleterious",
    phonetic: "[ˌdelɪˈtɪəriəs]",
    enDefinition: "Causing harm or damage.",
    zhDefinition: "adj. 有害的；有毒的",
    example: "The chemical has deleterious effects on the environment.",
    category: "考研高频"
  },
  {
    word: "enervate",
    phonetic: "[ˈenəveɪt]",
    enDefinition: "Cause (someone) to feel drained of energy or vitality; weaken.",
    zhDefinition: "v. 使衰弱；使失去活力",
    example: "The hot sun enervated the travelers.",
    category: "考研高频"
  },
  {
    word: "fastidious",
    phonetic: "[fæˈstɪdiəs]",
    enDefinition: "Very attentive to and concerned about accuracy and detail.",
    zhDefinition: "adj. 挑剔的；追求完美的",
    example: "Everything was planned with fastidious attention to detail.",
    category: "考研高频"
  },
  {
    word: "garrulous",
    phonetic: "[ˈɡærələs]",
    enDefinition: "Excessively talkative, especially on trivial matters.",
    zhDefinition: "adj. 喋喋不休的；饶舌的",
    example: "He became more garrulous after drinking a few glasses of wine.",
    category: "考研高频"
  },
  {
    word: "haughty",
    phonetic: "[ˈhɔːti]",
    enDefinition: "Arrogantly superior and disdainful.",
    zhDefinition: "adj. 傲慢的；自大的",
    example: "She threw him a haughty look and walked away.",
    category: "考研高频"
  },
  {
    word: "implacable",
    phonetic: "[ɪmˈplækəbl]",
    enDefinition: "Unable to be placated or appeased; relentless.",
    zhDefinition: "adj. 难和解的；坚决的",
    example: "The two families were engaged in an implacable feud.",
    category: "考研高频"
  },
  {
    word: "juxtapose",
    phonetic: "[ˌdʒʌkstəˈpəʊz]",
    enDefinition: "Place or deal with close together for contrasting effect.",
    zhDefinition: "v. 并列；并置",
    example: "The exhibit juxtaposes modern art with classical sculpture.",
    category: "考研高频"
  },
  {
    word: "loquacious",
    phonetic: "[ləˈkweɪʃəs]",
    enDefinition: "Tending to talk a great deal; talkative.",
    zhDefinition: "adj. 话多的；健谈的",
    example: "The loquacious host kept the party lively.",
    category: "考研高频"
  },
  {
    word: "meticulous",
    phonetic: "[məˈtɪkjələs]",
    enDefinition: "Showing great attention to detail; very careful and precise.",
    zhDefinition: "adj. 一丝不苟的；极其细致的",
    example: "He was meticulous in his preparation for the exam.",
    category: "考研高频"
  },
  {
    word: "nefarious",
    phonetic: "[nɪˈfeəriəs]",
    enDefinition: "(Typically of an action or activity) wicked or criminal.",
    zhDefinition: "adj. 邪恶的；穷凶极恶的",
    example: "The company was accused of nefarious activities to undermine its rivals.",
    category: "考研高频"
  },

  // --- 第3组 ---
  {
    word: "opulent",
    phonetic: "[ˈɒpjələnt]",
    enDefinition: "Ostentatiously rich and luxurious or lavish.",
    zhDefinition: "adj. 豪华的；富裕的",
    example: "The hotel lobby was opulent, with gold-plated fixtures everywhere.",
    category: "考研高频"
  },
  {
    word: "pernicious",
    phonetic: "[pəˈnɪʃəs]",
    enDefinition: "Having a harmful effect, especially in a gradual or subtle way.",
    zhDefinition: "adj. 有害的；恶性的（尤指隐蔽的）",
    example: "Social media can have a pernicious influence on young children.",
    category: "考研高频"
  },
  {
    word: "querulous",
    phonetic: "[ˈkwerələs]",
    enDefinition: "Complaining in a petulant or whining manner.",
    zhDefinition: "adj. 抱怨的；爱发牢骚的",
    example: "The querulous patient was never satisfied with the hospital food.",
    category: "考研高频"
  },
  {
    word: "rancor",
    phonetic: "[ˈræŋkə(r)]",
    enDefinition: "Bitterness or resentfulness, especially when long-standing.",
    zhDefinition: "n. 怨恨；敌意",
    example: "They parted without rancor despite their differences.",
    category: "考研高频"
  },
  {
    word: "sagacious",
    phonetic: "[səˈɡeɪʃəs]",
    enDefinition: "Having or showing keen mental discernment and good judgment; shrewd.",
    zhDefinition: "adj. 睿智的；聪敏的",
    example: "The sagacious leader anticipated the crisis before it occurred.",
    category: "考研高频"
  },
  {
    word: "transient",
    phonetic: "[ˈtrænziənt]",
    enDefinition: "Lasting only for a short time; impermanent.",
    zhDefinition: "adj. 短暂的；路过的",
    example: "The storm was transient, and the sun soon came out.",
    category: "考研高频"
  },
  {
    word: "upbraid",
    phonetic: "[ʌpˈbreɪd]",
    enDefinition: "Find fault with (someone); scold.",
    zhDefinition: "v. 训斥；责骂",
    example: "He was upbraided by his manager for being late.",
    category: "考研高频"
  },
  {
    word: "vacillate",
    phonetic: "[ˈvæsəleɪt]",
    enDefinition: "Alternate or waver between different opinions or actions; be indecisive.",
    zhDefinition: "v. 犹豫；动摇",
    example: "She vacillated between going to law school or medical school.",
    category: "考研高频"
  },
  {
    word: "wary",
    phonetic: "[ˈweəri]",
    enDefinition: "Feeling or showing caution about possible dangers or problems.",
    zhDefinition: "adj. 警惕的；谨慎的",
    example: "Be wary of strangers offering too-good-to-be-true deals.",
    category: "考研高频"
  },
  {
    word: "zealot",
    phonetic: "[ˈzelət]",
    enDefinition: "A person who is fanatical and uncompromising in pursuit of their religious, political, or other ideals.",
    zhDefinition: "n. 狂热者；盲信者",
    example: "He was a political zealot who would not listen to any opposing views.",
    category: "考研高频"
  },

  // --- 第4组 ---
  {
    word: "acerbic",
    phonetic: "[əˈsɜːbɪk]",
    enDefinition: "(Especially of a comment or style of speaking) sharp and forthright.",
    zhDefinition: "adj. 尖刻的；辛辣的",
    example: "The critic’s acerbic wit made his reviews very popular.",
    category: "考研高频"
  },
  {
    word: "burgeon",
    phonetic: "[ˈbɜːdʒən]",
    enDefinition: "Begin to grow or increase rapidly; flourish.",
    zhDefinition: "v. 迅速发展；激增",
    example: "The town's population burgeoned after the new factory opened.",
    category: "考研高频"
  },
  {
    word: "castigate",
    phonetic: "[ˈkæstɪɡeɪt]",
    enDefinition: "Reprimand (someone) severely.",
    zhDefinition: "v. 严厉批评；惩罚",
    example: "The director was castigated by the press for his controversial film.",
    category: "考研高频"
  },
  {
    word: "demur",
    phonetic: "[dɪˈmɜː(r)]",
    enDefinition: "Raise doubts or objections or show reluctance.",
    zhDefinition: "v. 表示异议；反对",
    example: "Most of the committee agreed, but a few members demurred.",
    category: "考研高频"
  },
  {
    word: "erudite",
    phonetic: "[ˈerudaɪt]",
    enDefinition: "Having or showing great knowledge or learning.",
    zhDefinition: "adj. 博学的；渊博的",
    example: "The professor delivered an erudite lecture on ancient history.",
    category: "考研高频"
  },
  {
    word: "fervid",
    phonetic: "[ˈfɜːvɪd]",
    enDefinition: "Intensely enthusiastic or passionate, especially to an excessive degree.",
    zhDefinition: "adj. 热烈的；炽热的",
    example: "The fans showed a fervid devotion to their team.",
    category: "考研高频"
  },
  {
    word: "glib",
    phonetic: "[ɡlɪb]",
    enDefinition: "(Of words or the person speaking them) fluent and voluble but insincere and shallow.",
    zhDefinition: "adj. 油腔滑调的；轻率的",
    example: "He had a glib answer for every difficult question.",
    category: "考研高频"
  },
  {
    word: "hubris",
    phonetic: "[ˈhjuːbrɪs]",
    enDefinition: "Excessive pride or self-confidence.",
    zhDefinition: "n. 傲慢；狂妄自大",
    example: "His hubris eventually led to his downfall in the company.",
    category: "考研高频"
  },
  {
    word: "inimical",
    phonetic: "[ɪˈnɪmɪkl]",
    enDefinition: "Tending to obstruct or harm; unfriendly.",
    zhDefinition: "adj. 有害的；敌对的",
    example: "Excessive bureaucracy is inimical to economic growth.",
    category: "考研高频"
  },
  {
    word: "judicious",
    phonetic: "[dʒuˈdɪʃəs]",
    enDefinition: "Having, showing, or done with good judgment or sense.",
    zhDefinition: "adj. 明智的；审慎的",
    example: "The judicious use of resources saved the project from failure.",
    category: "考研高频"
  },

  // --- 第5组 ---
  {
    word: "knell",
    phonetic: "[nel]",
    enDefinition: "The sound of a bell, especially when rung solemnly for a death or funeral.",
    zhDefinition: "n. 丧钟声；(引申为) 终结的信号",
    example: "The decision sounded the death knell for the local coal industry.",
    category: "考研高频"
  },
  {
    word: "lucid",
    phonetic: "[ˈluːsɪd]",
    enDefinition: "Expressed clearly; easy to understand.",
    zhDefinition: "adj. 清晰的；易懂的",
    example: "She gave a lucid explanation of a very complex theory.",
    category: "考研高频"
  },
  {
    word: "modicum",
    phonetic: "[ˈmɒdɪkəm]",
    enDefinition: "A small quantity of a particular thing, especially something considered desirable or valuable.",
    zhDefinition: "n. 少量；一点点",
    example: "He finally showed a modicum of common sense.",
    category: "考研高频"
  },
  {
    word: "nuance",
    phonetic: "[ˈnjuːɑːns]",
    enDefinition: "A subtle difference in or shade of meaning, expression, or sound.",
    zhDefinition: "n. 细微差别",
    example: "A professional translator must capture every nuance of the original text.",
    category: "考研高频"
  },
  {
    word: "opaque",
    phonetic: "[əʊˈpeɪk]",
    enDefinition: "Not able to be seen through; not transparent.",
    zhDefinition: "adj. 不透明的；难懂的",
    example: "The technical jargon made the report completely opaque to me.",
    category: "考研高频"
  },
  {
    word: "pejorative",
    phonetic: "[pɪˈdʒɒrətɪv]",
    enDefinition: "Expressing contempt or disapproval.",
    zhDefinition: "adj. 贬义的；轻蔑的",
    example: "The word 'nerd' is often used in a pejorative sense.",
    category: "考研高频"
  },
  {
    word: "quagmire",
    phonetic: "[ˈkwæɡmaɪə(r)]",
    enDefinition: "An awkward, complex, or hazardous situation.",
    zhDefinition: "n. 困境；泥潭",
    example: "The legal dispute has become a quagmire for both companies.",
    category: "考研高频"
  },
  {
    word: "redolent",
    phonetic: "[ˈredələnt]",
    enDefinition: "Strongly reminiscent or suggestive of (something).",
    zhDefinition: "adj. 令人想起的；有...香味的",
    example: "The old house was redolent of memories of his childhood.",
    category: "考研高频"
  },
  {
    word: "sycophant",
    phonetic: "[ˈsɪkəfænt]",
    enDefinition: "A person who acts obsequiously toward someone important in order to gain advantage.",
    zhDefinition: "n. 谄媚者；拍马屁的人",
    example: "The CEO was surrounded by sycophants who never disagreed with him.",
    category: "考研高频"
  },
  {
    word: "torpor",
    phonetic: "[ˈtɔːpə(r)]",
    enDefinition: "A state of physical or mental inactivity; lethargy.",
    zhDefinition: "n. 麻木；迟钝；无活力",
    example: "After the heavy meal, we fell into a state of pleasant torpor.",
    category: "考研高频"
  },

  // --- 第6组 ---
  {
    word: "vanguard",
    phonetic: "[ˈvænɡɑːd]",
    enDefinition: "A group of people leading the way in new developments or ideas.",
    zhDefinition: "n. 前锋；先驱",
    example: "They are in the vanguard of research into genetic engineering.",
    category: "考研高频"
  },
  {
    word: "waive",
    phonetic: "[weɪv]",
    enDefinition: "Refrain from insisting on or using (a right or claim).",
    zhDefinition: "v. 放弃(权利、要求)；免除",
    example: "The university decided to waive the tuition fees for students in need.",
    category: "考研高频"
  },
  {
    word: "xenophobia",
    phonetic: "[ˌzenəˈfəʊbiə]",
    enDefinition: "Dislike of or prejudice against people from other countries.",
    zhDefinition: "n. 仇外；排外",
    example: "Economic hardship often leads to a rise in xenophobia.",
    category: "考研高频"
  },
  {
    word: "yoke",
    phonetic: "[jəʊk]",
    enDefinition: "A thing that causes hardship or misery; a burden.",
    zhDefinition: "n. 束缚；枷锁",
    example: "The country finally threw off the yoke of colonial rule.",
    category: "考研高频"
  },
  {
    word: "zenith",
    phonetic: "[ˈzenɪθ]",
    enDefinition: "The time at which something is most powerful or successful.",
    zhDefinition: "n. 顶峰；顶点",
    example: "The Roman Empire reached its zenith in the second century AD.",
    category: "考研高频"
  },
  {
    word: "aesthetic",
    phonetic: "[iːsˈθetɪk]",
    enDefinition: "Concerned with beauty or the appreciation of beauty.",
    zhDefinition: "adj. 美学的；审美的",
    example: "The building has little aesthetic appeal but is very functional.",
    category: "考研高频"
  },
  {
    word: "belie",
    phonetic: "[bɪˈlaɪ]",
    enDefinition: "Fail to give a true notion or impression of (something); disguise.",
    zhDefinition: "v. 掩饰；证明...为假",
    example: "His energetic appearance belies his eighty years.",
    category: "考研高频"
  },
  {
    word: "cogent",
    phonetic: "[ˈkəʊdʒənt]",
    enDefinition: "(Of an argument or case) clear, logical, and convincing.",
    zhDefinition: "adj. 有说服力的；切中要害的",
    example: "She presented a cogent argument for changing the company policy.",
    category: "考研高频"
  },
  {
    word: "diatribe",
    phonetic: "[ˈdaɪətraɪb]",
    enDefinition: "A forceful and bitter verbal attack against someone or something.",
    zhDefinition: "n. 抨击；谩骂",
    example: "The speaker launched into a diatribe against the government.",
    category: "考研高频"
  },
  {
    word: "equivocate",
    phonetic: "[ɪˈkwɪvəkeɪt]",
    enDefinition: "Use ambiguous language so as to conceal the truth or avoid committing oneself.",
    zhDefinition: "v. 含糊其辞；说模棱两可的话",
    example: "The politician continued to equivocate when asked about tax hikes.",
    category: "考研高频"
  },

  // --- 第7组 ---
  {
    word: "facetious",
    phonetic: "[fəˈsiːʃəs]",
    enDefinition: "Treating serious issues with deliberately inappropriate humor.",
    zhDefinition: "adj. (在不适当场合)乱开玩笑的；滑稽的",
    example: "Stop being facetious; this is a serious matter.",
    category: "考研高频"
  },
  {
    word: "gregarious",
    phonetic: "[ɡrɪˈɡeəriəs]",
    enDefinition: "(Of a person) fond of company; sociable.",
    zhDefinition: "adj. 爱交际的；群居的",
    example: "She is such a gregarious person that she has friends everywhere.",
    category: "考研高频"
  },
  {
    word: "harangue",
    phonetic: "[həˈræŋ]",
    enDefinition: "A lengthy and aggressive speech.",
    zhDefinition: "n. 高声训斥；长篇大论的演讲",
    example: "The protesters were subjected to a harangue by the police officer.",
    category: "考研高频"
  },
  {
    word: "iconoclast",
    phonetic: "[aɪˈkɒnəklæst]",
    enDefinition: "A person who attacks cherished beliefs or institutions.",
    zhDefinition: "n. 打破旧习者；反传统者",
    example: "The director is an iconoclast who challenges every cinematic convention.",
    category: "考研高频"
  },
  {
    word: "jaded",
    phonetic: "[ˈdʒeɪdɪd]",
    enDefinition: "Tired, bored, or lacking enthusiasm, typically after having had too much of something.",
    zhDefinition: "adj. 厌倦的；精疲力竭的",
    example: "The public is becoming jaded with the constant negative news.",
    category: "考研高频"
  },
  {
    word: "kindle",
    phonetic: "[ˈkɪndl]",
    enDefinition: "Arouse or inspire (an emotion or feeling).",
    zhDefinition: "v. 点燃；激起",
    example: "Her father's stories kindled her interest in history.",
    category: "考研高频"
  },
  {
    word: "latent",
    phonetic: "[ˈleɪtənt]",
    enDefinition: "Existing but not yet developed or manifest; hidden or concealed.",
    zhDefinition: "adj. 潜在的；潜伏的",
    example: "We hope to discover the latent talents of our students.",
    category: "考研高频"
  },
  {
    word: "maverick",
    phonetic: "[ˈmævərɪk]",
    enDefinition: "An unorthodox or independent-minded person.",
    zhDefinition: "n. 特立独行的人",
    example: "In politics, he was a maverick who refused to follow the party line.",
    category: "考研高频"
  },
  {
    word: "nascent",
    phonetic: "[ˈnæsnt]",
    enDefinition: "Just coming into existence and beginning to display signs of future potential.",
    zhDefinition: "adj. 初生的；萌芽的",
    example: "The nascent space tourism industry faces many challenges.",
    category: "考研高频"
  },
  {
    word: "obviate",
    phonetic: "[ˈɒbvieɪt]",
    enDefinition: "Remove (a need or difficulty).",
    zhDefinition: "v. 排除；消除(困难、必要性)",
    example: "The new automation system will obviate the need for manual checks.",
    category: "考研高频"
  },

  // --- 第8组 ---
  {
    word: "paradigm",
    phonetic: "[ˈpærədaɪm]",
    enDefinition: "A typical example or pattern of something; a model.",
    zhDefinition: "n. 范式；典范",
    example: "The discovery caused a shift in the scientific paradigm.",
    category: "考研高频"
  },
  {
    word: "qualitative",
    phonetic: "[ˈkwɒlɪtətɪv]",
    enDefinition: "Relating to, measuring, or measured by the quality of something rather than its quantity.",
    zhDefinition: "adj. 定性的；性质上的",
    example: "We need more qualitative research to understand customer behavior.",
    category: "考研高频"
  },
  {
    word: "recalcitrant",
    phonetic: "[rɪˈkælsɪtrənt]",
    enDefinition: "Having an obstinately uncooperative attitude toward authority or discipline.",
    zhDefinition: "adj. 顽抗的；不驯服的",
    example: "The recalcitrant child refused to follow the teacher's instructions.",
    category: "考研高频"
  },
  {
    word: "salient",
    phonetic: "[ˈseɪliənt]",
    enDefinition: "Most noticeable or important.",
    zhDefinition: "adj. 显著的；主要的",
    example: "He summarized the salient points of the report in five minutes.",
    category: "考研高频"
  },
  {
    word: "terse",
    phonetic: "[tɜːs]",
    enDefinition: "Sparing in the use of words; abrupt.",
    zhDefinition: "adj. 简练的；扼要的",
    example: "She gave a terse reply that made it clear she was angry.",
    category: "考研高频"
  },
  {
    word: "unscrupulous",
    phonetic: "[ʌnˈskruːpjələs]",
    enDefinition: "Having or showing no moral principles; not honest or fair.",
    zhDefinition: "adj. 肆无忌惮的；不道德的",
    example: "Unscrupulous businessmen were taking advantage of the poor.",
    category: "考研高频"
  },
  {
    word: "vacuous",
    phonetic: "[ˈvækjuəs]",
    enDefinition: "Having or showing a lack of thought or intelligence; mindless.",
    zhDefinition: "adj. 空洞的；无意义的",
    example: "The movie was criticized for its vacuous plot and flat characters.",
    category: "考研高频"
  },
  {
    word: "warranted",
    phonetic: "[ˈwɒrəntɪd]",
    enDefinition: "Justified or necessitated (a certain course of action).",
    zhDefinition: "adj. 保证的；正当的",
    example: "The police believed that a further search was warranted.",
    category: "考研高频"
  },
  {
    word: "aberration",
    phonetic: "[ˌæbəˈreɪʃn]",
    enDefinition: "A departure from what is normal, usual, or expected, typically one that is unwelcome.",
    zhDefinition: "n. 反常现象；异常",
    example: "The sudden drop in stock prices was an aberration in an otherwise stable market.",
    category: "考研高频"
  },
  {
    word: "benevolent",
    phonetic: "[bəˈnevələnt]",
    enDefinition: "Well meaning and kindly.",
    zhDefinition: "adj. 仁慈的；慈善的",
    example: "A benevolent donor provided the funds for the new library.",
    category: "考研高频"
  },

  // --- 第9组 ---
  {
    word: "candid",
    phonetic: "[ˈkændɪd]",
    enDefinition: "Truthful and straightforward; frank.",
    zhDefinition: "adj. 坦率的；公正的",
    example: "I appreciate your candid opinion on this matter.",
    category: "考研高频"
  },
  {
    word: "deference",
    phonetic: "[ˈdefərəns]",
    enDefinition: "Humble submission and respect.",
    zhDefinition: "n. 尊重；顺从",
    example: "Out of deference to his age, we let him speak first.",
    category: "考研高频"
  },
  {
    word: "elated",
    phonetic: "[ɪˈleɪtɪd]",
    enDefinition: "Make (someone) ecstatically happy.",
    zhDefinition: "adj. 兴高采烈的；大喜的",
    example: "She was elated when she found out she had won the scholarship.",
    category: "考研高频"
  },
  {
    word: "fabricate",
    phonetic: "[ˈfæbrɪkeɪt]",
    enDefinition: "Invent or concoct (something), typically with deceitful intent.",
    zhDefinition: "v. 捏造；伪造",
    example: "He was accused of fabricating evidence in the trial.",
    category: "考研高频"
  },
  {
    word: "guile",
    phonetic: "[ɡaɪl]",
    enDefinition: "Sly or cunning intelligence.",
    zhDefinition: "n. 狡诈；诡计",
    example: "The politician used all his guile to win the election.",
    category: "考研高频"
  },
  {
    word: "hegemony",
    phonetic: "[hɪˈɡeməni]",
    enDefinition: "Leadership or dominance, especially by one country or social group over others.",
    zhDefinition: "n. 霸权；领导权",
    example: "The country struggled to maintain its hegemony over the region.",
    category: "考研高频"
  },
  {
    word: "jocular",
    phonetic: "[ˈdʒɒkjələ(r)]",
    enDefinition: "Fond of or characterized by joking; humorous or playful.",
    zhDefinition: "adj. 爱开玩笑的；滑稽的",
    example: "He was in a jocular mood after the successful meeting.",
    category: "考研高频"
  },
  {
    word: "kudos",
    phonetic: "[ˈkjuːdɒs]",
    enDefinition: "Praise and honor received for an achievement.",
    zhDefinition: "n. 荣誉；赞扬",
    example: "Kudos to everyone who helped organize this event.",
    category: "考研高频"
  },
  {
    word: "lethargic",
    phonetic: "[ləˈθɑːdʒɪk]",
    enDefinition: "Affected by lethargy; sluggish and apathetic.",
    zhDefinition: "adj. 没精打采的；昏昏欲睡的",
    example: "The hot weather made everyone feel lethargic.",
    category: "考研高频"
  },
  {
    word: "magnanimous",
    phonetic: "[mæɡˈnænɪməs]",
    enDefinition: "Generous or forgiving, especially toward a rival or less powerful person.",
    zhDefinition: "adj. 宽宏大量的；大度的",
    example: "She was magnanimous in victory, praising her opponent's efforts.",
    category: "考研高频"
  },

  // --- 第10组 ---
  {
    word: "nominal",
    phonetic: "[ˈnɒmɪnl]",
    enDefinition: "(Of a price or amount of money) very small; far below the real value or cost.",
    zhDefinition: "adj. 名义上的；微不足道的",
    example: "We only charge a nominal fee for our services.",
    category: "考研高频"
  },
  {
    word: "obsequious",
    phonetic: "[əbˈsiːkwiəs]",
    enDefinition: "Obedient or attentive to an excessive or servile degree.",
    zhDefinition: "adj. 谄媚的；卑躬屈膝的",
    example: "The waiter was almost embarrassingly obsequious.",
    category: "考研高频"
  },
  {
    word: "palliate",
    phonetic: "[ˈpælieɪt]",
    enDefinition: "Make (a disease or its symptoms) less severe or unpleasant without removing the cause.",
    zhDefinition: "v. 缓和；减轻(痛苦等)",
    example: "These measures will palliate the symptoms but not cure the disease.",
    category: "考研高频"
  },
  {
    word: "quixotic",
    phonetic: "[kwɪkˈsɒtɪk]",
    enDefinition: "Exceedingly idealistic; unrealistic and impractical.",
    zhDefinition: "adj. 唐吉诃德式的；不切实际的",
    example: "Trying to solve world hunger in a week is a quixotic goal.",
    category: "考研高频"
  },
  {
    word: "recluse",
    phonetic: "[rɪˈkluːs]",
    enDefinition: "A person who lives a solitary life and tends to avoid other people.",
    zhDefinition: "n. 隐士；隐居者",
    example: "After his wife died, he became a bit of a recluse.",
    category: "考研高频"
  },
  {
    word: "spurious",
    phonetic: "[ˈspjʊəriəs]",
    enDefinition: "Not being what it purports to be; false or fake.",
    zhDefinition: "adj. 虚假的；伪造的",
    example: "The court rejected the spurious claims made by the witness.",
    category: "考研高频"
  },
  {
    word: "tenuous",
    phonetic: "[ˈtenjuəs]",
    enDefinition: "Very weak or slight.",
    zhDefinition: "adj. 脆弱的；细微的",
    example: "The link between the two crimes is tenuous at best.",
    category: "考研高频"
  },
  {
    word: "viable",
    phonetic: "[ˈvaɪəbl]",
    enDefinition: "Capable of working successfully; feasible.",
    zhDefinition: "adj. 可行的；能活下去的",
    example: "The committee is looking for a viable solution to the parking problem.",
    category: "考研高频"
  },
  {
    word: "whimsical",
    phonetic: "[ˈwɪmzɪkl]",
    enDefinition: "Playfully quaint or fanciful, especially in an appealing and amusing way.",
    zhDefinition: "adj. 异想天开的；古怪的",
    example: "The designer is known for her whimsical and colorful patterns.",
    category: "考研高频"
  },
  {
    word: "anachronistic",
    phonetic: "[əˌnækrəˈnɪstɪk]",
    enDefinition: "Belonging to a period other than that being portrayed.",
    zhDefinition: "adj. 时代错误的；落伍的",
    example: "Using a typewriter today seems somewhat anachronistic.",
    category: "考研高频"
  },

   {
    word: "admonish",
    phonetic: "[ədˈmɒnɪʃ]",
    enDefinition: "Warn or reprimand someone firmly.",
    zhDefinition: "v. 告诫；训诫；警告",
    example: "The teacher admonished the students for their lack of preparation.",
    category: "考研高频"
  },
  {
    word: "blandishment",
    phonetic: "[ˈblændɪʃmənt]",
    enDefinition: "A flattering or pleasing statement or action used to persuade someone gently to do something.",
    zhDefinition: "n. 奉承；诱惑；甜言蜜语",
    example: "Despite her blandishments, he refused to change his mind.",
    category: "考研高频"
  },
  {
    word: "circumspect",
    phonetic: "[ˈsɜːkəmspckt]",
    enDefinition: "Wary and unwilling to take risks.",
    zhDefinition: "adj. 谨慎的；深思熟虑的",
    example: "The officials were very circumspect in their statements to the press.",
    category: "考研高频"
  },
  {
    word: "disparate",
    phonetic: "[ˈdɪspərət]",
    enDefinition: "Essentially different in kind; not allowing comparison.",
    zhDefinition: "adj. 迥然不同的；多元的",
    example: "The two cultures are so disparate that they have little in common.",
    category: "考研高频"
  },
  {
    word: "exacerbate",
    phonetic: "[ɪɡˈzæsəbeɪt]",
    enDefinition: "Make (a problem, bad situation, or negative feeling) worse.",
    zhDefinition: "v. 使加剧；使恶化",
    example: "The new tax policy only served to exacerbate the economic crisis.",
    category: "考研高频"
  },
  {
    word: "fortuitous",
    phonetic: "[fɔːˈtjuːɪtəs]",
    enDefinition: "Happening by accident or chance rather than design.",
    zhDefinition: "adj. 偶然的；意外的（通常指幸运的）",
    example: "Their meeting was purely fortuitous, but it led to a great partnership.",
    category: "考研高频"
  },
  {
    word: "grandiose",
    phonetic: "[ˈɡrændiəʊs]",
    enDefinition: "Impressive or magnificent in appearance or style, especially pretentiously so.",
    zhDefinition: "adj. 宏伟的；浮夸的；夸大的",
    example: "He had grandiose plans for a new city, but lacked the funding.",
    category: "考研高频"
  },
  {
    word: "incisive",
    phonetic: "[ɪnˈsaɪsɪv]",
    enDefinition: "(Of a person or mental process) intelligently analytical and clear-thinking.",
    zhDefinition: "adj. 尖锐的；深刻的；果断的",
    example: "The journalist's incisive questions forced the politician to tell the truth.",
    category: "考研高频"
  },
  {
    word: "languid",
    phonetic: "[ˈlæŋɡwɪd]",
    enDefinition: "(Of a person, manner, or gesture) displaying or having a disinclination for physical exertion or effort; slow and relaxed.",
    zhDefinition: "adj. 倦怠的；无精打采的",
    example: "They spent a languid afternoon by the pool, enjoying the heat.",
    category: "考研高频"
  },
  {
    word: "mendacious",
    phonetic: "[menˈdeɪʃəs]",
    enDefinition: "Not telling the truth; lying.",
    zhDefinition: "adj. 虚假的；撒谎的",
    example: "The mendacious advertisements misled many innocent customers.",
    category: "考研高频"
  },

  // --- 第12组 ---
  {
    word: "nebulous",
    phonetic: "[ˈnebjələs]",
    enDefinition: "(Of a concept or idea) unclear, vague, or ill-defined.",
    zhDefinition: "adj. 模糊的；云雾状的",
    example: "She has a nebulous idea of what she wants to do after graduation.",
    category: "考研高频"
  },
  {
    word: "ornate",
    phonetic: "[ɔːˈneɪt]",
    enDefinition: "Made in an intricate shape or decorated with complex patterns.",
    zhDefinition: "adj. 华丽的；装饰复杂的",
    example: "The ceiling of the cathedral was covered in ornate carvings.",
    category: "考研高频"
  },
  {
    word: "paucity",
    phonetic: "[ˈpɔːsəti]",
    enDefinition: "The presence of something only in small or insufficient quantities or amounts; scarcity.",
    zhDefinition: "n. 少量；缺乏",
    example: "There is a paucity of evidence to support his theory.",
    category: "考研高频"
  },
  {
    word: "relegate",
    phonetic: "[ˈrelɪɡeɪt]",
    enDefinition: "Consign or dismiss to an inferior rank or position.",
    zhDefinition: "v. 降级；贬低；流放",
    example: "Women were often relegated to secondary roles in the industry.",
    category: "考研高频"
  },
  {
    word: "scrutinize",
    phonetic: "[ˈskruːtənaɪz]",
    enDefinition: "Examine or inspect closely and thoroughly.",
    zhDefinition: "v. 仔细检查；彻查",
    example: "Customers were warned to scrutinize the small print of the contract.",
    category: "考研高频"
  },
  {
    word: "tenacious",
    phonetic: "[təˈneɪʃəs]",
    enDefinition: "Tending to keep a firm hold of something; clinging or adhering closely.",
    zhDefinition: "adj. 顽强的；坚韧的；执着的",
    example: "He is a tenacious negotiator who never gives up easily.",
    category: "考研高频"
  },
  {
    word: "undermine",
    phonetic: "[ˌʌndəˈmaɪn]",
    enDefinition: "Erode the base or foundation of (a rock formation, monument, or edifice).",
    zhDefinition: "v. 暗中破坏；削弱",
    example: "Constant criticism can undermine a child's self-confidence.",
    category: "考研高频"
  },
  {
    word: "visceral",
    phonetic: "[ˈvɪsərəl]",
    enDefinition: "Relating to deep inward feelings rather than to the intellect.",
    zhDefinition: "adj. 发自内心的；出自本能的",
    example: "The movie evokes a visceral response from the audience.",
    category: "考研高频"
  },
  {
    word: "abjure",
    phonetic: "[əbˈdʒʊə(r)]",
    enDefinition: "Solemnly renounce (a belief, cause, or claim).",
    zhDefinition: "v. 公开放弃；发誓戒绝",
    example: "He was forced to abjure his political beliefs in court.",
    category: "考研高频"
  },
  {
    word: "belligerent",
    phonetic: "[bəˈlɪdʒərənt]",
    enDefinition: "Hostile and aggressive.",
    zhDefinition: "adj. 好战的；挑衅的",
    example: "His belligerent attitude made it difficult to resolve the conflict.",
    category: "考研高频"
  },

  // --- 第13组 ---
  {
    word: "cacophony",
    phonetic: "[kəˈkɒfəni]",
    enDefinition: "A harsh, discordant mixture of sounds.",
    zhDefinition: "n. 刺耳的嘈杂声；不和谐音",
    example: "A cacophony of car horns and sirens filled the morning air.",
    category: "考研高频"
  },
  {
    word: "decorous",
    phonetic: "[ˈdekərəs]",
    enDefinition: "In keeping with good taste and propriety; polite and restrained.",
    zhDefinition: "adj. 端庄的；得体的",
    example: "The guest maintained a decorous silence throughout the ceremony.",
    category: "考研高频"
  },
  {
    word: "ebullient",
    phonetic: "[ɪˈbʌliənt]",
    enDefinition: "Cheerful and full of energy.",
    zhDefinition: "adj. 热情洋溢的；精力充沛的",
    example: "She was ebullient after receiving the good news.",
    category: "考研高频"
  },
  {
    word: "fatuous",
    phonetic: "[ˈfætjuəs]",
    enDefinition: "Silly and pointless.",
    zhDefinition: "adj. 愚蠢的；荒谬的",
    example: "He made a fatuous remark that everyone chose to ignore.",
    category: "考研高频"
  },
  {
    word: "hackneyed",
    phonetic: "[ˈhæknid]",
    enDefinition: "(Of a phrase or idea) lacking significance through having been overused; unoriginal and trite.",
    zhDefinition: "adj. 陈腐的；老掉牙的",
    example: "The plot of the movie was filled with hackneyed clichés.",
    category: "考研高频"
  },
  {
    word: "ineffable",
    phonetic: "[ɪnˈefəbl]",
    enDefinition: "Too great or extreme to be expressed or described in words.",
    zhDefinition: "adj. 妙不可言的；言语难以表达的",
    example: "The beauty of the sunset was ineffable.",
    category: "考研高频"
  },
  {
    word: "luminous",
    phonetic: "[ˈluːmɪnəs]",
    enDefinition: "Full of or shedding light; bright or shining, especially in the dark.",
    zhDefinition: "adj. 发光的；清晰的；明亮的",
    example: "The ocean was filled with luminous jellyfish at night.",
    category: "考研高频"
  },
  {
    word: "mawkish",
    phonetic: "[ˈmɔːkɪʃ]",
    enDefinition: "Sentimental in a feeble or sickly way.",
    zhDefinition: "adj. 多愁善感的；无病呻吟的",
    example: "I found the ending of the film a bit too mawkish.",
    category: "考研高频"
  },
  {
    word: "neophyte",
    phonetic: "[ˈniːəfaɪt]",
    enDefinition: "A person who is new to a subject, skill, or belief.",
    zhDefinition: "n. 初学者；新手",
    example: "As a neophyte in the stock market, he sought expert advice.",
    category: "考研高频"
  },
  {
    word: "ominous",
    phonetic: "[ˈɒmɪnəs]",
    enDefinition: "Giving the impression that something bad or unpleasant is going to happen; threatening.",
    zhDefinition: "adj. 不祥的；预兆的",
    example: "The dark clouds were an ominous sign of the storm to come.",
    category: "考研高频"
  },

  // --- 第14组 ---
  {
    word: "panacea",
    phonetic: "[ˌpænəˈsiːə]",
    enDefinition: "A solution or remedy for all difficulties or diseases.",
    zhDefinition: "n. 万灵药；通用的补救法",
    example: "Technology is not a panacea for all of society's problems.",
    category: "考研高频"
  },
  {
    word: "quell",
    phonetic: "[kwel]",
    enDefinition: "Put an end to (a rebellion or other disorder), typically by the use of force.",
    zhDefinition: "v. 镇压；平息；克制(情绪)",
    example: "Extra police were called in to quell the riot.",
    category: "考研高频"
  },
  {
    word: "repudiate",
    phonetic: "[rɪˈpjuːdieɪt]",
    enDefinition: "Refuse to accept or be associated with.",
    zhDefinition: "v. 拒绝；否认；批判",
    example: "The candidate repudiated the allegations made by his opponent.",
    category: "考研高频"
  },
  {
    word: "stupefy",
    phonetic: "[ˈstjuːpɪfaɪ]",
    enDefinition: "Make (someone) unable to think or feel properly.",
    zhDefinition: "v. 使麻木；使发呆；使惊呆",
    example: "The sheer scale of the disaster seemed to stupefy the survivors.",
    category: "考研高频"
  },
  {
    word: "trepidation",
    phonetic: "[ˌtrepɪˈdeɪʃn]",
    enDefinition: "A feeling of fear or agitation about something that may happen.",
    zhDefinition: "n. 恐惧；颤抖；惶恐",
    example: "With some trepidation, she opened the envelope containing her results.",
    category: "考研高频"
  },
  {
    word: "utilitarian",
    phonetic: "[ˌjuːtɪlɪˈteəriən]",
    enDefinition: "Designed to be useful or practical rather than attractive.",
    zhDefinition: "adj. 实用的；功利主义的",
    example: "The building was plain and utilitarian, built for efficiency.",
    category: "考研高频"
  },
  {
    word: "vociferous",
    phonetic: "[vəˈsɪfərəs]",
    enDefinition: "(Especially of a person or speech) vehement or clamorous.",
    zhDefinition: "adj. 叫嚣的；大声疾呼的",
    example: "He was a vociferous critic of the new government policy.",
    category: "考研高频"
  },
  {
    word: "wane",
    phonetic: "[weɪn]",
    enDefinition: "(Of a state or feeling) decrease in vigor, power, or extent; become weaker.",
    zhDefinition: "v. 衰落；变小；减弱",
    example: "Interest in the project began to wane after several months of delays.",
    category: "考研高频"
  },
  {
    word: "zeal",
    phonetic: "[ziːl]",
    enDefinition: "Great energy or enthusiasm in pursuit of a cause or an objective.",
    zhDefinition: "n. 热情；狂热",
    example: "Her zeal for her work was admired by all her colleagues.",
    category: "考研高频"
  },
  {
    word: "abscond",
    phonetic: "[əbˈskɒnd]",
    enDefinition: "Leave hurriedly and secretly, typically to avoid detection of or arrest for an unlawful action.",
    zhDefinition: "v. 潜逃；潜踪匿迹",
    example: "The treasurer absconded with the company funds.",
    category: "考研高频"
  },

  // --- 第15组 ---
  {
    word: "bereft",
    phonetic: "[bɪˈreft]",
    enDefinition: "Deprived of or lacking something, especially a non-material asset.",
    zhDefinition: "adj. 丧失的；匮乏的",
    example: "The team was left bereft of hope after their star player was injured.",
    category: "考研高频"
  },
  {
    word: "compunction",
    phonetic: "[kəmˈpʌŋkʃn]",
    enDefinition: "A feeling of guilt or moral scruple that prevents or follows the doing of something bad.",
    zhDefinition: "n. 内疚；悔恨",
    example: "He had no compunction about cheating on his taxes.",
    category: "考研高频"
  },
  {
    word: "desiccated",
    phonetic: "[ˈdesɪkeɪtɪd]",
    enDefinition: "Lacking interest, passion, or energy.",
    zhDefinition: "adj. 枯燥无味的；干枯的",
    example: "The old man's desiccated skin looked like parchment.",
    category: "考研高频"
  },
  {
    word: "enigma",
    phonetic: "[ɪˈnɪɡmə]",
    enDefinition: "A person or thing that is mysterious, puzzling, or difficult to understand.",
    zhDefinition: "n. 谜团；难以理解的事物",
    example: "His motivation for leaving the job remains an enigma.",
    category: "考研高频"
  },
  {
    word: "florid",
    phonetic: "[ˈflɒrɪd]",
    enDefinition: "Excessively intricate or elaborate.",
    zhDefinition: "adj. 绚丽的；词藻华丽的",
    example: "He wrote a long, florid letter of apology.",
    category: "考研高频"
  },
  {
    word: "hapless",
    phonetic: "[ˈhæpləs]",
    enDefinition: "(Especially of a person) unfortunate.",
    zhDefinition: "adj. 倒霉的；不幸的",
    example: "The hapless travelers were stranded at the airport for two days.",
    category: "考研高频"
  },
  {
    word: "inchoate",
    phonetic: "[ɪnˈkəʊeɪt]",
    enDefinition: "Just begun and so not fully formed or developed; rudimentary.",
    zhDefinition: "adj. 刚开始的；未完全形成的",
    example: "His thoughts on the subject were still inchoate and unorganized.",
    category: "考研高频"
  },
  {
    word: "knack",
    phonetic: "[næk]",
    enDefinition: "An acquired or natural skill at performing a task.",
    zhDefinition: "n. 诀窍；本领",
    example: "She has a knack for making people feel comfortable.",
    category: "考研高频"
  },
  {
    word: "lithe",
    phonetic: "[laɪð]",
    enDefinition: "(Especially of a person's body) thin, supple, and graceful.",
    zhDefinition: "adj. 柔软的；轻盈的",
    example: "The dancer's lithe movements captivated the audience.",
    category: "考研高频"
  },
  {
    word: "multifarious",
    phonetic: "[ˌmʌltɪˈfeəriəs]",
    enDefinition: "Many and of various types.",
    zhDefinition: "adj. 多种多样的；五花八门的",
    example: "The city offers multifarious cultural activities for its residents.",
    category: "考研高频"
  },

  // --- 第16组 ---
  {
    word: "nadir",
    phonetic: "[ˈneɪdɪə(r)]",
    enDefinition: "The lowest point in the fortunes of a person or organization.",
    zhDefinition: "n. 最低点；最糟的时刻",
    example: "The defeat at the polls was the nadir of his political career.",
    category: "考研高频"
  },
  {
    word: "ostensible",
    phonetic: "[ɒˈstensəbl]",
    enDefinition: "Stated or appearing to be true, but not necessarily so.",
    zhDefinition: "adj. 表面的；口实上的",
    example: "The ostensible reason for his resignation was ill health.",
    category: "考研高频"
  },
  {
    word: "punctilious",
    phonetic: "[pʌŋkˈtɪliəs]",
    enDefinition: "Showing great attention to detail or correct behavior.",
    zhDefinition: "adj. 一丝不苟的；拘泥细节的",
    example: "He was punctilious about punctuality and expected the same from others.",
    category: "考研高频"
  },
  {
    word: "quaint",
    phonetic: "[kweɪnt]",
    enDefinition: "Attractively unusual or old-fashioned.",
    zhDefinition: "adj. 古色古香的；离奇有趣的",
    example: "We stayed in a quaint little cottage in the countryside.",
    category: "考研高频"
  },
  {
    word: "remiss",
    phonetic: "[rɪˈmɪs]",
    enDefinition: "Lacking care or attention to duty; negligent.",
    zhDefinition: "adj. 玩忽职守的；疏忽的",
    example: "It would be remiss of me not to thank everyone for their hard work.",
    category: "考研高频"
  },
  {
    word: "satiate",
    phonetic: "[ˈseɪʃieɪt]",
    enDefinition: "Satisfied to the full; sated.",
    zhDefinition: "v. 使饱足；充分满足",
    example: "Nothing could satiate his hunger for knowledge.",
    category: "考研高频"
  },
  {
    word: "truculent",
    phonetic: "[ˈtrʌkjələnt]",
    enDefinition: "Eager or quick to argue or fight; aggressively defiant.",
    zhDefinition: "adj. 凶猛的；好斗的",
    example: "His truculent behavior often got him into trouble.",
    category: "考研高频"
  },
  {
    word: "umbrage",
    phonetic: "[ˈʌmbrɪdʒ]",
    enDefinition: "Offense or annoyance.",
    zhDefinition: "n. 愤怒；不快",
    example: "She took umbrage at the suggestion that she was lying.",
    category: "考研高频"
  },
  {
    word: "verdant",
    phonetic: "[ˈvɜːdnt]",
    enDefinition: "(Of countryside) green with grass or other rich vegetation.",
    zhDefinition: "adj. 翠绿的；长满绿色植物的",
    example: "The valley was lush and verdant after the spring rains.",
    category: "考研高频"
  },
  {
    word: "wizened",
    phonetic: "[ˈwɪznd]",
    enDefinition: "Shriveled or wrinkled with age.",
    zhDefinition: "adj. 皱缩的；枯萎的",
    example: "The old man had a wizened face and a kind smile.",
    category: "考研高频"
  },

  // --- 第17组 ---
  {
    word: "abet",
    phonetic: "[əˈbet]",
    enDefinition: "Encourage or assist (someone) to do something wrong, in particular, to commit a crime.",
    zhDefinition: "v. 煽动；教唆；协助(犯罪)",
    example: "He was accused of aiding and abetting the escape of the prisoner.",
    category: "考研高频"
  },
  {
    word: "buffet",
    phonetic: "[ˈbʌfɪt]",
    enDefinition: "(Especially of wind or waves) strike repeatedly and violently; batter.",
    zhDefinition: "v. 连续打击；搏斗",
    example: "The small boat was buffeted by the high winds.",
    category: "考研高频"
  },
  {
    word: "conundrum",
    phonetic: "[kəˈnʌndrəm]",
    enDefinition: "A confusing and difficult problem or question.",
    zhDefinition: "n. 难题；谜语",
    example: "The aging population poses a difficult economic conundrum for the government.",
    category: "考研高频"
  },
  {
    word: "diffident",
    phonetic: "[ˈdɪfɪdənt]",
    enDefinition: "Modest or shy because of a lack of self-confidence.",
    zhDefinition: "adj. 缺乏自信的；胆怯的",
    example: "She was diffident about her talent and rarely performed in public.",
    category: "考研高频"
  },
  {
    word: "egregious",
    phonetic: "[ɪˈɡriːdʒiəs]",
    enDefinition: "Outstandingly bad; shocking.",
    zhDefinition: "adj. 极坏的；极其恶劣的",
    example: "The error was so egregious that it could not be ignored.",
    category: "考研高频"
  },
  {
    word: "fractious",
    phonetic: "[ˈfrækʃəs]",
    enDefinition: "(Typically of children) irritable and quarrelsome.",
    zhDefinition: "adj. 易怒的；难以控制的",
    example: "The baby became fractious because of the heat.",
    category: "考研高频"
  },
  {
    word: "heterogeneous",
    phonetic: "[ˌhetərəˈdʒiːniəs]",
    enDefinition: "Diverse in character or content.",
    zhDefinition: "adj. 由不同成分组成的；多样的",
    example: "America is a heterogeneous society with people from many different backgrounds.",
    category: "考研高频"
  },
  {
    word: "intrepid",
    phonetic: "[ɪnˈtrepɪd]",
    enDefinition: "Fearless; adventurous (often used for rhetorical or humorous effect).",
    zhDefinition: "adj. 无畏的；勇猛的",
    example: "The intrepid explorers set off into the unknown wilderness.",
    category: "考研高频"
  },
  {
    word: "laconic",
    phonetic: "[ləˈkɒnɪk]",
    enDefinition: "(Of a person, speech, or style of writing) using very few words.",
    zhDefinition: "adj. 简洁的；话少的",
    example: "His laconic reply made it clear that he was not interested in talking.",
    category: "考研高频"
  },
  {
    word: "myriad",
    phonetic: "[ˈmɪriəd]",
    enDefinition: "A countless or extremely great number.",
    zhDefinition: "n./adj. 无数(的)；大量(的)",
    example: "There are myriad opportunities for career advancement in this field.",
    category: "考研高频"
  },

  // --- 第18组 ---
  {
    word: "obfuscate",
    phonetic: "[ˈɒbfʌskeɪt]",
    enDefinition: "Render obscure, unclear, or unintelligible.",
    zhDefinition: "v. 使模糊；故意使困惑",
    example: "The writer tried to obfuscate the issue with complex language.",
    category: "考研高频"
  },
  {
    word: "perfunctory",
    phonetic: "[pəˈfʌŋktəri]",
    enDefinition: "(Of an action or gesture) carried out with a minimum of effort or reflection.",
    zhDefinition: "adj. 敷衍的；草率的",
    example: "He gave the room a perfunctory cleaning before the guests arrived.",
    category: "考研高频"
  },
  {
    word: "quash",
    phonetic: "[kwɒʃ]",
    enDefinition: "Reject or void, especially by legal procedure.",
    zhDefinition: "v. 撤销；废止；镇压",
    example: "The court decided to quash the previous conviction.",
    category: "考研高频"
  },
  {
    word: "resilient",
    phonetic: "[rɪˈzɪliənt]",
    enDefinition: "(Of a person or animal) able to withstand or recover quickly from difficult conditions.",
    zhDefinition: "adj. 有弹性的；能迅速恢复的",
    example: "Children are often more resilient than adults in times of crisis.",
    category: "考研高频"
  },
  {
    word: "surreptitious",
    phonetic: "[ˌsʌrəpˈtɪʃəs]",
    enDefinition: "Kept secret, especially because it would not be approved of.",
    zhDefinition: "adj. 鬼鬼祟祟的；秘密的",
    example: "They had a surreptitious meeting in a small café.",
    category: "考研高频"
  },
  {
    word: "turpitude",
    phonetic: "[ˈtɜːpɪtjuːd]",
    enDefinition: "Depravity; wickedness.",
    zhDefinition: "n. 邪恶；堕落",
    example: "He was dismissed from the army for moral turpitude.",
    category: "考研高频"
  },
  {
    word: "unctuous",
    phonetic: "[ˈʌŋktʃuəs]",
    enDefinition: "(Of a person) excessively or ingratiatingly flattering; oily.",
    zhDefinition: "adj. 谄媚的；油腔滑调的",
    example: "I was repelled by the unctuous salesman's constant praise.",
    category: "考研高频"
  },
  {
    word: "vicissitude",
    phonetic: "[vɪˈsɪsɪtjuːd]",
    enDefinition: "A change of circumstances or fortune, typically one that is unwelcome or unpleasant.",
    zhDefinition: "n. 变迁；兴衰；荣辱",
    example: "The business survived the vicissitudes of the economic cycle.",
    category: "考研高频"
  },
  {
    word: "wanton",
    phonetic: "[ˈwɒntən]",
    enDefinition: "(Of a cruel or violent action) deliberate and unprovoked.",
    zhDefinition: "adj. 肆意的；无节制的；荒唐的",
    example: "The storm caused wanton destruction throughout the region.",
    category: "考研高频"
  },
  {
    word: "acumen",
    phonetic: "[ˈækjumən]",
    enDefinition: "The ability to make good judgments and quick decisions, typically in a particular domain.",
    zhDefinition: "n. 敏锐；聪明",
    example: "His business acumen allowed him to see opportunities where others saw failure.",
    category: "考研高频"
  },

  // --- 第19组 ---
  {
    word: "bilk",
    phonetic: "[bɪlk]",
    enDefinition: "Obtain or withhold money from (someone) by deceit or without justification; cheat or defraud.",
    zhDefinition: "v. 诈骗；骗取",
    example: "They were accused of bilking investors out of millions of dollars.",
    category: "考研高频"
  },
  {
    word: "credulity",
    phonetic: "[krɪˈdjuːləti]",
    enDefinition: "A tendency to be too ready to believe that something is real or true.",
    zhDefinition: "n. 轻信；易受骗",
    example: "Advertisers often take advantage of the public's credulity.",
    category: "考研高频"
  },
  {
    word: "disparage",
    phonetic: "[dɪˈspærɪdʒ]",
    enDefinition: "Regard or represent as being of little worth.",
    zhDefinition: "v. 贬低；轻视",
    example: "He tends to disparage the efforts of his colleagues.",
    category: "考研高频"
  },
  {
    word: "evanescent",
    phonetic: "[ˌevəˈnesnt]",
    enDefinition: "Soon passing out of sight, memory, or existence; quickly fading or disappearing.",
    zhDefinition: "adj. 短暂的；逐渐消失的",
    example: "The beauty of a soap bubble is evanescent.",
    category: "考研高频"
  },
  {
    word: "fallacious",
    phonetic: "[fəˈleɪʃəs]",
    enDefinition: "Based on a mistaken belief.",
    zhDefinition: "adj. 谬误的；欺骗性的",
    example: "The argument is based on a fallacious premise.",
    category: "考研高频"
  },
  {
    word: "gratuitous",
    phonetic: "[ɡrəˈtjuːɪtəs]",
    enDefinition: "Uncalled for; lacking good reason; unwarranted.",
    zhDefinition: "adj. 无理由的；免费的；无端的",
    example: "The movie was criticized for its gratuitous violence.",
    category: "考研高频"
  },
  {
    word: "hiatus",
    phonetic: "[haɪˈeɪtəs]",
    enDefinition: "A pause or gap in a sequence, series, or process.",
    zhDefinition: "n. 间断；缝隙",
    example: "After a long hiatus, the band finally released a new album.",
    category: "考研高频"
  },
  {
    word: "iniquity",
    phonetic: "[ɪˈnɪkwəti]",
    enDefinition: "Immoral or grossly unfair behavior.",
    zhDefinition: "n. 不义；极度的不公正",
    example: "The novel exposes the iniquity of the slave trade.",
    category: "考研高频"
  },
  {
    word: "jovial",
    phonetic: "[ˈdʒəʊviəl]",
    enDefinition: "Cheerful and friendly.",
    zhDefinition: "adj. 快乐的；友好的",
    example: "He was in a jovial mood and kept everyone laughing.",
    category: "考研高频"
  },
  {
    word: "kindred",
    phonetic: "[ˈkɪndrəd]",
    enDefinition: "Similar in kind; related.",
    zhDefinition: "adj. 同类的；相似的",
    example: "They found that they had kindred spirits in their love of nature.",
    category: "考研高频"
  },

  // --- 第20组 ---
  {
    word: "largess",
    phonetic: "[lɑːˈdʒes]",
    enDefinition: "Generosity in bestowing money or gifts upon others.",
    zhDefinition: "n. 慷慨的赠与；赏赐",
    example: "The university depends on the largess of its alumni.",
    category: "考研高频"
  },
  {
    word: "malleable",
    phonetic: "[ˈmæliəbl]",
    enDefinition: "Easily influenced; pliable.",
    zhDefinition: "adj. 有延展性的；易受影响的",
    example: "Young minds are often more malleable and open to new ideas.",
    category: "考研高频"
  },
  {
    word: "nonchalant",
    phonetic: "[ˈnɒnʃələnt]",
    enDefinition: "(Of a person or manner) feeling or appearing casually calm and relaxed; not displaying anxiety, interest, or enthusiasm.",
    zhDefinition: "adj. 冷淡的；漠不关心的",
    example: "She appeared nonchalant even though she was very nervous.",
    category: "考研高频"
  },
  {
    word: "officious",
    phonetic: "[əˈfɪʃəs]",
    enDefinition: "Assertive of authority in an annoyingly domineering way, especially with regard to petty or trivial matters.",
    zhDefinition: "adj. 爱管闲事的；多嘴的",
    example: "The officious security guard kept checking our badges.",
    category: "考研高频"
  },
  {
    word: "pathos",
    phonetic: "[ˈpeɪθɒs]",
    enDefinition: "A quality that evokes pity or sadness.",
    zhDefinition: "n. 感染力；引起同情心的情况",
    example: "There is a great deal of pathos in the final scene of the play.",
    category: "考研高频"
  },
  {
    word: "quintessential",
    phonetic: "[ˌkwɪntɪˈsenʃl]",
    enDefinition: "Representing the most perfect or typical example of a quality or class.",
    zhDefinition: "adj. 典型的；精粹的",
    example: "He is the quintessential English gentleman.",
    category: "考研高频"
  },
  {
    word: "rectitude",
    phonetic: "[ˈrektɪtjuːd]",
    enDefinition: "Morally correct behavior or thinking; righteousness.",
    zhDefinition: "n. 正直；公正",
    example: "He was respected by everyone for his moral rectitude.",
    category: "考研高频"
  },
  {
    word: "sanctimonious",
    phonetic: "[ˌsæŋktɪˈməʊniəs]",
    enDefinition: "Making a show of being morally superior to other people.",
    zhDefinition: "adj. 假装虔诚的；道貌岸然的",
    example: "No one likes his sanctimonious lectures on how we should live.",
    category: "考研高频"
  },
  {
    word: "tantamount",
    phonetic: "[ˈtæntəmaʊnt]",
    enDefinition: "Equivalent in seriousness to; virtually the same as.",
    zhDefinition: "adj. 相等的；等同于",
    example: "To leave now would be tantamount to admitting defeat.",
    category: "考研高频"
  },
  {
    word: "ubiquity",
    phonetic: "[juːˈbɪkwəti]",
    enDefinition: "The fact of appearing everywhere or of being very common.",
    zhDefinition: "n. 普遍存在；无处不在",
    example: "The ubiquity of cell phones has changed the way we communicate.",
    category: "考研高频"
  },

  // --- 第21组 ---
  {
    word: "ameliorate",
    phonetic: "[əˈmiːliəreɪt]",
    enDefinition: "Make (something bad or unsatisfactory) better.",
    zhDefinition: "v. 改善；减轻（痛苦等）",
    example: "Steps have been taken to ameliorate the living conditions of the urban poor.",
    category: "考研高频"
  },
  {
    word: "anomaly",
    phonetic: "[əˈnɒməli]",
    enDefinition: "Something that deviates from what is standard, normal, or expected.",
    zhDefinition: "n. 异常；反常事物",
    example: "The researchers found a genetic anomaly that had been overlooked for years.",
    category: "考研高频"
  },
  {
    word: "antipathy",
    phonetic: "[ænˈtɪpəθi]",
    enDefinition: "A deep-seated feeling of dislike; aversion.",
    zhDefinition: "n. 反感；厌恶",
    example: "There has always been a strong antipathy between the two rival factions.",
    category: "考研高频"
  },
  {
    word: "articulate",
    phonetic: "[ɑːˈtɪkjuleɪt]",
    enDefinition: "(Of a person or a person's words) having or showing the ability to speak fluently and coherently.",
    zhDefinition: "adj. 表达清晰的；口才好的 v. 清楚地表达",
    example: "He was an articulate speaker who could explain complex ideas simply.",
    category: "考研高频"
  },
  {
    word: "assuage",
    phonetic: "[əˈsweɪdʒ]",
    enDefinition: "Make (an unpleasant feeling) less intense.",
    zhDefinition: "v. 缓和；平息；满足",
    example: "The government tried to assuage the public's fears about the economy.",
    category: "考研高频"
  },
  {
    word: "audacious",
    phonetic: "[ɔːˈdeɪʃəs]",
    enDefinition: "Showing a willingness to take surprisingly bold risks.",
    zhDefinition: "adj. 大胆的；鲁莽的",
    example: "The company made an audacious attempt to take over its much larger rival.",
    category: "考研高频"
  },
  {
    word: "austere",
    phonetic: "[ɔːˈstɪə(r)]",
    enDefinition: "Severe or strict in manner, attitude, or appearance.",
    zhDefinition: "adj. 严厉的；简朴的；苦行的",
    example: "The monastery was known for its austere way of life.",
    category: "考研高频"
  },
  {
    word: "axiomatic",
    phonetic: "[ˌæksiəˈmætɪk]",
    enDefinition: "Self-evident or unquestionable.",
    zhDefinition: "adj. 公理的；不言自明的",
    example: "It is axiomatic that the best way to learn a language is to speak it.",
    category: "考研高频"
  },
  {
    word: "bolster",
    phonetic: "[ˈbəʊlstə(r)]",
    enDefinition: "Support or strengthen; prop up.",
    zhDefinition: "v. 支持；巩固；增强",
    example: "Falling interest rates helped to bolster the housing market.",
    category: "考研高频"
  },
  {
    word: "bombastic",
    phonetic: "[bɒmˈbæstɪk]",
    enDefinition: "High-sounding but with little meaning; inflated.",
    zhDefinition: "adj. 夸大的；言过其实的",
    example: "The politician's bombastic rhetoric failed to impress the audience.",
    category: "考研高频"
  },

  // --- 第22组 ---
  {
    word: "catalyst",
    phonetic: "[ˈkætəlɪst]",
    enDefinition: "A person or thing that precipitates an event.",
    zhDefinition: "n. 催化剂；促使事物发展的因素",
    example: "The protests acted as a catalyst for political change.",
    category: "考研高频"
  },
  {
    word: "caustic",
    phonetic: "[ˈkɔːstɪk]",
    enDefinition: "Sarcastic in a scathing and bitter way.",
    zhDefinition: "adj. 尖刻的；腐蚀性的",
    example: "Her caustic remarks during the interview cost her the job.",
    category: "考研高频"
  },
  {
    word: "coalesce",
    phonetic: "[ˌkəʊəˈles]",
    enDefinition: "Come together and form one mass or whole.",
    zhDefinition: "v. 合并；联合",
    example: "The smaller groups coalesced to form a powerful political party.",
    category: "考研高频"
  },
  {
    word: "commensurate",
    phonetic: "[kəˈmenʃərət]",
    enDefinition: "Corresponding in size or degree; in proportion.",
    zhDefinition: "adj. 相称的；同量的",
    example: "The salary will be commensurate with your experience and qualifications.",
    category: "考研高频"
  },
  {
    word: "condone",
    phonetic: "[kənˈdəʊn]",
    enDefinition: "Accept and allow (behavior that is considered wrong or offensive) to continue.",
    zhDefinition: "v. 宽恕；容忍",
    example: "The university does not condone any form of cheating.",
    category: "考研高频"
  },
  {
    word: "convoluted",
    phonetic: "[ˈkɒnvəluːtɪd]",
    enDefinition: "(Especially of an argument, story, or sentence) extremely complex and difficult to follow.",
    zhDefinition: "adj. 复杂的；费解的；旋转的",
    example: "The movie's plot was so convoluted that I lost track of what was happening.",
    category: "考研高频"
  },
  {
    word: "craven",
    phonetic: "[ˈkreɪvn]",
    enDefinition: "Contemptibly lacking in courage; cowardly.",
    zhDefinition: "adj. 懦弱的；卑怯的",
    example: "The craven decision to ignore the problem led to even greater trouble later.",
    category: "考研高频"
  },
  {
    word: "dearth",
    phonetic: "[dɜːθ]",
    enDefinition: "A scarcity or lack of something.",
    zhDefinition: "n. 缺乏；饥荒",
    example: "There is a dearth of reliable information on the subject.",
    category: "考研高频"
  },
  {
    word: "denigrate",
    phonetic: "[ˈdenɪɡreɪt]",
    enDefinition: "Criticize unfairly; disparage.",
    zhDefinition: "v. 贬低；诽谤",
    example: "It is wrong to denigrate the achievements of others to make yourself look better.",
    category: "考研高频"
  },
  {
    word: "deride",
    phonetic: "[dɪˈraɪ]",
    enDefinition: "Express contempt for; ridicule.",
    zhDefinition: "v. 嘲笑；愚弄",
    example: "Critics derided the film for its poor acting and weak script.",
    category: "考研高频"
  },

  // --- 第23组 ---
  {
    word: "desultory",
    phonetic: "[ˈdesəltəri]",
    enDefinition: "Lacking a plan, purpose, or enthusiasm.",
    zhDefinition: "adj. 散漫的；草率的；无计划的",
    example: "She made a desultory effort to clean the house before the guests arrived.",
    category: "考研高频"
  },
  {
    word: "dichotomy",
    phonetic: "[daɪˈkɒtəmi]",
    enDefinition: "A division or contrast between two things that are or are represented as being opposed or entirely different.",
    zhDefinition: "n. 二分法；对立",
    example: "There is a false dichotomy between science and art; they are both essential.",
    category: "考研高频"
  },
  {
    word: "disabuse",
    phonetic: "[ˌdɪsəˈbjuːz]",
    enDefinition: "Persuade (someone) that an idea or belief is mistaken.",
    zhDefinition: "v. 使省悟；纠正...的错误念头",
    example: "I must disabuse you of the idea that this will be an easy task.",
    category: "考研高频"
  },
  {
    word: "disseminate",
    phonetic: "[dɪˈsemɪneɪt]",
    enDefinition: "Spread or disperse (something, especially information) widely.",
    zhDefinition: "v. 散布；传播",
    example: "Health authorities should disseminate information about the vaccine as widely as possible.",
    category: "考研高频"
  },
  {
    word: "dogmatic",
    phonetic: "[dɒɡˈmætɪk]",
    enDefinition: "Inclined to lay down principles as incontrovertibly true.",
    zhDefinition: "adj. 教条的；武断的",
    example: "The professor was so dogmatic that he refused to listen to any opposing views.",
    category: "考研高频"
  },
  {
    word: "eclectic",
    phonetic: "[ɪˈklektɪk]",
    enDefinition: "Deriving ideas, style, or taste from a broad and diverse range of sources.",
    zhDefinition: "adj. 折衷的；兼收并蓄的",
    example: "The university offers an eclectic curriculum covering everything from robotics to philosophy.",
    category: "考研高频"
  },
  {
    word: "efficacy",
    phonetic: "[ˈefɪkəsi]",
    enDefinition: "The ability to produce a desired or intended result.",
    zhDefinition: "n. 功效；效力",
    example: "Scientists are still testing the efficacy of the new drug.",
    category: "考研高频"
  },
  {
    word: "effrontery",
    phonetic: "[ɪˈfrʌntəri]",
    enDefinition: "Insolent or impertinent behavior.",
    zhDefinition: "n. 厚颜无耻；鲁莽",
    example: "He had the effrontery to ask for another loan after failing to pay back the first one.",
    category: "考研高频"
  },
  {
    word: "elicit",
    phonetic: "[iˈlɪsɪt]",
    enDefinition: "Evoke or draw out (a response, answer, or fact) from someone in reaction to one's own actions or questions.",
    zhDefinition: "v. 诱出；引出（事实或反应）",
    example: "The survey was designed to elicit the views of ordinary citizens.",
    category: "考研高频"
  },
  {
    word: "empirical",
    phonetic: "[ɪmˈpɪrɪkl]",
    enDefinition: "Based on, concerned with, or verifiable by observation or experience rather than theory or pure logic.",
    zhDefinition: "adj. 以经验为依据的；实证的",
    example: "There is no empirical evidence to support the claim that the drug is effective.",
    category: "考研高频"
  },

  // --- 第24组 ---
  {
    word: "endemic",
    phonetic: "[enˈdemɪk]",
    enDefinition: "(Of a disease or condition) regularly found among particular people or in a certain area.",
    zhDefinition: "adj. 地方性的；（某地或某类人中）常有的",
    example: "Corruption has become endemic in the country's political system.",
    category: "考研高频"
  },
  {
    word: "engender",
    phonetic: "[ɪnˈdʒendə(r)]",
    enDefinition: "Cause or give rise to (a feeling, situation, or condition).",
    zhDefinition: "v. 产生；引起",
    example: "The minister's speech was designed to engender a sense of hope in the public.",
    category: "考研高频"
  },
  {
    word: "esoteric",
    phonetic: "[ˌesəˈterɪk]",
    enDefinition: "Intended for or likely to be understood by only a small number of people with a specialized knowledge or interest.",
    zhDefinition: "adj. 秘传的；难懂的；极少数人理解的",
    example: "The debate centered on an esoteric point of international law.",
    category: "考研高频"
  },
  {
    word: "exculpate",
    phonetic: "[ˈekskʌlpeɪt]",
    enDefinition: "Show or declare that (someone) is not guilty of wrongdoing.",
    zhDefinition: "v. 证明...无罪；开脱",
    example: "The new evidence was enough to exculpate the man of all charges.",
    category: "考研高频"
  },
  {
    word: "exigency",
    phonetic: "[ˈeksɪdʒənsi]",
    enDefinition: "An urgent need or demand.",
    zhDefinition: "n. 急需；紧急情况",
    example: "The exigencies of the war required immediate action from the government.",
    category: "考研高频"
  },
  {
    word: "extrapolate",
    phonetic: "[ɪkˈstræpəleɪt]",
    enDefinition: "Extend the application of (a method or conclusion) to an unknown situation by assuming that existing trends will continue.",
    zhDefinition: "v. 推断；外推",
    example: "We cannot simply extrapolate from past results to predict future performance.",
    category: "考研高频"
  },
  {
    word: "felicitous",
    phonetic: "[fəˈlɪsɪtəs]",
    enDefinition: "Well chosen or suited to the circumstances.",
    zhDefinition: "adj. （措辞等）恰当的；令人愉悦的",
    example: "His felicitous choice of words made the poem even more beautiful.",
    category: "考研高频"
  },
  {
    word: "flout",
    phonetic: "[flaʊt]",
    enDefinition: "Openly disregard (a rule, law or convention).",
    zhDefinition: "v. 公然蔑视；违抗（法律等）",
    example: "Motorists who flout the speed limit should be severely punished.",
    category: "考研高频"
  },
  {
    word: "foment",
    phonetic: "[fəˈment]",
    enDefinition: "Instigate or stir up (an undesirable or violent sentiment or course of action).",
    zhDefinition: "v. 煽动；助长（坏事）",
    example: "The rebels were accused of trying to foment a revolution.",
    category: "考研高频"
  },
  {
    word: "forestall",
    phonetic: "[fɔːˈstɔːl]",
    enDefinition: "Prevent or obstruct (an anticipated event or action) by taking action ahead of time.",
    zhDefinition: "v. 抢先阻止；预先制止",
    example: "The government raised interest rates to forestall an increase in inflation.",
    category: "考研高频"
  },

  // --- 第25组 ---
  {
    word: "gainsay",
    phonetic: "[ˌɡeɪnˈseɪ]",
    enDefinition: "Deny or contradict (a fact or statement).",
    zhDefinition: "v. 否认；反驳",
    example: "No one can gainsay the importance of education in a person's life.",
    category: "考研高频"
  },
  {
    word: "goad",
    phonetic: "[ɡəʊd]",
    enDefinition: "Provoke or annoy (someone) so as to stimulate some action or reaction.",
    zhDefinition: "v. 激励；驱使；挑逗",
    example: "The crowd tried to goad the player into making a mistake.",
    category: "考研高频"
  },
  {
    word: "hyperbole",
    phonetic: "[haɪˈpɜːbəli]",
    enDefinition: "Exaggerated statements or claims not meant to be taken literally.",
    zhDefinition: "n. 夸张法",
    example: "He used hyperbole to describe his adventures, making them sound much more exciting.",
    category: "考研高频"
  },
  {
    word: "immutable",
    phonetic: "[ɪˈmjuːtəbl]",
    enDefinition: "Unchanging over time or unable to be changed.",
    zhDefinition: "adj. 永恒的；不可改变的",
    example: "The laws of nature are often considered to be immutable.",
    category: "考研高频"
  },
  {
    word: "impervious",
    phonetic: "[ɪmˈpɜːviəs]",
    enDefinition: "Unable to be affected by.",
    zhDefinition: "adj. 不受影响的；不能渗透的",
    example: "He seemed impervious to criticism and continued to work in his own way.",
    category: "考研高频"
  },
  {
    word: "impetuous",
    phonetic: "[ɪmˈpetʃuəs]",
    enDefinition: "Acting or done quickly and without thought or care.",
    zhDefinition: "adj. 冲动的；鲁莽的",
    example: "His impetuous decision to quit his job without a plan led to many difficulties.",
    category: "考研高频"
  },
  {
    word: "implode",
    phonetic: "[ɪmˈpləʊd]",
    enDefinition: "Collapse or cause to collapse violently inwards.",
    zhDefinition: "v. 内爆；（机构等）剧烈崩溃",
    example: "The company imploded after the scandal was revealed to the public.",
    category: "考研高频"
  },
  {
    word: "inadvertent",
    phonetic: "[ˌɪnədˈvɜːtənt]",
    enDefinition: "Not resulting from or achieved through deliberate planning.",
    zhDefinition: "adj. 无意的；疏忽的",
    example: "The leak of confidential information was entirely inadvertent.",
    category: "考研高频"
  },
  {
    word: "inchoate",
    phonetic: "[ɪnˈkəʊeɪt]",
    enDefinition: "Just begun and so not fully formed or developed; rudimentary.",
    zhDefinition: "adj. 早期的；未完工的；刚开始的",
    example: "The poet's inchoate ideas began to take shape after several weeks of work.",
    category: "考研高频"
  },
  {
    word: "incongruous",
    phonetic: "[ɪnˈkɒŋɡruəs]",
    enDefinition: "Not in harmony or keeping with the surroundings or other aspects of something.",
    zhDefinition: "adj. 不协调的；不适宜的",
    example: "The modern building looked incongruous among the historic cottages.",
    category: "考研高频"
  },

  // --- 第26组 ---
  {
    word: "indolent",
    phonetic: "[ˈɪndələnt]",
    enDefinition: "Wanting to avoid activity or exertion; lazy.",
    zhDefinition: "adj. 懒惰的；不痛的",
    example: "The hot summer afternoon made us feel peaceful but indolent.",
    category: "考研高频"
  },
  {
    word: "innocuous",
    phonetic: "[ɪˈnɒkjuəs]",
    enDefinition: "Not harmful or offensive.",
    zhDefinition: "adj. 无害的；无冒犯之意的",
    example: "The comment seemed innocuous, but it actually carried a hidden insult.",
    category: "考研高频"
  },
  {
    word: "insensible",
    phonetic: "[ɪnˈsensəbl]",
    enDefinition: "Without one's mental faculties, typically a result of violence or intoxication; unconscious.",
    zhDefinition: "adj. 意识不到的；无知觉的",
    example: "They were insensible to the danger that surrounded them.",
    category: "考研高频"
  },
  {
    word: "insipid",
    phonetic: "[ɪnˈsɪpɪd]",
    enDefinition: "Lacking flavor; lacking vigor or interest.",
    zhDefinition: "adj. 枯燥乏味的；清淡无味的",
    example: "I found the conversation insipid and tried to leave as soon as possible.",
    category: "考研高频"
  },
  {
    word: "intractable",
    phonetic: "[ɪnˈtræktəbl]",
    enDefinition: "Hard to control or deal with.",
    zhDefinition: "adj. 难处理的；棘手的；倔强的",
    example: "The problem of poverty in the region is complex and intractable.",
    category: "考研高频"
  },
  {
    word: "intransigent",
    phonetic: "[ɪnˈtrænzɪdʒənt]",
    enDefinition: "Unwilling or refusing to change one's views or to agree about something.",
    zhDefinition: "adj. 不妥协的；固执己见的",
    example: "Both sides remained intransigent, and the talks ended in failure.",
    category: "考研高频"
  },
  {
    word: "inundate",
    phonetic: "[ˈɪnʌndeɪt]",
    enDefinition: "Overwhelm (someone) with things or people to be dealt with.",
    zhDefinition: "v. 淹没；使不胜负荷",
    example: "The company was inundated with requests for more information after the ad aired.",
    category: "考研高频"
  },
  {
    word: "irascible",
    phonetic: "[ɪˈræsəbl]",
    enDefinition: "Having or showing a tendency to be easily angered.",
    zhDefinition: "adj. 易怒的；性情暴躁的",
    example: "The old man was known for his irascible nature and frequent outbursts.",
    category: "考研高频"
  },
  {
    word: "levity",
    phonetic: "[ˈlevəti]",
    enDefinition: "Humor or frivolity, especially the treatment of a serious matter with humor or in a manner lacking due respect.",
    zhDefinition: "n. 轻率；轻浮",
    example: "The situation was too serious for such levity, and he was told to be quiet.",
    category: "考研高频"
  },
  {
    word: "magnanimity",
    phonetic: "[ˌmæɡnəˈnɪməti]",
    enDefinition: "The fact or condition of being magnanimous; generosity.",
    zhDefinition: "n. 大度；宽宏大量",
    example: "He showed great magnanimity in forgiving the person who had wronged him.",
    category: "考研高频"
  },

  // --- 第27组 ---
  {
    word: "malinger",
    phonetic: "[məˈlɪŋɡə(r)]",
    enDefinition: "Exaggerate or feign illness in order to escape duty or work.",
    zhDefinition: "v. 装病（以逃避工作）",
    example: "He was accused of malingering when he failed to show up for the third time this week.",
    category: "考研高频"
  },
  {
    word: "meticulous",
    phonetic: "[məˈtɪkjələs]",
    enDefinition: "Showing great attention to detail; very careful and precise.",
    zhDefinition: "adj. 一丝不苟的；极仔细的",
    example: "The designer was meticulous in her choice of colors and patterns.",
    category: "考研高频"
  },
  {
    word: "misanthrope",
    phonetic: "[ˈmɪzənθrəʊp]",
    enDefinition: "A person who dislikes humankind and avoids human society.",
    zhDefinition: "n. 厌恶人类者",
    example: "He lived as a misanthrope, rarely speaking to anyone and staying in his home.",
    category: "考研高频"
  },
  {
    word: "mollify",
    phonetic: "[ˈmɒlɪfaɪ]",
    enDefinition: "Appease the anger or anxiety of (someone).",
    zhDefinition: "v. 安抚；减轻；使平息",
    example: "The manager tried to mollify the angry customer by offering a full refund.",
    category: "考研高频"
  },
  {
    word: "monotony",
    phonetic: "[məˈnɒtəni]",
    enDefinition: "Lack of variety and interest; tedious repetition and routine.",
    zhDefinition: "n. 单调；千篇一律",
    example: "The monotony of his daily routine began to weigh on him.",
    category: "考研高频"
  },
  {
    word: "mundane",
    phonetic: "[mʌnˈdeɪn]",
    enDefinition: "Lacking interest or excitement; dull.",
    zhDefinition: "adj. 平凡的；世俗的；乏味的",
    example: "We discussed mundane things like the weather and our weekend plans.",
    category: "考研高频"
  },
  {
    word: "obdurate",
    phonetic: "[ˈɒbdjərət]",
    enDefinition: "Stubbornly refusing to change one's opinion or course of action.",
    zhDefinition: "adj. 顽固的；冷酷无情的",
    example: "The president remained obdurate on the issue, refusing to listen to his advisors.",
    category: "考研高频"
  },
  {
    word: "obsequious",
    phonetic: "[əbˈsiːkwiəs]",
    enDefinition: "Obedient or attentive to an excessive or servile degree.",
    zhDefinition: "adj. 谄媚的；奉承的",
    example: "The waiter was almost annoyingly obsequious, constantly checking on us.",
    category: "考研高频"
  },
  {
    word: "obstinate",
    phonetic: "[ˈɒbstɪnət]",
    enDefinition: "Stubbornly refusing to change one's opinion or chosen course of action, despite attempts to persuade one to do so.",
    zhDefinition: "adj. 顽固的；难以控制的",
    example: "He was an obstinate child who refused to follow any of the rules.",
    category: "考研高频"
  },
  {
    word: "obviate",
    phonetic: "[ˈɒbvieɪt]",
    enDefinition: "Remove (a need or difficulty).",
    zhDefinition: "v. 排除；消除（困难等）",
    example: "The new system will obviate the need for manual record-keeping.",
    category: "考研高频"
  },

  // --- 第28组 ---
  {
    word: "occlude",
    phonetic: "[əˈkluːd]",
    enDefinition: "Stop, close up, or obstruct (an opening, orifice, or passage).",
    zhDefinition: "v. 阻隔；闭塞",
    example: "A piece of food had occluded the patient's airway, making it difficult to breathe.",
    category: "考研高频"
  },
  {
    word: "officious",
    phonetic: "[əˈfɪʃəs]",
    enDefinition: "Assertive of authority in an annoyingly domineering way, especially with regard to petty or trivial matters.",
    zhDefinition: "adj. 爱管闲事的；指手画脚的",
    example: "The officious security guard kept asking to see our identification.",
    category: "考研高频"
  },
  {
    word: "onerous",
    phonetic: "[ˈəʊnərəs]",
    enDefinition: "(Of a task, duty, or responsibility) involving an amount of effort and difficulty that is oppressively burdensome.",
    zhDefinition: "adj. 繁重的；艰巨的",
    example: "The responsibility of caring for his elderly parents was increasingly onerous.",
    category: "考研高频"
  },
  {
    word: "opprobrium",
    phonetic: "[əˈprəʊbriəm]",
    enDefinition: "Harsh criticism or censure.",
    zhDefinition: "n. 耻辱；责骂",
    example: "The government's decision was met with public opprobrium and protests.",
    category: "考研高频"
  },
  {
    word: "oscillate",
    phonetic: "[ˈɒsɪleɪt]",
    enDefinition: "Move or swing back and forth at a regular speed.",
    zhDefinition: "v. 摆动；犹豫",
    example: "The stock market has continued to oscillate between gains and losses all week.",
    category: "考研高频"
  },
  {
    word: "ostentatious",
    phonetic: "[ˌɒstenˈteɪʃəs]",
    enDefinition: "Characterized by vulgar or pretentious display; designed to impress or attract notice.",
    zhDefinition: "adj. 炫耀的；招摇的",
    example: "The hotel lobby was filled with ostentatious displays of wealth.",
    category: "考研高频"
  },
  {
    word: "paragon",
    phonetic: "[ˈpærəɡən]",
    enDefinition: "A person or thing regarded as a perfect example of a particular quality.",
    zhDefinition: "n. 模范；典型",
    example: "The company was once seen as a paragon of business ethics.",
    category: "考研高频"
  },
  {
    word: "partisan",
    phonetic: "[ˌpɑːtɪˈzæn]",
    enDefinition: "A strong supporter of a party, cause, or person.",
    zhDefinition: "adj. 党派性的；偏袒的",
    example: "The newspaper was criticized for its partisan coverage of the election.",
    category: "考研高频"
  },
  {
    word: "pathological",
    phonetic: "[ˌpæθəˈlɒdʒɪkl]",
    enDefinition: "Involving, caused by, or of the nature of a physical or mental disease.",
    zhDefinition: "adj. 病理学的；病态的",
    example: "His pathological fear of spiders made it difficult for him to go outside.",
    category: "考研高频"
  },
  {
    word: "pedantic",
    phonetic: "[pɪˈdæntɪk]",
    enDefinition: "Of or like a pedant; excessively concerned with minor details and rules or with displaying academic learning.",
    zhDefinition: "adj. 迂腐的；学究气的",
    example: "The professor's pedantic style of teaching bored most of the students.",
    category: "考研高频"
  },

  // --- 第29组 ---
  {
    word: "pellucid",
    phonetic: "[pəˈluːsɪd]",
    enDefinition: "Translucently clear; easily understood.",
    zhDefinition: "adj. 透明的；清晰易懂的",
    example: "The author's pellucid writing style made the complex subject easy to follow.",
    category: "考研高频"
  },
  {
    word: "perennial",
    phonetic: "[pəˈreniəl]",
    enDefinition: "Lasting or existing for a long or apparently infinite time; enduring or continually recurring.",
    zhDefinition: "adj. 常年的；长期的；永恒的",
    example: "Corruption is a perennial problem in the country's political system.",
    category: "考研高频"
  },
  {
    word: "perfidy",
    phonetic: "[ˈpɜːfɪdi]",
    enDefinition: "Deceitfulness; untrustworthiness.",
    zhDefinition: "n. 不忠；背信弃义",
    example: "The general was executed for his perfidy during the war.",
    category: "考研高频"
  },
  {
    word: "perfunctory",
    phonetic: "[pəˈfʌŋktəri]",
    enDefinition: "(Of an action or gesture) carried out with a minimum of effort or reflection.",
    zhDefinition: "adj. 敷衍的；草率的",
    example: "He gave the room a perfunctory cleaning before the guests arrived.",
    category: "考研高频"
  },
  {
    word: "permeate",
    phonetic: "[ˈpɜːmieɪt]",
    enDefinition: "Spread throughout (something); pervade.",
    zhDefinition: "v. 渗透；弥漫",
    example: "The smell of fresh coffee permeated the entire house.",
    category: "考研高频"
  },
  {
    word: "pervasive",
    phonetic: "[pəˈveɪsɪv]",
    enDefinition: "(Especially of an unwelcome influence or physical effect) spreading widely throughout an area or a group of people.",
    zhDefinition: "adj. 普遍的；到处渗透的",
    example: "The influence of social media is pervasive in modern society.",
    category: "考研高频"
  },
  {
    word: "phlegmatic",
    phonetic: "[fleɡˈmætɪk]",
    enDefinition: "(Of a person) having an unemotional and stolidly calm disposition.",
    zhDefinition: "adj. 冷淡的；迟钝的；冷静的",
    example: "He remained phlegmatic even in the face of extreme danger.",
    category: "考研高频"
  },
  {
    word: "piety",
    phonetic: "[ˈpaɪəti]",
    enDefinition: "The quality of being religious or reverent.",
    zhDefinition: "n. 虔诚；孝顺",
    example: "The monks were known for their piety and devotion to their faith.",
    category: "考研高频"
  },
  {
    word: "placate",
    phonetic: "[pləˈkeɪt]",
    enDefinition: "Make (someone) less angry or hostile.",
    zhDefinition: "v. 安抚；抚慰",
    example: "The government tried to placate the protesters by promising reforms.",
    category: "考研高频"
  },
  {
    word: "plastic",
    phonetic: "[ˈplæstɪk]",
    enDefinition: "Easily shaped or molded.",
    zhDefinition: "adj. 可塑的；易受影响的",
    example: "Young children's minds are very plastic and easily influenced by their surroundings.",
    category: "考研高频"
  },

  // --- 第30组 ---
  {
    word: "platitude",
    phonetic: "[ˈplætɪtjuːd]",
    enDefinition: "A remark or statement, especially one with a moral content, that has been used too often to be interesting or thoughtful.",
    zhDefinition: "n. 陈词滥调",
    example: "The speech was filled with platitudes about hard work and success.",
    category: "考研高频"
  },
  {
    word: "plethora",
    phonetic: "[ˈpleθərə]",
    enDefinition: "A large or excessive amount of (something).",
    zhDefinition: "n. 过剩；过多",
    example: "There is a plethora of information available on the internet, but not all of it is reliable.",
    category: "考研高频"
  },
  {
    word: "plummet",
    phonetic: "[ˈplʌmɪt]",
    enDefinition: "Fall or drop straight down at high speed.",
    zhDefinition: "v. 垂直落下；骤降",
    example: "Stock prices plummeted after the company announced its quarterly losses.",
    category: "考研高频"
  },
  {
    word: "pragmatic",
    phonetic: "[præɡˈmætɪk]",
    enDefinition: "Dealing with things sensibly and realistically in a way that is based on practical considerations.",
    zhDefinition: "adj. 务实的；实事求是的",
    example: "We need to take a pragmatic approach to the problem, rather than a theoretical one.",
    category: "考研高频"
  },
  {
    word: "precarious",
    phonetic: "[prɪˈkeəriəs]",
    enDefinition: "Not securely held or in position; dangerously likely to fall or collapse.",
    zhDefinition: "adj. 危险的；不稳固的",
    example: "The museum's financial position is precarious, and it may have to close.",
    category: "考研高频"
  },
  {
    word: "precipitate",
    phonetic: "[prɪˈsɪpɪteɪt]",
    enDefinition: "Cause (an event or situation, typically one that is bad or undesirable) to happen suddenly, unexpectedly, or prematurely.",
    zhDefinition: "v. 促成；使发生 adj. 突如其来的",
    example: "The assassination of the archduke precipitated the start of the war.",
    category: "考研高频"
  },
  {
    word: "precursor",
    phonetic: "[ˌpriːˈkɜːsə(r)]",
    enDefinition: "A person or thing that comes before another of the same kind; a forerunner.",
    zhDefinition: "n. 先驱；前兆",
    example: "The 19th-century movements were the precursors of modern feminism.",
    category: "考研高频"
  },
  {
    word: "presumptuous",
    phonetic: "[prɪˈzʌmptʃuəs]",
    enDefinition: "(Of a person or their behavior) failing to observe the limits of what is permitted or appropriate.",
    zhDefinition: "adj. 专横的；自以为是的；唐突的",
    example: "It would be presumptuous of me to tell you how to do your job.",
    category: "考研高频"
  },
  {
    word: "prevaricate",
    phonetic: "[prɪˈværɪkeɪt]",
    enDefinition: "Speak or act in an evasive way.",
    zhDefinition: "v. 推诿；撒谎；含糊其辞",
    example: "The politician continued to prevaricate when asked about his role in the scandal.",
    category: "考研高频"
  },
  {
    word: "pristine",
    phonetic: "[ˈprɪstiːn]",
    enDefinition: "In its original condition; unspoiled.",
    zhDefinition: "adj. 原始的；纯洁的；未受损的",
    example: "The island's beaches were pristine and untouched by tourism.",
    category: "考研高频"
  },


  // --- 第31组 ---
  {
    word: "abeyance",
    phonetic: "[əˈbeɪəns]",
    enDefinition: "A state of temporary disuse or suspension.",
    zhDefinition: "n. 中止；暂缓；搁置",
    example: "The project is being held in abeyance until the funding is secured.",
    category: "考研高频"
  },
  {
    word: "abstemious",
    phonetic: "[əbˈstiːmiəs]",
    enDefinition: "Not self-indulgent, especially when eating and drinking.",
    zhDefinition: "adj. 有节制的；适度的",
    example: "He led an abstemious life, rarely drinking alcohol or eating rich food.",
    category: "考研高频"
  },
  {
    word: "accolade",
    phonetic: "[ˈækəleɪd]",
    enDefinition: "An award or privilege granted as a special honor or as an acknowledgment of merit.",
    zhDefinition: "n. 嘉奖；赞许；荣誉",
    example: "The novel has received many accolades from critics around the world.",
    category: "考研高频"
  },
  {
    word: "acquiesce",
    phonetic: "[ˌækwiˈes]",
    enDefinition: "Accept something reluctantly but without protest.",
    zhDefinition: "v. 默许；勉强同意",
    example: "The director eventually acquiesced to the board's demands for budget cuts.",
    category: "考研高频"
  },
  {
    word: "adulterate",
    phonetic: "[əˈdʌltəreɪt]",
    enDefinition: "Render (something) poorer in quality by adding another substance.",
    zhDefinition: "v. 掺假；掺杂",
    example: "The company was fined for trying to adulterate its products with cheaper ingredients.",
    category: "考研高频"
  },
  {
    word: "aggrandize",
    phonetic: "[əˈɡrændaɪz]",
    enDefinition: "Increase the power, status, or wealth of.",
    zhDefinition: "v. 扩大；增加；夸大",
    example: "He used the crisis as an opportunity to aggrandize his own position in the company.",
    category: "考研高频"
  },
  {
    word: "alleviate",
    phonetic: "[əˈliːvieɪt]",
    enDefinition: "Make (suffering, deficiency, or a problem) less severe.",
    zhDefinition: "v. 减轻；缓和",
    example: "The new law is intended to alleviate the housing shortage in the city.",
    category: "考研高频"
  },
  {
    word: "amalgamate",
    phonetic: "[əˈmælɡəmeɪt]",
    enDefinition: "Combine or unite to form one organization or structure.",
    zhDefinition: "v. 合并；混合",
    example: "The two schools decided to amalgamate to save on administrative costs.",
    category: "考研高频"
  },
  {
    word: "ambiguous",
    phonetic: "[æmˈbɪɡjuəs]",
    enDefinition: "Open to more than one interpretation; not having one obvious meaning.",
    zhDefinition: "adj. 模棱两可的；含糊不清的",
    example: "The government's stance on the issue remains ambiguous and confusing.",
    category: "考研高频"
  },
  {
    word: "amorphous",
    phonetic: "[əˈmɔːfəs]",
    enDefinition: "Without a clearly defined shape or form.",
    zhDefinition: "adj. 无固定形状的；无组织的",
    example: "The organization was an amorphous group of volunteers with no clear leader.",
    category: "考研高频"
  },

  // --- 第32组 ---
  {
    word: "anachronism",
    phonetic: "[əˈnækrənɪzəm]",
    enDefinition: "A thing belonging or appropriate to a period other than that in which it exists.",
    zhDefinition: "n. 时代错误；不合时宜的人或事",
    example: "In today's digital age, the manual typewriter is seen as an anachronism.",
    category: "考研高频"
  },
  {
    word: "analogous",
    phonetic: "[əˈnæləɡəs]",
    enDefinition: "Comparable in certain respects, typically in a way which makes clearer the nature of the things compared.",
    zhDefinition: "adj. 类似的；可比拟的",
    example: "The relationship between a teacher and student is analogous to that between a parent and child.",
    category: "考研高频"
  },
  {
    word: "anarchy",
    phonetic: "[ˈænəki]",
    enDefinition: "A state of disorder due to absence or non-recognition of authority.",
    zhDefinition: "n. 无政府状态；混乱",
    example: "The sudden withdrawal of the troops led to widespread anarchy in the capital.",
    category: "考研高频"
  },
  {
    word: "anomalous",
    phonetic: "[əˈnɒmələs]",
    enDefinition: "Deviating from what is standard, normal, or expected.",
    zhDefinition: "adj. 异常的；不规则的",
    example: "The researchers were puzzled by the anomalous results of the experiment.",
    category: "考研高频"
  },
  {
    word: "appease",
    phonetic: "[əˈpiːz]",
    enDefinition: "Pacify or placate (someone) by acceding to their demands.",
    zhDefinition: "v. 安抚；让步；姑息",
    example: "The government tried to appease the protesters by promising lower taxes.",
    category: "考研高频"
  },
  {
    word: "apprise",
    phonetic: "[əˈpraɪz]",
    enDefinition: "Inform or tell (someone).",
    zhDefinition: "v. 通知；告知",
    example: "I thought it was important to apprise you of the latest developments in the case.",
    category: "考研高频"
  },
  {
    word: "approbation",
    phonetic: "[ˌæprəˈbeɪʃn]",
    enDefinition: "Approval or praise.",
    zhDefinition: "n. 认可；赞许",
    example: "The plan was met with the general approbation of the committee.",
    category: "考研高频"
  },
  {
    word: "appropriate",
    phonetic: "[əˈprəʊprieɪt]",
    enDefinition: "Take (something) for one's own use, typically without the owner's permission.",
    zhDefinition: "v. 拨出（款项）；挪用；占用",
    example: "The town council has appropriated funds for the new library.",
    category: "考研高频"
  },
  {
    word: "arduous",
    phonetic: "[ˈɑːdjuəs]",
    enDefinition: "Involving or requiring strenuous effort; difficult and tiring.",
    zhDefinition: "adj. 艰巨的；努力的；费力的",
    example: "The climbers faced an arduous journey to reach the summit of the mountain.",
    category: "考研高频"
  },
  {
    word: "artless",
    phonetic: "[ˈɑːtləs]",
    enDefinition: "Without guile or deception; simple and natural.",
    zhDefinition: "adj. 天真朴实的；自然的；无虚饰的",
    example: "Her artless beauty and simple manners charmed everyone she met.",
    category: "考研高频"
  },

  // --- 第33组 ---
  {
    word: "ascetic",
    phonetic: "[əˈsetɪk]",
    enDefinition: "Characterized by or suggesting the practice of severe self-discipline and abstention from all forms of indulgence.",
    zhDefinition: "adj. 苦行的；禁欲主义的",
    example: "The monks lived an ascetic life, devoted entirely to prayer and study.",
    category: "考研高频"
  },
  {
    word: "assiduous",
    phonetic: "[əˈsɪdʒuəs]",
    enDefinition: "Showing great care and perseverance.",
    zhDefinition: "adj. 刻苦的；勤勉的",
    example: "She was an assiduous student who spent every weekend in the library.",
    category: "考研高频"
  },
  {
    word: "attenuate",
    phonetic: "[əˈtenjueɪt]",
    enDefinition: "Reduce the force, effect, or value of.",
    zhDefinition: "v. 变细；减弱；贬值",
    example: "The government's new policies are intended to attenuate the effects of inflation.",
    category: "考研高频"
  },
  {
    word: "aver",
    phonetic: "[əˈvɜː(r)]",
    enDefinition: "State or assert to be the case.",
    zhDefinition: "v. 断言；坚称",
    example: "He continued to aver his innocence, despite the evidence against him.",
    category: "考研高频"
  },
  {
    word: "banal",
    phonetic: "[bəˈnɑːl]",
    enDefinition: "So lacking in originality as to be obvious and boring.",
    zhDefinition: "adj. 平庸的；陈腐的",
    example: "The movie was criticized for its banal dialogue and predictable plot.",
    category: "考研高频"
  },
  {
    word: "beneficent",
    phonetic: "[bəˈnefɪsnt]",
    enDefinition: "(Of a person) generous or doing good.",
    zhDefinition: "adj. 慈善的；行善的",
    example: "The organization's beneficent activities have helped thousands of people in need.",
    category: "考研高频"
  },
  {
    word: "boorish",
    phonetic: "[ˈbʊərɪʃ]",
    enDefinition: "Rough and bad-mannered; coarse.",
    zhDefinition: "adj. 粗野的；无礼的",
    example: "His boorish behavior at the dinner party embarrassed his wife.",
    category: "考研高频"
  },
  {
    word: "burnish",
    phonetic: "[ˈbɜːnɪʃ]",
    enDefinition: "Polish (something, especially metal) by rubbing.",
    zhDefinition: "v. 磨光；擦亮；提升（形象）",
    example: "The company is trying to burnish its image after the recent scandal.",
    category: "考研高频"
  },
  {
    word: "buttress",
    phonetic: "[ˈbʌtrəs]",
    enDefinition: "Increase the strength of or justification for; reinforce.",
    zhDefinition: "v. 支持；巩固 n. 扶壁",
    example: "The discovery of new evidence served to buttress the prosecutor's case.",
    category: "考研高频"
  },
  {
    word: "castigation",
    phonetic: "[ˌkæstɪˈɡeɪʃn]",
    enDefinition: "Severe criticism or punishment.",
    zhDefinition: "n. 严厉批评；谴责",
    example: "The manager's public castigation of his staff was seen as unprofessional.",
    category: "考研高频"
  },

  // --- 第34组 ---
  {
    word: "chicanery",
    phonetic: "[ʃɪˈkeɪnəri]",
    enDefinition: "The use of trickery to achieve a political, financial, or legal purpose.",
    zhDefinition: "n. 欺诈；诡计",
    example: "The election was marred by allegations of chicanery and voter intimidation.",
    category: "考研高频"
  },
  {
    word: "coagulate",
    phonetic: "[kəʊˈæɡjuleɪt]",
    enDefinition: "(Of a fluid, especially blood) change to a solid or semi-solid state.",
    zhDefinition: "v. 凝结；结块",
    example: "The medicine helps the blood to coagulate more quickly after an injury.",
    category: "考研高频"
  },
  {
    word: "coda",
    phonetic: "[ˈkəʊdə]",
    enDefinition: "A concluding event, remark, or section.",
    zhDefinition: "n. 终曲；（文章或事件的）结尾",
    example: "The final chapter serves as a moving coda to the entire novel.",
    category: "考研高频"
  },
  {
    word: "complaisant",
    phonetic: "[kəmˈpleɪznt]",
    enDefinition: "Willing to please others; obliging; agreeable.",
    zhDefinition: "adj. 顺从的；讨好的；殷勤的",
    example: "She was too complaisant and often agreed to things she didn't really want to do.",
    category: "考研高频"
  },
  {
    word: "compliant",
    phonetic: "[kəmˈplaɪənt]",
    enDefinition: "Inclined to agree with others or obey rules, especially to an excessive degree; acquiescent.",
    zhDefinition: "adj. 服从的；顺从的；符合要求的",
    example: "The company was found to be fully compliant with the new environmental regulations.",
    category: "考研高频"
  },
  {
    word: "conciliatory",
    phonetic: "[kənˈsɪliətəri]",
    enDefinition: "Intended or likely to placate or pacify.",
    zhDefinition: "adj. 抚慰的；调解的",
    example: "The minister took a conciliatory approach in his meeting with the opposition leaders.",
    category: "考研高频"
  },
  {
    word: "confound",
    phonetic: "[kənˈfaʊnd]",
    enDefinition: "Cause surprise or confusion in (someone), especially by acting against their expectations.",
    zhDefinition: "v. 使困惑；挫败；证明...有误",
    example: "The sudden success of the new product confounded the industry experts.",
    category: "考研高频"
  },
  {
    word: "connoisseur",
    phonetic: "[ˌkɒnəˈsɜː(r)]",
    enDefinition: "An expert judge in matters of taste.",
    zhDefinition: "n. 鉴赏家；内行",
    example: "He is a connoisseur of fine wines and has a large collection in his cellar.",
    category: "考研高频"
  },
  {
    word: "contention",
    phonetic: "[kənˈtenʃn]",
    enDefinition: "Heated disagreement.",
    zhDefinition: "n. 争论；主张；竞争",
    example: "The issue of climate change remains a source of great contention among politicians.",
    category: "考研高频"
  },
  {
    word: "contentious",
    phonetic: "[kənˈtenʃəs]",
    enDefinition: "Causing or likely to cause an argument; controversial.",
    zhDefinition: "adj. 引起争论的；爱争论的",
    example: "The decision to build a new airport was highly contentious and led to many protests.",
    category: "考研高频"
  },

  // --- 第35组 ---
  {
    word: "contrite",
    phonetic: "[kənˈtraɪt]",
    enDefinition: "Feeling or expressing remorse or penitence; affected by guilt.",
    zhDefinition: "adj. 悔悟的；抱歉的",
    example: "He apologized in a contrite tone for the mistake he had made.",
    category: "考研高频"
  },
  {
    word: "converge",
    phonetic: "[kənˈvɜːdʒ]",
    enDefinition: "(Of several people or things) come together from different directions so eventually to meet.",
    zhDefinition: "v. 汇聚；趋同",
    example: "The two rivers converge at a point just a few miles from the sea.",
    category: "考研高频"
  },
  {
    word: "decorum",
    phonetic: "[dɪˈkɔːrəm]",
    enDefinition: "Behavior in keeping with good taste and propriety.",
    zhDefinition: "n. 端庄；礼貌；得体",
    example: "The judge insisted on absolute decorum in the courtroom during the trial.",
    category: "考研高频"
  },
  {
    word: "default",
    phonetic: "[dɪˈfɔːlt]",
    enDefinition: "Failure to fulfill an obligation, especially to repay a loan or appear in a court of law.",
    zhDefinition: "v./n. 违约；拖欠；默认",
    example: "The company is in danger of defaulting on its massive debts.",
    category: "考研高频"
  },
  {
    word: "delineate",
    phonetic: "[dɪˈlɪnieɪt]",
    enDefinition: "Describe or portray (something) precisely.",
    zhDefinition: "v. 描绘；轮廓；详细阐明",
    example: "The report clearly delineates the steps that need to be taken to solve the problem.",
    category: "考研高频"
  },
  {
    word: "denouement",
    phonetic: "[deɪˈnuːmɒ̃]",
    enDefinition: "The final part of a play, movie, or narrative in which the strands of the plot are drawn together and matters are explained or resolved.",
    zhDefinition: "n. （小说、戏剧的）结局；收场",
    example: "The film's denouement was both unexpected and deeply satisfying.",
    category: "考研高频"
  },
  {
    word: "derivative",
    phonetic: "[dɪˈrɪvətɪv]",
    enDefinition: "(Typically of an artist or work of art) imitative of the work of another person, and usually disapproved of for that reason.",
    zhDefinition: "adj. 模仿的；衍生的 n. 派生物",
    example: "The critic dismissed the new band's music as derivative and unoriginal.",
    category: "考研高频"
  },
  {
    word: "desiccate",
    phonetic: "[ˈdesɪkeɪt]",
    enDefinition: "Remove the moisture from (something, especially food), typically in order to preserve it.",
    zhDefinition: "v. 使脱水；变干",
    example: "The intense heat of the sun had desiccated the soil, making it impossible to farm.",
    category: "考研高频"
  },
  {
    word: "deterrent",
    phonetic: "[dɪˈterənt]",
    enDefinition: "A thing that discourages or is intended to discourage someone from doing something.",
    zhDefinition: "n. 威慑因素；制止物",
    example: "High fines serve as a deterrent to companies that might otherwise break the law.",
    category: "考研高频"
  },
  {
    word: "digression",
    phonetic: "[daɪˈɡreʃn]",
    enDefinition: "A temporary departure from the main subject in speech or writing.",
    zhDefinition: "n. 离题；偏离",
    example: "After a short digression about his childhood, the speaker returned to the main topic.",
    category: "考研高频"
  },

  // --- 第36组 ---
  {
    word: "dirge",
    phonetic: "[dɜːdʒ]",
    enDefinition: "A lament for the dead, especially one forming part of a funeral rite.",
    zhDefinition: "n. 挽歌；哀悼歌",
    example: "The slow, mournful dirge filled the cathedral during the memorial service.",
    category: "考研高频"
  },
  {
    word: "disjointed",
    phonetic: "[dɪsˈdʒɔɪntɪd]",
    enDefinition: "Lacking a coherent sequence or connection.",
    zhDefinition: "adj. 脱节的；支离破碎的；杂乱无章的",
    example: "The witness gave a disjointed account of the events that was difficult to follow.",
    category: "考研高频"
  },
  {
    word: "dissolution",
    phonetic: "[ˌdɪsəˈluːʃn]",
    enDefinition: "The closing down or dismissal of an assembly, partnership, or official body.",
    zhDefinition: "n. 分解；解散；终结",
    example: "The dissolution of the Soviet Union led to the creation of many new independent states.",
    category: "考研高频"
  },
  {
    word: "distend",
    phonetic: "[dɪˈstend]",
    enDefinition: "Swell or cause to swell by pressure from inside.",
    zhDefinition: "v. 膨胀；扩张",
    example: "The patient's stomach was distended due to the buildup of fluid.",
    category: "考研高频"
  },
  {
    word: "distill",
    phonetic: "[dɪˈstɪl]",
    enDefinition: "Extract the essential meaning or most important aspects of.",
    zhDefinition: "v. 蒸馏；提炼；吸取精华",
    example: "He managed to distill his years of experience into a single, short book.",
    category: "考研高频"
  },
  {
    word: "diverge",
    phonetic: "[daɪˈvɜːdʒ]",
    enDefinition: "(Of a road, route, or line) separate from another route and go in a different direction.",
    zhDefinition: "v. 分歧；偏离；离题",
    example: "The interests of the two companies began to diverge as they grew larger.",
    category: "考研高频"
  },
  {
    word: "divest",
    phonetic: "[daɪˈvest]",
    enDefinition: "Deprive (someone) of power, rights, or possessions.",
    zhDefinition: "v. 剥夺；解除；抛售（资产）",
    example: "The court ordered the company to divest itself of some of its subsidiaries.",
    category: "考研高频"
  },
  {
    word: "dormant",
    phonetic: "[ˈdɔːmənt]",
    enDefinition: "Having normal physical functions suspended or slowed down for a period of time; in or as if in a deep sleep.",
    zhDefinition: "adj. 休眠的；潜伏的",
    example: "The volcano has been dormant for hundreds of years but could erupt at any time.",
    category: "考研高频"
  },
  {
    word: "dupe",
    phonetic: "[djuːp]",
    enDefinition: "Deceive; trick.",
    zhDefinition: "v. 欺骗；愚弄 n. 上当者",
    example: "Many innocent people were duped into investing in the fraudulent scheme.",
    category: "考研高频"
  },
  {
    word: "embellish",
    phonetic: "[ɪmˈbelɪʃ]",
    enDefinition: "Make (a statement or story) more interesting or entertaining by adding extra details, especially ones that are not true.",
    zhDefinition: "v. 装饰；润饰；修饰",
    example: "He tended to embellish his stories to make himself sound more heroic.",
    category: "考研高频"
  },

  // --- 第37组 ---
  {
    word: "emulate",
    phonetic: "[ˈemjuleɪt]",
    enDefinition: "Match or surpass (a person or achievement), typically by imitation.",
    zhDefinition: "v. 效仿；模仿；努力赶上",
    example: "Many young players try to emulate the style of their favorite professional athletes.",
    category: "考研高频"
  },
  {
    word: "enumerate",
    phonetic: "[ɪˈnjuːməreɪt]",
    enDefinition: "Mention (a number of things) one by one.",
    zhDefinition: "v. 列举；枚举",
    example: "She proceeded to enumerate all the reasons why the plan would not work.",
    category: "考研高频"
  },
  {
    word: "equanimity",
    phonetic: "[ˌekwəˈnɪməti]",
    enDefinition: "Mental calmness, composure, and evenness of temper, especially in a difficult situation.",
    zhDefinition: "n. 镇静；沉着",
    example: "He handled the crisis with remarkable equanimity, never losing his temper.",
    category: "考研高频"
  },
  {
    word: "equivocal",
    phonetic: "[ɪˈkwɪvəkl]",
    enDefinition: "Open to more than one interpretation; ambiguous.",
    zhDefinition: "adj. 模棱两可的；含糊其辞的",
    example: "The results of the study were equivocal and didn't lead to a clear conclusion.",
    category: "考研高频"
  },
  {
    word: "exegesis",
    phonetic: "[ˌeksɪˈdʒiːsɪs]",
    enDefinition: "Critical explanation or interpretation of a text, especially Scripture.",
    zhDefinition: "n. 诠释；解释（尤指圣经）",
    example: "The scholar provided a detailed exegesis of the ancient poem.",
    category: "考研高频"
  },
  {
    word: "exhort",
    phonetic: "[ɪɡˈzɔːt]",
    enDefinition: "Strongly encourage or urge (someone) to do something.",
    zhDefinition: "v. 劝诫；敦促",
    example: "The general exhorted his troops to fight with courage and honor.",
    category: "考研高频"
  },
  {
    word: "exponent",
    phonetic: "[ɪkˈspəʊnənt]",
    enDefinition: "A person who supports an idea or theory and tries to persuade others of its truth or value.",
    zhDefinition: "n. 倡导者；说明者；指数",
    example: "He was a leading exponent of the theory of evolution in his day.",
    category: "考研高频"
  },
  {
    word: "facile",
    phonetic: "[ˈfæsaɪl]",
    enDefinition: "(Especially of a theory or argument) appearing neat and comprehensive only by ignoring the true complexities of an issue; superficial.",
    zhDefinition: "adj. 肤浅的；轻率的；容易的",
    example: "The politician's facile solution to the complex problem was dismissed by experts.",
    category: "考研高频"
  },
  {
    word: "fallacy",
    phonetic: "[ˈfæləsi]",
    enDefinition: "A mistaken belief, especially one based on unsound argument.",
    zhDefinition: "n. 谬误；谬论",
    example: "It is a common fallacy that money alone can bring happiness.",
    category: "考研高频"
  },
  {
    word: "fawning",
    phonetic: "[ˈfɔːnɪŋ]",
    enDefinition: "Displaying exaggerated flattery or affection; obsequious.",
    zhDefinition: "adj. 奉承的；讨好的",
    example: "He was surrounded by fawning admirers who hung on his every word.",
    category: "考研高频"
  },

  // --- 第38组 ---
  {
    word: "flag",
    phonetic: "[flæɡ]",
    enDefinition: "Become tired, weaker, or less enthusiastic.",
    zhDefinition: "v. 变得疲倦；衰退；减弱",
    example: "By the end of the long race, many of the runners began to flag.",
    category: "考研高频"
  },
  {
    word: "fledgling",
    phonetic: "[ˈfledʒlɪŋ]",
    enDefinition: "A person or organization that is immature, inexperienced, or underdeveloped.",
    zhDefinition: "n. 初出茅庐的人/机构 adj. 新手的；刚开始的",
    example: "The fledgling company is struggling to compete with its larger rivals.",
    category: "考研高频"
  },
  {
    word: "frugality",
    phonetic: "[fruːˈɡæləti]",
    enDefinition: "The quality of being economical with money or food; thriftiness.",
    zhDefinition: "n. 节俭；朴素",
    example: "His frugality allowed him to save enough money to retire early.",
    category: "考研高频"
  },
  {
    word: "futile",
    phonetic: "[ˈfjuːtaɪl]",
    enDefinition: "Incapable of producing any useful result; pointless.",
    zhDefinition: "adj. 无用的；徒劳的",
    example: "It is futile to argue with someone who has already made up their mind.",
    category: "考研高频"
  },
  {
    word: "gouge",
    phonetic: "[ɡaʊdʒ]",
    enDefinition: "Overcharge; swindle.",
    zhDefinition: "v. 敲竹杠；诈骗；（用半圆凿）挖",
    example: "The hotel was accused of trying to gouge customers during the holiday season.",
    category: "考研高频"
  },
  {
    word: "grandiloquent",
    phonetic: "[ɡrænˈdɪləkwənt]",
    enDefinition: "Pompous or extravagant in language, style, or manner, especially in a way that is intended to impress.",
    zhDefinition: "adj. 夸张的；言辞浮夸的",
    example: "The speaker's grandiloquent style made his simple message sound much more important than it was.",
    category: "考研高频"
  },
  {
    word: "guileless",
    phonetic: "[ˈɡaɪlləs]",
    enDefinition: "Devoid of guile; innocent and without deception.",
    zhDefinition: "adj. 厚道的；老实的；不诡诈的",
    example: "She had a guileless nature and believed everything people told her.",
    category: "考研高频"
  },
  {
    word: "gullible",
    phonetic: "[ˈɡʌləbl]",
    enDefinition: "Easily persuaded to believe something; credulous.",
    zhDefinition: "adj. 易受骗的；轻信的",
    example: "He was so gullible that he fell for the same trick twice.",
    category: "考研高频"
  },
  {
    word: "homogeneous",
    phonetic: "[ˌhɒməˈdʒiːniəs]",
    enDefinition: "Of the same kind; alike.",
    zhDefinition: "adj. 同质的；均匀的",
    example: "The population of the small town was very homogeneous, with little ethnic diversity.",
    category: "考研高频"
  },
  {
    word: "iconoclastic",
    phonetic: "[aɪˌkɒnəˈklæstɪk]",
    enDefinition: "Characterized by attack on cherished beliefs or institutions.",
    zhDefinition: "adj. 打破旧习的；反传统的",
    example: "The artist was known for his iconoclastic views on modern society.",
    category: "考研高频"
  },

  // --- 第39组 ---
  {
    word: "idolatry",
    phonetic: "[aɪˈdɒlətri]",
    enDefinition: "Extreme admiration, love, or reverence for something or someone.",
    zhDefinition: "n. 盲目崇拜；偶像崇拜",
    example: "The public's idolatry of the pop star reached almost religious proportions.",
    category: "考研高频"
  },
  {
    word: "impair",
    phonetic: "[ɪmˈpeə(r)]",
    enDefinition: "Weaken or damage something (especially a human faculty or function).",
    zhDefinition: "v. 损害；削弱",
    example: "Lack of sleep can seriously impair your ability to think clearly.",
    category: "考研高频"
  },
  {
    word: "impassive",
    phonetic: "[ɪmˈpæsɪv]",
    enDefinition: "Not feeling or showing emotion.",
    zhDefinition: "adj. 冷淡的；不动声色的",
    example: "He remained impassive throughout the trial, showing no reaction to the verdict.",
    category: "考研高频"
  },
  {
    word: "impecunious",
    phonetic: "[ˌɪmpɪˈkjuːniəs]",
    enDefinition: "Having little or no money.",
    zhDefinition: "adj. 贫穷的；没钱的",
    example: "He came from an impecunious family and had to work hard to pay for college.",
    category: "考研高频"
  },
  {
    word: "impede",
    phonetic: "[ɪmˈpiːd]",
    enDefinition: "Delay or prevent (someone or something) by obstructing them; hinder.",
    zhDefinition: "v. 阻碍；妨碍",
    example: "Bad weather condition impeded the progress of the rescue workers.",
    category: "考研高频"
  },
  {
    word: "impermeable",
    phonetic: "[ɪmˈpɜːmiəbl]",
    enDefinition: "Not allowing fluid to pass through.",
    zhDefinition: "adj. 不渗透的；不能透过的",
    example: "The raincoat is made of a special impermeable fabric to keep you dry.",
    category: "考研高频"
  },
  {
    word: "imperturbable",
    phonetic: "[ˌɪmpəˈtɜːbəbl]",
    enDefinition: "Unable to be upset or excited; calm.",
    zhDefinition: "adj. 冷静的；泰然自若的",
    example: "She is an imperturbable leader who remains calm even in the middle of a crisis.",
    category: "考研高频"
  },
  {
    word: "implicit",
    phonetic: "[ɪmˈplɪsɪt]",
    enDefinition: "Implied though not plainly expressed.",
    zhDefinition: "adj. 含蓄的；暗含的；盲目的",
    example: "There was an implicit agreement between the two companies not to compete on price.",
    category: "考研高频"
  },
  {
    word: "improbity",
    phonetic: "[ɪmˈprəʊbəti]",
    enDefinition: "Wickedness; lack of honesty or moral principles.",
    zhDefinition: "n. 不正直；不廉洁",
    example: "The politician was forced to resign due to allegations of financial improbity.",
    category: "考研高频"
  },
  {
    word: "incarnate",
    phonetic: "[ɪnˈkɑːneɪt]",
    enDefinition: "(Especially of a deity or spirit) embodied in flesh; in human form.",
    zhDefinition: "adj. 人体化的；化身的 v. 体现",
    example: "He seemed to be evil incarnate, with no regard for human life.",
    category: "考研高频"
  },

  // --- 第40组 ---
  {
    word: "incursion",
    phonetic: "[ɪnˈkɜːʃn]",
    enDefinition: "An invasion or attack, especially a sudden or brief one.",
    zhDefinition: "n. 侵入；袭击",
    example: "The military made a brief incursion into the enemy territory to gather intelligence.",
    category: "考研高频"
  },
  {
    word: "indefatigable",
    phonetic: "[ˌɪndɪˈfætɪɡəbl]",
    enDefinition: "(Of a person or their efforts) persisting tirelessly.",
    zhDefinition: "adj. 不知疲倦的；不屈不挠的",
    example: "She was an indefatigable worker who never seemed to need a break.",
    category: "考研高频"
  },
  {
    word: "indigence",
    phonetic: "[ˈɪndɪdʒəns]",
    enDefinition: "A state of extreme poverty.",
    zhDefinition: "n. 贫穷；赤贫",
    example: "The economic crisis has plunged many families into a state of indigence.",
    category: "考研高频"
  },
  {
    word: "inexorable",
    phonetic: "[ɪnˈeksərəbl]",
    enDefinition: "Impossible to stop or prevent.",
    zhDefinition: "adj. 不可阻挡的；无情的",
    example: "The inexorable rise in sea levels is a major threat to coastal cities.",
    category: "考研高频"
  },
  {
    word: "ingenuous",
    phonetic: "[ɪnˈdʒenjuəs]",
    enDefinition: "(Of a person or action) innocent and unsuspecting.",
    zhDefinition: "adj. 天真的；坦率的",
    example: "It was ingenuous of her to believe that everyone would always tell her the truth.",
    category: "考研高频"
  },
  {
    word: "inherent",
    phonetic: "[ɪnˈhɪərənt]",
    enDefinition: "Existing in something as a permanent, essential, or characteristic attribute.",
    zhDefinition: "adj. 固有的；内在的",
    example: "There are inherent risks in any business venture.",
    category: "考研高频"
  },
  {
    word: "insalubrious",
    phonetic: "[ˌɪnsəˈluːbriəs]",
    enDefinition: "(Of a place) seedy and unwholesome.",
    zhDefinition: "adj. 对身体有害的；不健康的（环境等）",
    example: "They were forced to live in insalubrious conditions with no clean water or electricity.",
    category: "考研高频"
  },
  {
    word: "intemperate",
    phonetic: "[ɪnˈtempərət]",
    enDefinition: "Having or showing a lack of self-control; immoderate.",
    zhDefinition: "adj. 无节制的；过度的",
    example: "His intemperate language during the debate lost him many supporters.",
    category: "考研高频"
  },
  {
    word: "invective",
    phonetic: "[ɪnˈvektɪv]",
    enDefinition: "Insulting, abusive, or highly critical language.",
    zhDefinition: "n. 谩骂；抨击",
    example: "The speaker's speech was filled with invective against his political rivals.",
    category: "考研高频"
  },
  {
    word: "inveigle",
    phonetic: "[ɪnˈveɪɡl]",
    enDefinition: "Persuade (someone) to do something by means of deception or flattery.",
    zhDefinition: "v. 诱骗；诱使",
    example: "He managed to inveigle his way into the exclusive club by pretending to be a millionaire.",
    category: "考研高频"
  },


  // --- 第41组 ---
  {
    word: "preclude",
    phonetic: "[prɪˈkluːd]",
    enDefinition: "Prevent from happening; make impossible.",
    zhDefinition: "v. 排除；妨碍；阻止",
    example: "The lack of funds precludes any further research at this stage.",
    category: "考研高频"
  },
  {
    word: "predilection",
    phonetic: "[ˌpriːdɪˈlekʃn]",
    enDefinition: "A preference or special liking for something; a bias in favor of something.",
    zhDefinition: "n. 偏爱；嗜好",
    example: "She has a predilection for 19th-century French literature.",
    category: "考研高频"
  },
  {
    word: "profligate",
    phonetic: "[ˈprɒflɪɡət]",
    enDefinition: "Recklessly extravagant or wasteful in the use of resources.",
    zhDefinition: "adj. 挥霍的；浪费的；放荡的",
    example: "The government was criticized for its profligate spending on luxury projects.",
    category: "考研高频"
  },
  {
    word: "proscribe",
    phonetic: "[prəˈskraɪb]",
    enDefinition: "Forbid, especially by law.",
    zhDefinition: "v. 禁止；剥夺...的公权",
    example: "Certain chemicals are proscribed because of their harmful effects on the environment.",
    category: "考研高频"
  },
  {
    word: "prudent",
    phonetic: "[ˈpruːdnt]",
    enDefinition: "Acting with or showing care and thought for the future.",
    zhDefinition: "adj. 审慎的；精明的；节俭的",
    example: "It is always prudent to have some money saved for emergencies.",
    category: "考研高频"
  },
  {
    word: "quiescent",
    phonetic: "[kwiˈesnt]",
    enDefinition: "In a state or period of inactivity or dormancy.",
    zhDefinition: "adj. 静止的；沉默的；休眠的",
    example: "The economic situation remained quiescent for several months before the sudden boom.",
    category: "考研高频"
  },
  {
    word: "quixotic",
    phonetic: "[kwɪkˈsɒtɪk]",
    enDefinition: "Exceedingly idealistic; unrealistic and impractical.",
    zhDefinition: "adj. 不切实际的；空想的",
    example: "His plan to eliminate poverty overnight was seen as noble but quixotic.",
    category: "考研高频"
  },
  {
    word: "quotidian",
    phonetic: "[kwɒˈtɪdiən]",
    enDefinition: "Of or occurring every day; daily.",
    zhDefinition: "adj. 每日的；平凡的；庸俗的",
    example: "The novel captures the beauty in the quotidian lives of ordinary people.",
    category: "考研高频"
  },
  {
    word: "recondite",
    phonetic: "[ˈrekəndaɪt]",
    enDefinition: "(Of a subject or knowledge) little known; abstruse.",
    zhDefinition: "adj. 深奥的；晦涩的；冷僻的",
    example: "The book explores recondite aspects of medieval history.",
    category: "考研高频"
  },
  {
    word: "refractory",
    phonetic: "[rɪˈfræktəri]",
    enDefinition: "Stubborn or unmanageable.",
    zhDefinition: "adj. 倔强的；难管教的；耐火的",
    example: "The refractory child refused to listen to his parents' advice.",
    category: "考研高频"
  },

  // --- 第42组 ---
  {
    word: "rejoinder",
    phonetic: "[rɪˈdʒɔɪndə(r)]",
    enDefinition: "A reply, especially a sharp or witty one.",
    zhDefinition: "n. 回答；反驳",
    example: "She had a ready rejoinder for every criticism her boss made.",
    category: "考研高频"
  },
  {
    word: "remonstrate",
    phonetic: "[rɪˈmɒnstreɪt]",
    enDefinition: "Make a forcefully reproachful protest.",
    zhDefinition: "v. 抗议；抱怨；劝诫",
    example: "He went to the manager to remonstrate about the poor service.",
    category: "考研高频"
  },
  {
    word: "replete",
    phonetic: "[rɪˈpliːt]",
    enDefinition: "Filled or well-supplied with something.",
    zhDefinition: "adj. 充满的；装满的；吃饱的",
    example: "The museum is replete with priceless artifacts from ancient Rome.",
    category: "考研高频"
  },
  {
    word: "rescind",
    phonetic: "[rɪˈsɪnd]",
    enDefinition: "Revoke, cancel, or repeal (a law, order, or agreement).",
    zhDefinition: "v. 废除；撤销；取消",
    example: "The company eventually decided to rescind the controversial new policy.",
    category: "考研高频"
  },
  {
    word: "restive",
    phonetic: "[ˈrestɪv]",
    enDefinition: "(Of a person) unable to keep still or silent and becoming increasingly difficult to control, especially because of impatience, dissatisfaction, or boredom.",
    zhDefinition: "adj. 焦躁不安的；难以驾驭的",
    example: "The crowd became restive as they waited for the delayed concert to start.",
    category: "考研高频"
  },
  {
    word: "rhetoric",
    phonetic: "[ˈretərɪk]",
    enDefinition: "The art of effective or persuasive speaking or writing, especially the use of figures of speech and other compositional techniques.",
    zhDefinition: "n. 修辞；华丽的辞藻；虚夸的话",
    example: "The politician's speech was full of empty rhetoric and vague promises.",
    category: "考研高频"
  },
  {
    word: "sacrosanct",
    phonetic: "[ˈsækrəʊsæŋkt]",
    enDefinition: "(Especially of a principle, place, or routine) regarded as too important or valuable to be interfered with.",
    zhDefinition: "adj. 神圣不可侵犯的",
    example: "In this country, the freedom of the press is considered sacrosanct.",
    category: "考研高频"
  },
  {
    word: "sanguine",
    phonetic: "[ˈsæŋɡwɪn]",
    enDefinition: "Optimistic or positive, especially in an apparently bad or difficult situation.",
    zhDefinition: "adj. 乐观的；面色红润的",
    example: "Despite the low sales figures, the manager remained sanguine about the company's future.",
    category: "考研高频"
  },
  {
    word: "sardonic",
    phonetic: "[sɑːˈdɒnɪk]",
    enDefinition: "Grimly mocking or cynical.",
    zhDefinition: "adj. 讥讽的；嘲笑的",
    example: "He gave a sardonic smile when he heard about his rival's failure.",
    category: "考研高频"
  },
  {
    word: "scintilla",
    phonetic: "[sɪnˈtɪlə]",
    enDefinition: "A tiny trace or spark of a specified quality or feeling.",
    zhDefinition: "n. 微量；火花；点滴",
    example: "There is not a scintilla of truth in the rumors circulating about him.",
    category: "考研高频"
  },

  // --- 第43组 ---
  {
    word: "sentient",
    phonetic: "[ˈsentiənt]",
    enDefinition: "Able to perceive or feel things.",
    zhDefinition: "adj. 有感觉能力的；有知觉的",
    example: "Is it possible for machines ever to become truly sentient?",
    category: "考研高频"
  },
  {
    word: "sinecure",
    phonetic: "[ˈsaɪnɪkjʊə(r)]",
    enDefinition: "A position requiring little or no work but giving the holder status or financial benefit.",
    zhDefinition: "n. 闲职；挂名差事",
    example: "He was given a sinecure in the local government as a reward for his political support.",
    category: "考研高频"
  },
  {
    word: "sobriety",
    phonetic: "[səˈbraɪəti]",
    enDefinition: "The state of being sober; the quality of being staid or serious.",
    zhDefinition: "n. 清醒；冷静；节制",
    example: "The situation requires a high degree of sobriety and careful planning.",
    category: "考研高频"
  },
  {
    word: "solicitous",
    phonetic: "[səˈlɪsɪtəs]",
    enDefinition: "Showing interest or concern.",
    zhDefinition: "adj. 热切的；挂念的；关心的",
    example: "She was always very solicitous about the welfare of her students.",
    category: "考研高频"
  },
  {
    word: "solvent",
    phonetic: "[ˈsɒlvənt]",
    enDefinition: "Having assets in excess of liabilities; able to pay one's debts.",
    zhDefinition: "adj. 有偿付能力的 n. 溶剂",
    example: "The bank wanted to be sure that the company was solvent before granting the loan.",
    category: "考研高频"
  },
  {
    word: "sonorous",
    phonetic: "[ˈsɒnərəs]",
    enDefinition: "(Of a person's voice or other sound) imposingly deep and full.",
    zhDefinition: "adj. 响亮的；洪亮的",
    example: "The actor's sonorous voice filled the entire theater without the need for a microphone.",
    category: "考研高频"
  },
  {
    word: "sophistry",
    phonetic: "[ˈsɒfɪstri]",
    enDefinition: "The use of fallacious arguments, especially with the intention of deceiving.",
    zhDefinition: "n. 诡辩",
    example: "The lawyer's argument was a clever piece of sophistry that confused the jury.",
    category: "考研高频"
  },
  {
    word: "soporific",
    phonetic: "[ˌsɒpəˈrɪfɪk]",
    enDefinition: "Tending to induce drowsiness or sleep.",
    zhDefinition: "adj. 催眠的；乏味的",
    example: "The professor's lecture had a soporific effect on many of the students.",
    category: "考研高频"
  },
  {
    word: "specious",
    phonetic: "[ˈspiːʃəs]",
    enDefinition: "Plausible but wrong.",
    zhDefinition: "adj. 似是而非的；华而不实的",
    example: "The politician made several specious arguments to justify the tax increase.",
    category: "考研高频"
  },
  {
    word: "sporadic",
    phonetic: "[spəˈrædɪk]",
    enDefinition: "Occurring at irregular intervals or only in a few places; scattered or isolated.",
    zhDefinition: "adj. 零星的；阵发性的",
    example: "Fighting between the two groups has been sporadic for the past several weeks.",
    category: "考研高频"
  },

  // --- 第44组 ---
  {
    word: "stasis",
    phonetic: "[ˈsteɪsɪs]",
    enDefinition: "A period or state of inactivity or equilibrium.",
    zhDefinition: "n. 停滞；静止",
    example: "The industry has entered a period of stasis, with no new products or innovations.",
    category: "考研高频"
  },
  {
    word: "stigma",
    phonetic: "[ˈstɪɡmə]",
    enDefinition: "A mark of disgrace associated with a particular circumstance, quality, or person.",
    zhDefinition: "n. 耻辱；污名",
    example: "There is still a social stigma attached to mental illness in many parts of the world.",
    category: "考研高频"
  },
  {
    word: "stolid",
    phonetic: "[ˈstɒlɪd]",
    enDefinition: "(Of a person) calm, dependable, and showing little emotion or animation.",
    zhDefinition: "adj. 迟钝的；冷静的；缺乏热情的",
    example: "He remained stolid and unemotional even after hearing the tragic news.",
    category: "考研高频"
  },
  {
    word: "stratagem",
    phonetic: "[ˈstrætədʒəm]",
    enDefinition: "A plan or scheme, especially one used to outwit an opponent or achieve an end.",
    zhDefinition: "n. 策略；计策；诡计",
    example: "The general's clever stratagem allowed his troops to capture the fort without a fight.",
    category: "考研高频"
  },
  {
    word: "subliminal",
    phonetic: "[ˌsʌbˈlɪmɪnl]",
    enDefinition: "(Of a stimulus or mental process) below the threshold of sensation or consciousness.",
    zhDefinition: "adj. 潜意识的；下意识的",
    example: "The advertisement uses subliminal messages to influence consumer behavior.",
    category: "考研高频"
  },
  {
    word: "succinct",
    phonetic: "[səkˈsɪŋkt]",
    enDefinition: "(Especially of something written or spoken) briefly and clearly expressed.",
    zhDefinition: "adj. 简明的；简洁的",
    example: "The report provided a succinct summary of the project's achievements.",
    category: "考研高频"
  },
  {
    word: "supercilious",
    phonetic: "[ˌsuːpəˈsɪliəs]",
    enDefinition: "Behaving or looking as though one thinks one is superior to others.",
    zhDefinition: "adj. 目中无人的；高傲的",
    example: "She gave a supercilious smile and walked away without answering his question.",
    category: "考研高频"
  },
  {
    word: "superfluous",
    phonetic: "[suːˈpɜːfluəs]",
    enDefinition: "Unnecessary, especially through being more than enough.",
    zhDefinition: "adj. 多余的；过剩的",
    example: "The new system makes the manual recording of data superfluous.",
    category: "考研高频"
  },
  {
    word: "surfeit",
    phonetic: "[ˈsɜːfɪt]",
    enDefinition: "An excessive amount of something.",
    zhDefinition: "n. 过量；饮食过度",
    example: "The current job market has a surfeit of graduates with no practical experience.",
    category: "考研高频"
  },
  {
    word: "symbiosis",
    phonetic: "[ˌsɪmbaɪˈəʊsɪs]",
    enDefinition: "Interaction between two different organisms living in close physical association, typically to the advantage of both.",
    zhDefinition: "n. 共生；互利互惠的关系",
    example: "There is a symbiosis between the media and the political world.",
    category: "考研高频"
  },

  // --- 第45组 ---
  {
    word: "tacit",
    phonetic: "[ˈtæsɪt]",
    enDefinition: "Understood or implied without being stated.",
    zhDefinition: "adj. 心照不宣的；默示的",
    example: "By staying in the room, she gave her tacit approval to the decision.",
    category: "考研高频"
  },
  {
    word: "taciturn",
    phonetic: "[ˈtæsɪtɜːn]",
    enDefinition: "(Of a person) reserved or uncommunicative in speech; saying little.",
    zhDefinition: "adj. 沉默寡言的",
    example: "He was a taciturn man who rarely shared his thoughts with anyone.",
    category: "考研高频"
  },
  {
    word: "tangential",
    phonetic: "[tænˈdʒenʃl]",
    enDefinition: "Relating to or along a tangent; diverging from a previous course or line.",
    zhDefinition: "adj. 离题的；切线的；间接相关的",
    example: "The issue he raised was only tangential to the main discussion.",
    category: "考研高频"
  },
  {
    word: "tirade",
    phonetic: "[taɪˈreɪd]",
    enDefinition: "A long, angry speech of criticism or accusation.",
    zhDefinition: "n. 激烈的长篇演说",
    example: "The coach went on a tirade against the referee's controversial decision.",
    category: "考研高频"
  },
  {
    word: "toady",
    phonetic: "[ˈtəʊdi]",
    enDefinition: "A person who behaves obsequiously to someone important.",
    zhDefinition: "n. 谄媚者；马屁精",
    example: "No one in the office liked him because he was such a toady to the manager.",
    category: "考研高频"
  },
  {
    word: "tome",
    phonetic: "[təʊm]",
    enDefinition: "A book, especially a large, heavy, scholarly one.",
    zhDefinition: "n. 巨著；大部头的书",
    example: "He published a massive tome on the history of the Roman Empire.",
    category: "考研高频"
  },
  {
    word: "tortuous",
    phonetic: "[ˈtɔːtʃuəs]",
    enDefinition: "Full of twists and turns; excessively lengthy and complex.",
    zhDefinition: "adj. 弯曲的；曲折的；复杂的",
    example: "The road to the mountain top was long and tortuous.",
    category: "考研高频"
  },
  {
    word: "transgress",
    phonetic: "[trænzˈɡres]",
    enDefinition: "Infringe or go beyond the bounds of (a moral principle or other established standard of behavior).",
    zhDefinition: "v. 违背；犯法；越过",
    example: "He was warned not to transgress the rules of the organization again.",
    category: "考研高频"
  },
  {
    word: "travesty",
    phonetic: "[ˈtrævəsti]",
    enDefinition: "A false, absurd, or distorted representation of something.",
    zhDefinition: "n. 拙劣的模仿；歪曲",
    example: "The trial was a travesty of justice from start to finish.",
    category: "考研高频"
  },
  {
    word: "trenchant",
    phonetic: "[ˈtrentʃənt]",
    enDefinition: "Vigorous or incisive in expression or style.",
    zhDefinition: "adj. 尖锐的；深刻的；切中要害的",
    example: "The critic's trenchant analysis of the film was widely praised.",
    category: "考研高频"
  },

  // --- 第46组 ---
  {
    word: "turgid",
    phonetic: "[ˈtɜːdʒɪd]",
    enDefinition: "Swollen and distended or congested; (of language or style) tediously pompous or bombastic.",
    zhDefinition: "adj. 肿胀的；浮夸的",
    example: "The report was written in a turgid, academic style that was difficult to read.",
    category: "考研高频"
  },
  {
    word: "tyro",
    phonetic: "[ˈtaɪrəʊ]",
    enDefinition: "A beginner or novice.",
    zhDefinition: "n. 初学者；新手",
    example: "Even a tyro in politics could see that the plan was destined to fail.",
    category: "考研高频"
  },
  {
    word: "unfeigned",
    phonetic: "[ʌnˈfeɪnd]",
    enDefinition: "Genuine; sincere.",
    zhDefinition: "adj. 真实的；不虚伪的",
    example: "She showed unfeigned joy when she heard the good news.",
    category: "考研高频"
  },
  {
    word: "untenable",
    phonetic: "[ʌnˈtenəbl]",
    enDefinition: "(Especially of a theory or position) not able to be maintained or defended against attack or objection.",
    zhDefinition: "adj. 站不住脚的；难以防守的",
    example: "His position in the company became untenable after the scandal broke.",
    category: "考研高频"
  },
  {
    word: "vacuous",
    phonetic: "[ˈvækjuəs]",
    enDefinition: "Having or showing a lack of thought or intelligence; mindless.",
    zhDefinition: "adj. 空洞的；无意义的",
    example: "The movie was criticized for its vacuous plot and flat characters.",
    category: "考研高频"
  },
  {
    word: "variegated",
    phonetic: "[ˈveəriɡeɪtɪd]",
    enDefinition: "Exhibiting different colors, especially as irregular patches or streaks.",
    zhDefinition: "adj. 杂色的；五颜六色的；多样化的",
    example: "The garden was filled with variegated flowers of all shapes and sizes.",
    category: "考研高频"
  },
  {
    word: "venerate",
    phonetic: "[ˈvenəreɪt]",
    enDefinition: "Regard with great respect; revere.",
    zhDefinition: "v. 崇敬；敬仰",
    example: "In some cultures, it is traditional to venerate one's ancestors.",
    category: "考研高频"
  },
  {
    word: "veracity",
    phonetic: "[vəˈræsəti]",
    enDefinition: "Conformity to facts; accuracy; habitual truthfulness.",
    zhDefinition: "n. 诚实；真实性",
    example: "The lawyer questioned the veracity of the witness's testimony.",
    category: "考研高频"
  },
  {
    word: "verbose",
    phonetic: "[vɜːˈbəʊs]",
    enDefinition: "Using or expressed in more words than are needed.",
    zhDefinition: "adj. 啰嗦的；冗长的",
    example: "The author's verbose writing style made the short story unnecessarily long.",
    category: "考研高频"
  },
  {
    word: "vexation",
    phonetic: "[vekˈseɪʃn]",
    enDefinition: "The state of being annoyed, frustrated, or worried.",
    zhDefinition: "n. 烦恼；苦恼；惹人恼火的事",
    example: "The constant delays were a source of great vexation for the travelers.",
    category: "考研高频"
  },

  // --- 第47组 ---
  {
    word: "vigilant",
    phonetic: "[ˈvɪdʒɪlənt]",
    enDefinition: "Keeping careful watch for possible danger or difficulties.",
    zhDefinition: "adj. 警觉的；警惕的",
    example: "Security guards must remain vigilant at all times to prevent any incidents.",
    category: "考研高频"
  },
  {
    word: "vituperative",
    phonetic: "[vɪˈtjuːpərətɪv]",
    enDefinition: "Bitter and abusive.",
    zhDefinition: "adj. 谩骂的；责骂的",
    example: "The candidate's vituperative attacks on his opponent backfired on him.",
    category: "考研高频"
  },
  {
    word: "volatile",
    phonetic: "[ˈvɒlətaɪl]",
    enDefinition: "(Of a substance) easily evaporated at normal temperatures; liable to change rapidly and unpredictably, especially for the worse.",
    zhDefinition: "adj. 不稳定的；挥发性的；易变的",
    example: "The political situation in the region remains highly volatile.",
    category: "考研高频"
  },
  {
    word: "whimsical",
    phonetic: "[ˈwɪmzɪkl]",
    enDefinition: "Playfully quaint or fanciful, especially in an appealing and amusing way.",
    zhDefinition: "adj. 异想天开的；古怪的",
    example: "She has a whimsical sense of humor that makes everyone laugh.",
    category: "考研高频"
  },
  {
    word: "wily",
    phonetic: "[ˈwaɪli]",
    enDefinition: "Skilled at gaining an advantage, especially deceitfully.",
    zhDefinition: "adj. 狡猾的；诡计多端的",
    example: "The wily old politician knew exactly how to handle the difficult situation.",
    category: "考研高频"
  },
  {
    word: "winsome",
    phonetic: "[ˈwɪnsəm]",
    enDefinition: "Attractive or appealing in appearance or character.",
    zhDefinition: "adj. 迷人的；可爱的",
    example: "Her winsome smile charmed everyone at the party.",
    category: "考研高频"
  },
  {
    word: "yoke",
    phonetic: "[jəʊk]",
    enDefinition: "A thing that causes hardship or misery; a burden.",
    zhDefinition: "n. 枷锁；束缚 v. 结合",
    example: "The country finally threw off the yoke of foreign occupation.",
    category: "考研高频"
  },
  {
    word: "zealot",
    phonetic: "[ˈzelət]",
    enDefinition: "A person who is fanatical and uncompromising in pursuit of their religious, political, or other ideals.",
    zhDefinition: "n. 狂热者；盲信者",
    example: "The religious zealot was willing to do anything to defend his beliefs.",
    category: "考研高频"
  },
  {
    word: "zenith",
    phonetic: "[ˈzenɪθ]",
    enDefinition: "The time at which something is most powerful or successful.",
    zhDefinition: "n. 顶点；巅峰",
    example: "The Roman Empire reached its zenith in the second century AD.",
    category: "考研高频"
  },
  {
    word: "aberration",
    phonetic: "[ˌæbəˈreɪʃn]",
    enDefinition: "A departure from what is normal, usual, or expected, typically one that is unwelcome.",
    zhDefinition: "n. 反常；偏离；失常",
    example: "The sudden drop in temperature was an aberration in an otherwise hot summer.",
    category: "考研高频"
  },

  // --- 第48组 ---
  {
    word: "abject",
    phonetic: "[ˈæbdʒekt]",
    enDefinition: "(Of something bad) experienced or present to the maximum degree; (of a person or their behavior) completely without pride or dignity; self-abasing.",
    zhDefinition: "adj. 卑微的；凄惨的；绝望的",
    example: "Many people in the region are living in abject poverty.",
    category: "考研高频"
  },
  {
    word: "abnegation",
    phonetic: "[ˌæbnɪˈɡeɪʃn]",
    enDefinition: "The act of renouncing or rejecting something.",
    zhDefinition: "n. 拒绝；自我牺牲；放弃",
    example: "The monk's life was one of complete abnegation and devotion to God.",
    category: "考研高频"
  },
  {
    word: "abrogate",
    phonetic: "[ˈæbrəɡeɪt]",
    enDefinition: "Repeal or do away with (a law, right, or formal agreement).",
    zhDefinition: "v. 废除；撤销",
    example: "The treaty was abrogated by one of the participating countries.",
    category: "考研高频"
  },
  {
    word: "abscond",
    phonetic: "[əbˈskɒnd]",
    enDefinition: "Leave hurriedly and secretly, typically to avoid detection of or arrest for an unlawful action.",
    zhDefinition: "v. 潜逃；溜走",
    example: "The company treasurer absconded with millions of dollars in funds.",
    category: "考研高频"
  },
  {
    word: "abstruse",
    phonetic: "[əbˈstruːs]",
    enDefinition: "Difficult to understand; obscure.",
    zhDefinition: "adj. 深奥的；难解的",
    example: "The professor's lecture on quantum physics was too abstruse for most of the students.",
    category: "考研高频"
  },
  {
    word: "accede",
    phonetic: "[əkˈsiːd]",
    enDefinition: "Assent or agree to a demand, request, or treaty.",
    zhDefinition: "v. 同意；就职；参加",
    example: "The government eventually decided to accede to the protesters' demands.",
    category: "考研高频"
  },
  {
    word: "accretion",
    phonetic: "[əˈkriːʃn]",
    enDefinition: "The process of growth or increase, typically by the gradual accumulation of additional layers or matter.",
    zhDefinition: "n. 增长；堆积层",
    example: "The shoreline was formed by the slow accretion of sand over many years.",
    category: "考研高频"
  },
  {
    word: "acumen",
    phonetic: "[ˈækjumən]",
    enDefinition: "The ability to make good judgments and quick decisions, typically in a particular domain.",
    zhDefinition: "n. 敏锐；聪明",
    example: "Her business acumen allowed her to see opportunities that others had missed.",
    category: "考研高频"
  },
  {
    word: "adamant",
    phonetic: "[ˈædəmənt]",
    enDefinition: "Refusing to be persuaded or to change one's mind.",
    zhDefinition: "adj. 坚决的；固执的",
    example: "He was adamant that he would not accept the offer, no matter how high it was.",
    category: "考研高频"
  },
  {
    word: "admonish",
    phonetic: "[ədˈmɒnɪʃ]",
    enDefinition: "Warn or reprimand someone firmly.",
    zhDefinition: "v. 劝告；训诫；警告",
    example: "The teacher admonished the students for not completing their homework on time.",
    category: "考研高频"
  },

  // --- 第49组 ---
  {
    word: "adroit",
    phonetic: "[əˈdrɔɪt]",
    enDefinition: "Clever or skillful in using the hands or mind.",
    zhDefinition: "adj. 敏捷的；熟练的",
    example: "She was very adroit at handling difficult questions during the interview.",
    category: "考研高频"
  },
  {
    word: "adulation",
    phonetic: "[ˌædjuˈleɪʃn]",
    enDefinition: "Obsequious flattery; excessive admiration or praise.",
    zhDefinition: "n. 谄媚；奉承",
    example: "The movie star enjoyed the adulation of her millions of fans.",
    category: "考研高频"
  },
  {
    word: "affable",
    phonetic: "[ˈæfəbl]",
    enDefinition: "Friendly, good-natured, or easy to talk to.",
    zhDefinition: "adj. 和蔼可亲的；友善的",
    example: "The new manager proved to be very affable and easy to work with.",
    category: "考研高频"
  },
  {
    word: "alacrity",
    phonetic: "[əˈlækrəti]",
    enDefinition: "Brisk and cheerful readiness.",
    zhDefinition: "n. 敏捷；欣然",
    example: "She accepted the invitation with alacrity and began making plans immediately.",
    category: "考研高频"
  },
  {
    word: "allay",
    phonetic: "[əˈleɪ]",
    enDefinition: "Diminish or put at rest (fear, suspicion, or worry).",
    zhDefinition: "v. 减轻；缓和；使平静",
    example: "The government tried to allay public fears about the safety of the new vaccine.",
    category: "考研高频"
  },
  {
    word: "altruistic",
    phonetic: "[ˌæltruˈɪstɪk]",
    enDefinition: "Showing a disinterested and selfless concern for the well-being of others; unselfish.",
    zhDefinition: "adj. 利他的；无私的",
    example: "The organization's altruistic work has helped thousands of people in need.",
    category: "考研高频"
  },
  {
    word: "ambivalent",
    phonetic: "[æmˈbɪvələnt]",
    enDefinition: "Having mixed feelings or contradictory ideas about something or someone.",
    zhDefinition: "adj. 矛盾的；犹豫不决的",
    example: "He has an ambivalent attitude towards his job, enjoying the work but hating the hours.",
    category: "考研高频"
  },
  {
    word: "ameliorate",
    phonetic: "[əˈmiːliəreɪt]",
    enDefinition: "Make (something bad or unsatisfactory) better.",
    zhDefinition: "v. 改善；改进",
    example: "Steps have been taken to ameliorate the living conditions of the poor.",
    category: "考研高频"
  },
  {
    word: "amenable",
    phonetic: "[əˈmiːnəbl]",
    enDefinition: "(Of a person) open and responsive to suggestion; easily persuaded or controlled.",
    zhDefinition: "adj. 顺从的；愿接受的",
    example: "The committee was amenable to the idea of changing the project's deadline.",
    category: "考研高频"
  },
  {
    word: "amenity",
    phonetic: "[əˈmiːnəti]",
    enDefinition: "A desirable or useful feature or facility of a building or place.",
    zhDefinition: "n. 便利设施；礼仪；愉快",
    example: "The hotel offers many amenities, including a swimming pool and a gym.",
    category: "考研高频"
  },

  // --- 第50组 ---
  {
    word: "anachronism",
    phonetic: "[əˈnækrənɪzəm]",
    enDefinition: "A thing belonging or appropriate to a period other than that in which it exists, especially a thing that is conspicuously old-fashioned.",
    zhDefinition: "n. 时代错误；不合时宜的事物",
    example: "In today's digital world, the manual typewriter is seen as an anachronism.",
    category: "考研高频"
  },
  {
    word: "analogy",
    phonetic: "[əˈnælədʒi]",
    enDefinition: "A comparison between two things, typically for the purpose of explanation or clarification.",
    zhDefinition: "n. 类比；类推",
    example: "He used an analogy to help the students understand the complex scientific theory.",
    category: "考研高频"
  },
  {
    word: "anarchy",
    phonetic: "[ˈænəki]",
    enDefinition: "A state of disorder due to absence or nonrecognition of authority.",
    zhDefinition: "n. 无政府状态；混乱",
    example: "The sudden collapse of the government led to widespread anarchy in the country.",
    category: "考研高频"
  },
  {
    word: "anathema",
    phonetic: "[əˈnæθəmə]",
    enDefinition: "Something or someone that one vehemently dislikes.",
    zhDefinition: "n. 极其讨厌的人或事；诅咒",
    example: "The idea of raising taxes is anathema to most members of the opposition party.",
    category: "考研高频"
  },
  {
    word: "ancillary",
    phonetic: "[ænˈsɪləri]",
    enDefinition: "Providing necessary support to the primary activities or operation of an organization, institution, industry, or system.",
    zhDefinition: "adj. 辅助的；副的",
    example: "The university provides many ancillary services, such as counseling and career advice.",
    category: "考研高频"
  },
  {
    word: "animosity",
    phonetic: "[ˌænɪˈmɒsəti]",
    enDefinition: "Strong hostility.",
    zhDefinition: "n. 敌意；憎恨",
    example: "There has always been a great deal of animosity between the two rival families.",
    category: "考研高频"
  },
  {
    word: "anomaly",
    phonetic: "[əˈnɒməli]",
    enDefinition: "Something that deviates from what is normal, usual, or expected.",
    zhDefinition: "n. 异常；反常事物",
    example: "The scientists were puzzled by the anomaly in the data they had collected.",
    category: "考研高频"
  },
  {
    word: "antipathy",
    phonetic: "[ænˈtɪpəθi]",
    enDefinition: "A deep-seated feeling of dislike; aversion.",
    zhDefinition: "n. 反感；厌恶",
    example: "He felt a strong antipathy towards anyone who disagreed with his views.",
    category: "考研高频"
  },
  {
    word: "antithesis",
    phonetic: "[ænˈtɪθəsɪs]",
    enDefinition: "A person or thing that is the direct opposite of someone or something else.",
    zhDefinition: "n. 对立面；对照",
    example: "His new book is the complete antithesis of his earlier, more optimistic work.",
    category: "考研高频"
  },
  {
    word: "apathetic",
    phonetic: "[ˌæpəˈθetɪk]",
    enDefinition: "Showing or feeling no interest, enthusiasm, or concern.",
    zhDefinition: "adj. 冷淡的；无动于衷的",
    example: "The public seems to be increasingly apathetic about political issues.",
    category: "考研高频"
  },

  // --- 第51组 ---
  {
    word: "apotheosis",
    phonetic: "[əˌpɒθiˈəʊsɪs]",
    enDefinition: "The highest point in the development of something; culmination or climax.",
    zhDefinition: "n. 巅峰；神化；典范",
    example: "His appearance as Hamlet was the apotheosis of his acting career.",
    category: "考研高频"
  },
  {
    word: "bellicose",
    phonetic: "[ˈbelɪkəʊs]",
    enDefinition: "Demonstrating aggression and willingness to fight.",
    zhDefinition: "adj. 好战的；好斗的",
    example: "The politician's bellicose rhetoric alarmed the neighboring countries.",
    category: "考研高频"
  },
  {
    word: "camaraderie",
    phonetic: "[ˌkæməˈrɑːdəri]",
    enDefinition: "Mutual trust and friendship among people who spend a lot of time together.",
    zhDefinition: "n. 友谊；同志之爱",
    example: "There is a great sense of camaraderie among the members of the team.",
    category: "考研高频"
  },
  {
    word: "demagogue",
    phonetic: "[ˈdeməɡɒɡ]",
    enDefinition: "A political leader who seeks support by appealing to the desires and prejudices of ordinary people.",
    zhDefinition: "n. 煽动者；蛊惑人心的政客",
    example: "He was labeled a demagogue for his inflammatory speeches during the campaign.",
    category: "考研高频"
  },
  {
    word: "effulgent",
    phonetic: "[ɪˈfʌldʒənt]",
    enDefinition: "Shining brightly; radiant.",
    zhDefinition: "adj. 灿烂的；光辉耀眼的",
    example: "The effulgent sun rose over the mountains, bathing the valley in light.",
    category: "考研高频"
  },
  {
    word: "furtive",
    phonetic: "[ˈfɜːtɪv]",
    enDefinition: "Attempting to avoid notice or attention, typically because of guilt or a belief that discovery would lead to trouble.",
    zhDefinition: "adj. 鬼鬼祟祟的；秘密的",
    example: "He cast a furtive glance at the test paper of the student sitting next to him.",
    category: "考研高频"
  },
  {
    word: "gossamer",
    phonetic: "[ˈɡɒsəmə(r)]",
    enDefinition: "Used to refer to something very light, thin, and insubstantial or delicate.",
    zhDefinition: "adj. 轻而薄的；纤细的 n. 蛛丝",
    example: "She was wearing a dress of gossamer silk that floated in the breeze.",
    category: "考研高频"
  },
  {
    word: "homage",
    phonetic: "[ˈhɒmɪdʒ]",
    enDefinition: "Special honor or respect shown publicly.",
    zhDefinition: "n. 敬意；尊崇",
    example: "The film is a touching homage to the great directors of the past.",
    category: "考研高频"
  },
  {
    word: "imbroglio",
    phonetic: "[ɪmˈbrəʊliəʊ]",
    enDefinition: "An extremely confused, complicated, or embarrassing situation.",
    zhDefinition: "n. 纠葛；复杂的局面；乱局",
    example: "The company found itself in a legal imbroglio over patent rights.",
    category: "考研高频"
  },
  {
    word: "juggernaut",
    phonetic: "[ˈdʒʌɡənɔːt]",
    enDefinition: "A huge, powerful, and overwhelming force or institution.",
    zhDefinition: "n. 不可抗拒的力量；巨大机构",
    example: "The tech giant has become a juggernaut that dominates the entire industry.",
    category: "考研高频"
  },

  // --- 第52组 ---
  {
    word: "kowtow",
    phonetic: "[ˌkaʊˈtaʊ]",
    enDefinition: "Act in an excessively subservient manner.",
    zhDefinition: "v. 唯命是从；磕头；讨好",
    example: "The local officials were accused of kowtowing to the powerful developers.",
    category: "考研高频"
  },
  {
    word: "lugubrious",
    phonetic: "[luːˈɡuːbriəs]",
    enDefinition: "Looking or sounding sad and dismal.",
    zhDefinition: "adj. 悲哀的；阴郁的",
    example: "The funeral was accompanied by lugubrious music that made everyone weep.",
    category: "考研高频"
  },
  {
    word: "mellifluous",
    phonetic: "[meˈlɪfluəs]",
    enDefinition: "(Of a voice or words) sweet or musical; pleasant to hear.",
    zhDefinition: "adj. 悦耳的；流畅的",
    example: "The singer's mellifluous voice captivated the entire audience.",
    category: "考研高频"
  },
  {
    word: "noisome",
    phonetic: "[ˈnɔɪsəm]",
    enDefinition: "Having an extremely offensive smell.",
    zhDefinition: "adj. 极臭的；有害的；令人讨厌的",
    example: "The noisome fumes from the nearby factory made it difficult to breathe.",
    category: "考研高频"
  },
  {
    word: "pusillanimous",
    phonetic: "[ˌpjuːsɪˈlænɪməs]",
    enDefinition: "Showing a lack of courage or determination; timid.",
    zhDefinition: "adj. 胆怯的；懦弱的",
    example: "He criticized the government for its pusillanimous response to the crisis.",
    category: "考研高频"
  },
  {
    word: "redoubtable",
    phonetic: "[rɪˈdaʊtəbl]",
    enDefinition: "(Of a person) formidable, especially as an opponent.",
    zhDefinition: "adj. 可敬畏的；强硬的",
    example: "In the courtroom, he was a redoubtable opponent who rarely lost a case.",
    category: "考研高频"
  },
  {
    word: "salubrious",
    phonetic: "[səˈluːbriəs]",
    enDefinition: "Health-giving; healthy.",
    zhDefinition: "adj. 有益健康的；风景宜人的",
    example: "The fresh mountain air and quiet surroundings are very salubrious.",
    category: "考研高频"
  },
  {
    word: "talisman",
    phonetic: "[ˈtælɪzmən]",
    enDefinition: "An object, typically an inscribed ring or stone, that is thought to have magic powers and to bring good luck.",
    zhDefinition: "n. 护身符；辟邪物",
    example: "He carried a small wooden cross as a talisman to protect him during his travels.",
    category: "考研高频"
  },
  {
    word: "usurp",
    phonetic: "[juːˈzɜːp]",
    enDefinition: "Take (a position of power or importance) illegally or by force.",
    zhDefinition: "v. 篡夺；侵占",
    example: "The military leader attempted to usurp the power of the elected president.",
    category: "考研高频"
  },
  {
    word: "vituperation",
    phonetic: "[vɪˌtjuːpəˈreɪʃn]",
    enDefinition: "Bitter and abusive language.",
    zhDefinition: "n. 谩骂；辱骂",
    example: "The actor was subjected to a torrent of vituperation on social media.",
    category: "考研高频"
  },

  // --- 第53组 ---
  {
    word: "wanderlust",
    phonetic: "[ˈwɒndəlʌst]",
    enDefinition: "A strong desire to travel.",
    zhDefinition: "n. 旅游热；漫游癖",
    example: "Her wanderlust has taken her to almost every corner of the world.",
    category: "考研高频"
  },
  {
    word: "yeoman",
    phonetic: "[ˈjəʊmən]",
    enDefinition: "Used to describe a loyal and hardworking servant or supporter.",
    zhDefinition: "n. 勤奋的人；自由农 adj. 勤勉的",
    example: "The volunteers did yeoman service in clearing up the damage after the storm.",
    category: "考研高频"
  },
  {
    word: "abstain",
    phonetic: "[əbˈsteɪn]",
    enDefinition: "Restrain oneself from doing or enjoying something.",
    zhDefinition: "v. 弃权；戒除；节制",
    example: "He decided to abstain from voting in the local elections.",
    category: "考研高频"
  },
  {
    word: "adventitious",
    phonetic: "[ˌædvenˈtɪʃəs]",
    enDefinition: "Happening or carried on according to chance rather than design or nature.",
    zhDefinition: "adj. 偶然的；外来的",
    example: "The discovery of the ancient coins was entirely adventitious.",
    category: "考研高频"
  },
  {
    word: "besmirch",
    phonetic: "[bɪˈsmɜːtʃ]",
    enDefinition: "Damage the reputation of (someone or something) in the opinion of others.",
    zhDefinition: "v. 玷污（名誉等）；弄脏",
    example: "He accused his rivals of trying to besmirch his good name.",
    category: "考研高频"
  },
  {
    word: "contumacious",
    phonetic: "[ˌkɒntjuˈmeɪʃəs]",
    enDefinition: "(Especially of a defendant's behavior) stubbornly or willfully disobedient to authority.",
    zhDefinition: "adj. 拒不服从的；顽抗的",
    example: "The prisoner was punished for his contumacious behavior in court.",
    category: "考研高频"
  },
  {
    word: "excoriate",
    phonetic: "[ɪkˈskɔːrieɪt]",
    enDefinition: "Censure or criticize severely.",
    zhDefinition: "v. 严厉指责；擦破皮肤",
    example: "The report excoriates the government for its failure to act during the crisis.",
    category: "考研高频"
  },
  {
    word: "feckless",
    phonetic: "[ˈfekləs]",
    enDefinition: "Lacking initiative or strength of character; irresponsible.",
    zhDefinition: "adj. 无能的；不负责任的",
    example: "The management was criticized for its feckless handling of the strike.",
    category: "考研高频"
  },
  {
    word: "histrionic",
    phonetic: "[ˌhɪstriˈɒnɪk]",
    enDefinition: "Overly theatrical or melodramatic in character or style.",
    zhDefinition: "adj. 做作的；戏剧性的",
    example: "She burst into histrionic tears when she heard the news.",
    category: "考研高频"
  },
  {
    word: "impudent",
    phonetic: "[ˈɪmpjudənt]",
    enDefinition: "Not showing due respect for another person; impertinent.",
    zhDefinition: "adj. 无礼的；鲁莽的",
    example: "The student was punished for his impudent behavior towards the teacher.",
    category: "考研高频"
  },

  // --- 第54组 ---
  {
    word: "jettison",
    phonetic: "[ˈdʒetɪsn]",
    enDefinition: "Abandon or discard (someone or something that is no longer wanted).",
    zhDefinition: "v. 抛弃；丢弃（不想要的计划、想法等）",
    example: "The company decided to jettison its loss-making subsidiaries.",
    category: "考研高频"
  },
  {
    word: "kismet",
    phonetic: "[ˈkɪzmet]",
    enDefinition: "Destiny; fate.",
    zhDefinition: "n. 宿命；命运",
    example: "It was kismet that they met again after all those years.",
    category: "考研高频"
  },
  {
    word: "laconism",
    phonetic: "[ˈlækənɪzəm]",
    enDefinition: "A style of speaking or writing that uses only a few words.",
    zhDefinition: "n. 简洁；简短的警句",
    example: "The general was famous for his laconism and directness in communication.",
    category: "考研高频"
  },
  {
    word: "mendicant",
    phonetic: "[ˈmendɪkənt]",
    enDefinition: "Given to begging.",
    zhDefinition: "n. 乞丐 adj. 行乞的",
    example: "He lived as a mendicant, relying on the kindness of strangers for food.",
    category: "考研高频"
  },
  {
    word: "nexus",
    phonetic: "[ˈneksəs]",
    enDefinition: "A connection or series of connections linking two or more things.",
    zhDefinition: "n. 联结；核心；一系列联系",
    example: "The university is a nexus for research and innovation in the region.",
    category: "考研高频"
  },
  {
    word: "overhaul",
    phonetic: "[ˌəʊvəˈhɔːl]",
    enDefinition: "Examine thoroughly and repair or improve.",
    zhDefinition: "v./n. 彻底检修；改革",
    example: "The education system needs a complete overhaul to meet modern needs.",
    category: "考研高频"
  },
  {
    word: "parity",
    phonetic: "[ˈpærəti]",
    enDefinition: "The state or condition of being equal, especially regarding status or pay.",
    zhDefinition: "n. 相等；平等；平价",
    example: "Women are still fighting for wage parity with their male colleagues.",
    category: "考研高频"
  },
  {
    word: "quaff",
    phonetic: "[kwɒf]",
    enDefinition: "Drink (something, especially an alcoholic drink) heartily.",
    zhDefinition: "v. 狂饮；痛饮",
    example: "They spent the evening quaffing beer and telling stories.",
    category: "考研高频"
  },
  {
    word: "recant",
    phonetic: "[rɪˈkænt]",
    enDefinition: "Say that one no longer holds an opinion or belief, especially one considered unorthodox.",
    zhDefinition: "v. 撤回（声明）；放弃（信仰）",
    example: "The witness was forced to recant his testimony under pressure from the defense.",
    category: "考研高频"
  },
  {
    word: "squalid",
    phonetic: "[ˈskwɒlɪd]",
    enDefinition: "(Of a place) extremely dirty and unpleasant, especially as a result of poverty or neglect.",
    zhDefinition: "adj. 肮脏的；卑劣的",
    example: "Many people were living in squalid conditions with no access to clean water.",
    category: "考研高频"
  },

  // --- 第55组 ---
  {
    word: "trite",
    phonetic: "[traɪt]",
    enDefinition: "(Of a remark, opinion, or idea) overused and consequently of little import; lacking originality or freshness.",
    zhDefinition: "adj. 陈腐的；平庸的",
    example: "I found the movie's plot to be a bit trite and predictable.",
    category: "考研高频"
  },
  {
    word: "unwitting",
    phonetic: "[ʌnˈwɪtɪŋ]",
    enDefinition: "(Of a person) not aware of the full facts.",
    zhDefinition: "adj. 不知情的；无意的",
    example: "She was an unwitting participant in the fraudulent scheme.",
    category: "考研高频"
  },
  {
    word: "vex",
    phonetic: "[veks]",
    enDefinition: "Make (someone) feel annoyed, frustrated, or worried, especially with trivial matters.",
    zhDefinition: "v. 使烦恼；困扰；激怒",
    example: "The complicated legal process continues to vex the small business owner.",
    category: "考研高频"
  },
  {
    word: "wallow",
    phonetic: "[ˈwɒləʊ]",
    enDefinition: "(Of a person) indulge in an unrestrained way in (something that creates a pleasurable sensation).",
    zhDefinition: "v. 沉溺；打滚",
    example: "After losing his job, he spent a few days wallowing in self-pity.",
    category: "考研高频"
  },
  {
    word: "xeric",
    phonetic: "[ˈzɪərɪk]",
    enDefinition: "Characterized by, relating to, or requiring only a small amount of moisture.",
    zhDefinition: "adj. 干旱的；耐旱的",
    example: "The cactus is a classic example of a xeric plant that thrives in the desert.",
    category: "考研高频"
  },
  {
    word: "zest",
    phonetic: "[zest]",
    enDefinition: "Great enthusiasm and energy.",
    zhDefinition: "n. 兴趣；热心；风味",
    example: "She has a real zest for life and enjoys every moment to the fullest.",
    category: "考研高频"
  },
  {
    word: "acrimony",
    phonetic: "[ˈækrɪməni]",
    enDefinition: "Bitterness or ill feeling.",
    zhDefinition: "n. 刻薄；辛辣；火药味",
    example: "The divorce was marked by a great deal of acrimony and public dispute.",
    category: "考研高频"
  },
  {
    word: "censure",
    phonetic: "[ˈsenʃə(r)]",
    enDefinition: "Express severe disapproval of (someone or something), especially in a formal statement.",
    zhDefinition: "v./n. 严厉谴责；责难",
    example: "The health department was censured for its slow response to the outbreak.",
    category: "考研高频"
  },
  {
    word: "dilatory",
    phonetic: "[ˈdɪlətəri]",
    enDefinition: "Slow to act.",
    zhDefinition: "adj. 拖延的；缓慢的",
    example: "The company was criticized for its dilatory response to customer complaints.",
    category: "考研高频"
  },
  {
    word: "enmity",
    phonetic: "[ˈenməti]",
    enDefinition: "The state or feeling of being actively opposed or hostile to someone or something.",
    zhDefinition: "n. 敌意；仇恨",
    example: "There is a long history of enmity between the two neighboring countries.",
    category: "考研高频"
  },

  // --- 第56组 ---
  {
    word: "fickle",
    phonetic: "[ˈfɪkl]",
    enDefinition: "Changing frequently, especially as regards one's loyalties, interests, or affection.",
    zhDefinition: "adj. 善变的；薄情的",
    example: "The stock market can be a fickle thing, changing direction in an instant.",
    category: "考研高频"
  },
  {
    word: "gall",
    phonetic: "[ɡɔːl]",
    enDefinition: "Bold and impudent behavior.",
    zhDefinition: "n. 厚颜无耻；胆大妄为；怨恨",
    example: "I can't believe he had the gall to ask for a promotion after failing his project.",
    category: "考研高频"
  },
  {
    word: "haggard",
    phonetic: "[ˈhæɡəd]",
    enDefinition: "Looking exhausted and unwell, especially from fatigue, worry, or suffering.",
    zhDefinition: "adj. 憔悴的；形容枯槁的",
    example: "He looked haggard and worn out after a week of working late every night.",
    category: "考研高频"
  },
  {
    word: "improvident",
    phonetic: "[ɪmˈprɒvɪdənt]",
    enDefinition: "Not having or showing foresight; spendthrift or thoughtless.",
    zhDefinition: "adj. 挥霍的；不顾未来的",
    example: "His improvident lifestyle eventually led him into a massive amount of debt.",
    category: "考研高频"
  },
  {
    word: "jaunty",
    phonetic: "[ˈdʒɔːnti]",
    enDefinition: "Having or expressing a lively, cheerful, and self-confident manner.",
    zhDefinition: "adj. 得意洋洋的；活泼的",
    example: "He walked with a jaunty step, whistling a happy tune as he went.",
    category: "考研高频"
  },
  {
    word: "knotty",
    phonetic: "[ˈnɒti]",
    enDefinition: "(Of a problem or matters) extremely difficult or intricate.",
    zhDefinition: "adj. 棘手的；复杂的",
    example: "The committee is still trying to resolve the knotty issue of budget allocation.",
    category: "考研高频"
  },
  {
    word: "languish",
    phonetic: "[ˈlæŋɡwɪʃ]",
    enDefinition: "(Of a person or other living thing) lose or lack vitality; grow weak or feeble.",
    zhDefinition: "v. 变得衰弱；受苦；（在某地）被长期冷落",
    example: "The bill has been languishing in Congress for months without any action.",
    category: "考研高频"
  },
  {
    word: "maudlin",
    phonetic: "[ˈmɔːdlɪn]",
    enDefinition: "Self-pityingly or tearfully sentimental, often through drunkenness.",
    zhDefinition: "adj. 感情脆弱的；伤感的",
    example: "He became maudlin after a few drinks, talking about his lost youth.",
    category: "考研高频"
  },
  {
    word: "noxious",
    phonetic: "[ˈnɒkʃəs]",
    enDefinition: "Harmful, poisonous, or very unpleasant.",
    zhDefinition: "adj. 有害的；有毒的",
    example: "The factory was closed down due to the release of noxious gases into the air.",
    category: "考研高频"
  },
  {
    word: "occult",
    phonetic: "[ɒˈkʌlt]",
    enDefinition: "Supernatural, mystical, or magical beliefs, practices, or phenomena.",
    zhDefinition: "adj. 神秘的；玄奥的 n. 神秘学",
    example: "He has always had a fascination with the occult and ancient mysteries.",
    category: "考研高频"
  },

  // --- 第57组 ---
  {
    word: "penury",
    phonetic: "[ˈpenjəri]",
    enDefinition: "Extreme poverty; destitution.",
    zhDefinition: "n. 贫困；贫穷",
    example: "He died in penury, despite having been a famous artist in his youth.",
    category: "考研高频"
  },
  {
    word: "quandary",
    phonetic: "[ˈkwɒndəri]",
    enDefinition: "A state of perplexity or uncertainty over what to do in a difficult situation.",
    zhDefinition: "n. 困惑；窘境",
    example: "I'm in a bit of a quandary about whether to accept the new job offer.",
    category: "考研高频"
  },
  {
    word: "rapport",
    phonetic: "[ræˈpɔː(r)]",
    enDefinition: "A close and harmonious relationship in which the people or groups concerned understand each other's feelings or ideas and communicate well.",
    zhDefinition: "n. 融洽的关系；和谐",
    example: "She has an excellent rapport with her students, making her a popular teacher.",
    category: "考研高频"
  },
  {
    word: "scathing",
    phonetic: "[ˈskeɪðɪŋ]",
    enDefinition: "Witheringly scornful; severely critical.",
    zhDefinition: "adj. 严厉的；尖刻的；伤人的",
    example: "The critic wrote a scathing review of the new play, calling it a complete disaster.",
    category: "考研高频"
  },
  {
    word: "tractable",
    phonetic: "[ˈtræktəbl]",
    enDefinition: "(Of a person or animal) easy to control or influence.",
    zhDefinition: "adj. 易处理的；温顺的",
    example: "The problem proved to be more tractable than we had initially thought.",
    category: "考研高频"
  },
  {
    word: "abate",
    phonetic: "[əˈbeɪt]",
    enDefinition: "(Of something perceived as hostile, threatening, or negative) become less intense or widespread.",
    zhDefinition: "v. 减轻；减少；废除",
    example: "The storm finally began to abate as we reached the safety of the harbor.",
    category: "考研高频"
  },
  {
    word: "bequeath",
    phonetic: "[bɪˈkwiːð]",
    enDefinition: "Leave (a personal estate or one's body) to a person or other beneficiary by a will.",
    zhDefinition: "v. 遗赠；传下",
    example: "He bequeathed his extensive library to the local university.",
    category: "考研高频"
  },
  {
    word: "captious",
    phonetic: "[ˈkæpʃəs]",
    enDefinition: "(Of a person) tending to find fault or raise petty objections.",
    zhDefinition: "adj. 吹毛求疵的；爱挑剔的",
    example: "I found his captious comments on the report to be very discouraging.",
    category: "考研高频"
  },
  {
    word: "disdain",
    phonetic: "[dɪsˈdeɪn]",
    enDefinition: "The feeling that someone or something is unworthy of one's consideration or respect; contempt.",
    zhDefinition: "v./n. 蔑视；鄙视",
    example: "She looked at the messy room with an expression of disdain.",
    category: "考研高频"
  },
  {
    word: "enunciate",
    phonetic: "[ɪˈnʌnsieɪt]",
    enDefinition: "Say or pronounce clearly.",
    zhDefinition: "v. 清晰地发音；阐明（理论等）",
    example: "The speaker tried to enunciate every word so that everyone could understand.",
    category: "考研高频"
  },

  // --- 第58组 ---
  {
    word: "flippant",
    phonetic: "[ˈflɪpənt]",
    enDefinition: "Not showing a serious or respectful attitude.",
    zhDefinition: "adj. 轻率的；无礼的",
    example: "His flippant response to the judge's question got him into more trouble.",
    category: "考研高频"
  },
  {
    word: "garnish",
    phonetic: "[ˈɡɑːnɪʃ]",
    enDefinition: "Decorate or embellish (something, especially food).",
    zhDefinition: "v. 装饰；点缀 n. 装饰物",
    example: "The dish was garnished with fresh herbs to make it more attractive.",
    category: "考研高频"
  },
  {
    word: "heinous",
    phonetic: "[ˈheɪnəs]",
    enDefinition: "(Of a person or wrongful act, especially a crime) utterly odious or wicked.",
    zhDefinition: "adj. 极恶毒的；可憎的",
    example: "The terrorist attack was a heinous crime that shocked the entire world.",
    category: "考研高频"
  },
  {
    word: "improvisation",
    phonetic: "[ˌɪmprəvaɪˈzeɪʃn]",
    enDefinition: "The action of improvising.",
    zhDefinition: "n. 即兴创作；临时凑合",
    example: "The jazz musician is famous for his incredible improvisation during live shows.",
    category: "考研高频"
  },
  {
    word: "jaunt",
    phonetic: "[dʒɔːnt]",
    enDefinition: "A short excursion or journey for pleasure.",
    zhDefinition: "n. 短途旅行；郊游",
    example: "We took a quick jaunt to the coast over the weekend.",
    category: "考研高频"
  },
  {
    word: "knave",
    phonetic: "[neɪv]",
    enDefinition: "A dishonest or unscrupulous man.",
    zhDefinition: "n. 恶棍；骗子",
    example: "He proved to be a knave who had stolen money from his own family.",
    category: "考研高频"
  },
  {
    word: "lament",
    phonetic: "[ləˈment]",
    enDefinition: "A passionate expression of grief or sorrow.",
    zhDefinition: "v./n. 哀悼；痛惜；挽歌",
    example: "Many people lament the loss of the old buildings in the city center.",
    category: "考研高频"
  },
  {
    word: "mettle",
    phonetic: "[ˈmetl]",
    enDefinition: "A person's ability to cope well with difficulties or to face a demanding situation in a spirited and resilient way.",
    zhDefinition: "n. 勇气；奋斗精神",
    example: "The marathon will really test the mettle of the young runners.",
    category: "考研高频"
  },
  {
    word: "nonentity",
    phonetic: "[nɒˈnentəti]",
    enDefinition: "A person or thing with no special or interesting qualities; an unimportant person or thing.",
    zhDefinition: "n. 无足轻重的人；不存在的事物",
    example: "Before he won the lottery, he was a complete nonentity that no one noticed.",
    category: "考研高频"
  },
  {
    word: "oust",
    phonetic: "[aʊst]",
    enDefinition: "Drive out or expel (someone) from a position or place.",
    zhDefinition: "v. 驱逐；罢免",
    example: "The board of directors voted to oust the CEO after a series of failures.",
    category: "考研高频"
  },

  // --- 第59组 ---
  {
    word: "propensity",
    phonetic: "[prəˈpensəti]",
    enDefinition: "An inclination or natural tendency to behave in a particular way.",
    zhDefinition: "n. 倾向；习性",
    example: "He has a propensity for getting into trouble whenever he's alone.",
    category: "考研高频"
  },
  {
    word: "qualm",
    phonetic: "[kwɑːm]",
    enDefinition: "An uneasy feeling of doubt, worry, or fear, especially about one's own conduct; a misgiving.",
    zhDefinition: "n. 疑虑；不安",
    example: "She had some qualms about accepting the job, as it required a lot of travel.",
    category: "考研高频"
  },
  {
    word: "resonance",
    phonetic: "[ˈrezənəns]",
    enDefinition: "The quality in a sound of being deep, full, and echoing; (of an idea or action) the power to evoke images, memories, and emotions.",
    zhDefinition: "n. 共鸣；反响；共振",
    example: "The speaker's words had a deep resonance with the young audience.",
    category: "考研高频"
  },
  {
    word: "sedition",
    phonetic: "[sɪˈdɪʃn]",
    enDefinition: "Conduct or speech inciting people to rebel against the authority of a state or monarch.",
    zhDefinition: "n. 煽动叛乱；暴动罪",
    example: "The writer was arrested and charged with sedition for his revolutionary pamphlets.",
    category: "考研高频"
  },
  {
    word: "temporal",
    phonetic: "[ˈtempərəl]",
    enDefinition: "Relating to worldly as opposed to spiritual affairs; secular; relating to time.",
    zhDefinition: "adj. 世俗的；时间的；暂时的",
    example: "The Church's influence on temporal matters has declined over the centuries.",
    category: "考研高频"
  },
  {
    word: "unequivocal",
    phonetic: "[ˌʌnɪˈkwɪvəkl]",
    enDefinition: "Leaving no doubt; unambiguous.",
    zhDefinition: "adj. 明确的；毫不含糊的",
    example: "The committee's response to the proposal was an unequivocal 'no'.",
    category: "考研高频"
  },
  {
    word: "versatile",
    phonetic: "[ˈvɜːsətaɪl]",
    enDefinition: "Able to adapt or be adapted to many different functions or activities.",
    zhDefinition: "adj. 多才多艺的；万用的",
    example: "He is a versatile actor who is equally at home in comedy or drama.",
    category: "考研高频"
  },
  {
    word: "wreak",
    phonetic: "[riːk]",
    enDefinition: "Cause (a large amount of damage or harm).",
    zhDefinition: "v. 造成（破坏）；发泄（愤怒）",
    example: "The storm wreaked havoc across the coastal region, destroying many homes.",
    category: "考研高频"
  },
  {
    word: "xenophile",
    phonetic: "[ˈzenəfaɪl]",
    enDefinition: "A person who is attracted to foreign peoples, cultures, or customs.",
    zhDefinition: "n. 崇外者；喜欢外国事物的人",
    example: "As a lifelong xenophile, he has lived in five different countries and speaks six languages.",
    category: "考研高频"
  },
  {
    word: "zephyr",
    phonetic: "[ˈzefə(r)]",
    enDefinition: "A soft gentle breeze.",
    zhDefinition: "n. 和风；微风",
    example: "A gentle zephyr blew through the open window, cooling the room.",
    category: "考研高频"
  },

  // --- 第60组 ---
  {
    word: "advocate",
    phonetic: "[ˈædvəkeɪt]",
    enDefinition: "A person who publicly supports or recommends a particular cause or policy.",
    zhDefinition: "v. 提倡；支持 n. 拥护者；律师",
    example: "She is a strong advocate for environmental protection and renewable energy.",
    category: "考研高频"
  },
  {
    word: "brevity",
    phonetic: "[ˈbrevəti]",
    enDefinition: "Concise and exact use of words in writing or speech.",
    zhDefinition: "n. 简洁；简短",
    example: "The brevity of the report was appreciated by the busy executives.",
    category: "考研高频"
  },
  {
    word: "concur",
    phonetic: "[kənˈkɜː(r)]",
    enDefinition: "Be of the same opinion; agree.",
    zhDefinition: "v. 同意；一致；同时发生",
    example: "Most of the board members concurred with the chairman's decision.",
    category: "考研高频"
  },
  {
    word: "discrete",
    phonetic: "[dɪˈskriːt]",
    enDefinition: "Individually separate and distinct.",
    zhDefinition: "adj. 离散的；不连续的；单独的",
    example: "The research project is divided into several discrete stages.",
    category: "考研高频"
  },
  {
    word: "eminent",
    phonetic: "[ˈemɪnənt]",
    enDefinition: "(Of a person) famous and respected within a particular sphere or profession.",
    zhDefinition: "adj. 杰出的；著名的",
    example: "An eminent scientist was invited to give the keynote speech at the conference.",
    category: "考研高频"
  },
  {
    word: "fathom",
    phonetic: "[ˈfæðəm]",
    enDefinition: "Understand (a difficult problem or an enigmatic person) after much thought.",
    zhDefinition: "v. 理解；领悟；测深",
    example: "I still cannot fathom why she decided to quit such a good job.",
    category: "考研高频"
  },
  {
    word: "gravity",
    phonetic: "[ˈɡrævəti]",
    enDefinition: "Extreme or alarming importance; seriousness.",
    zhDefinition: "n. 严重性；庄重；重力",
    example: "The government failed to realize the gravity of the situation until it was too late.",
    category: "考研高频"
  },
  {
    word: "harbinger",
    phonetic: "[ˈhɑːbɪndʒə(r)]",
    enDefinition: "A person or thing that announces or signals the approach of another.",
    zhDefinition: "n. 先驱；预兆",
    example: "The appearance of the first flowers is a harbinger of spring.",
    category: "考研高频"
  },
  {
    word: "innate",
    phonetic: "[ɪˈneɪt]",
    enDefinition: "Inborn; natural.",
    zhDefinition: "adj. 先天的；固有的",
    example: "She has an innate talent for music and began playing the piano at age three.",
    category: "考研高频"
  },
  {
    word: "jubilant",
    phonetic: "[ˈdʒuːbɪlənt]",
    enDefinition: "Feeling or expressing great happiness and triumph.",
    zhDefinition: "adj. 欢欣鼓舞的；喜气洋洋的",
    example: "The fans were jubilant after their team won the championship.",
    category: "考研高频"
  },

  // --- 第61组 ---
  {
    word: "subjugate",
    phonetic: "[ˈsʌbdʒuɡeɪt]",
    enDefinition: "Bring under domination or control, especially by conquest.",
    zhDefinition: "v. 征服；使服从；抑制",
    example: "The invaders managed to subjugate the local population within months.",
    category: "考研高频"
  },
  {
    word: "parsimonious",
    phonetic: "[ˌpɑːsɪˈməʊniəs]",
    enDefinition: "Unwilling to spend money or use resources; stingy or frugal.",
    zhDefinition: "adj. 吝啬的；过于节俭的",
    example: "The government's parsimonious approach to social welfare has been widely criticized.",
    category: "考研高频"
  },
  {
    word: "inimitable",
    phonetic: "[ɪˈnɪmɪtəbl]",
    enDefinition: "So good or unusual as to be impossible to copy; unique.",
    zhDefinition: "adj. 独特的；无与伦比的；不可模仿的",
    example: "He entertained the audience in his own inimitable style.",
    category: "考研高频"
  },
  {
    word: "fortitude",
    phonetic: "[ˈfɔːtɪtjuːd]",
    enDefinition: "Courage in pain or adversity.",
    zhDefinition: "n. 刚毅；不屈不挠；勇气",
    example: "She endured her long illness with great spiritual fortitude.",
    category: "考研高频"
  },
  {
    word: "impeccable",
    phonetic: "[ɪmˈpekəbl]",
    enDefinition: "(Of behavior, performance, or appearance) in accordance with the highest standards of propriety; faultless.",
    zhDefinition: "adj. 无瑕疵的；完美的；无可挑剔的",
    example: "His English is impeccable, without even a trace of an accent.",
    category: "考研高频"
  },
  {
    word: "laudable",
    phonetic: "[ˈlɔːdəbl]",
    enDefinition: "(Of an action, idea, or goal) deserving praise and commendation.",
    zhDefinition: "adj. 值得赞美的；称赞的",
    example: "While the goal is laudable, the methods used to achieve it are questionable.",
    category: "考研高频"
  },
  {
    word: "reciprocal",
    phonetic: "[rɪˈsɪprəkl]",
    enDefinition: "Given, felt, or done in return.",
    zhDefinition: "adj. 互惠的；相互的；倒数的",
    example: "The two nations agreed to a reciprocal trade agreement.",
    category: "考研高频"
  },
  {
    word: "subsidize",
    phonetic: "[ˈsʌbsɪdaɪz]",
    enDefinition: "Support (an organization or activity) financially.",
    zhDefinition: "v. 资助；给...补助金",
    example: "The government continues to subsidize public transportation to keep fares low.",
    category: "考研高频"
  },
  {
    word: "unilateral",
    phonetic: "[ˌjuːniˈlætrəl]",
    enDefinition: "(Of an action or decision) performed by or affecting only one person, group, or country involved in a particular situation, without the agreement of another or the others.",
    zhDefinition: "adj. 单方面的；单边的",
    example: "The country took a unilateral decision to withdraw from the international treaty.",
    category: "考研高频"
  },
  {
    word: "abdicate",
    phonetic: "[ˈæbdɪkeɪt]",
    enDefinition: "Renounce one's throne; fail to fulfill or undertake (a responsibility or duty).",
    zhDefinition: "v. 退位；放弃（责任或权力）",
    example: "The government was accused of abdicating its responsibility to the poor.",
    category: "考研高频"
  },

  // --- 第62组 ---
  {
    word: "collaborate",
    phonetic: "[kəˈlæbəreɪt]",
    enDefinition: "Work jointly on an activity, especially to produce or create something.",
    zhDefinition: "v. 合作；协作",
    example: "Researchers from different universities collaborated on the study.",
    category: "考研高频"
  },
  {
    word: "deteriorate",
    phonetic: "[dɪˈtɪəriəreɪt]",
    enDefinition: "Become progressively worse.",
    zhDefinition: "v. 恶化；退化",
    example: "The relationship between the two countries continued to deteriorate throughout the year.",
    category: "考研高频"
  },
  {
    word: "emancipate",
    phonetic: "[ɪˈmænsɪpeɪt]",
    enDefinition: "Set free, especially from legal, social, or political restrictions.",
    zhDefinition: "v. 解放；释放",
    example: "The new law was intended to emancipate women from traditional social constraints.",
    category: "考研高频"
  },
  {
    word: "generalize",
    phonetic: "[ˈdʒenrəlaɪz]",
    enDefinition: "Make a general or broad statement by inferring from specific cases.",
    zhDefinition: "v. 概括；推广；普及",
    example: "It is difficult to generalize about the habits of such a diverse group of people.",
    category: "考研高频"
  },
  {
    word: "hypothetical",
    phonetic: "[ˌhaɪpəˈθetɪkl]",
    enDefinition: "Based on or serving as a hypothesis.",
    zhDefinition: "adj. 假设的；假定的",
    example: "The scientist used a hypothetical situation to explain the complex theory.",
    category: "考研高频"
  },
  {
    word: "incite",
    phonetic: "[ɪnˈsaɪt]",
    enDefinition: "Encourage or stir up (violent or unlawful behavior).",
    zhDefinition: "v. 煽动；激起",
    example: "He was arrested for trying to incite a riot among the protesters.",
    category: "考研高频"
  },
  {
    word: "jargon",
    phonetic: "[ˈdʒɑːɡən]",
    enDefinition: "Special words or expressions that are used by a particular profession or group and are difficult for others to understand.",
    zhDefinition: "n. 行话；行业术语",
    example: "The report was so full of technical jargon that I couldn't understand a word of it.",
    category: "考研高频"
  },
  {
    word: "kinship",
    phonetic: "[ˈkɪnʃɪp]",
    enDefinition: "Blood relationship; a sharing of characteristics or origins.",
    zhDefinition: "n. 亲属关系；亲切感；类似",
    example: "The explorers felt a certain kinship with the local people they encountered.",
    category: "考研高频"
  },
  {
    word: "mediocre",
    phonetic: "[ˌmiːdiˈəʊkə(r)]",
    enDefinition: "Of only moderate quality; not very good.",
    zhDefinition: "adj. 平庸的；普通的",
    example: "The movie received only mediocre reviews from the critics.",
    category: "考研高频"
  },
  {
    word: "orthodox",
    phonetic: "[ˈɔːθədɒks]",
    enDefinition: "(Of a person or their views, especially religious or political ones, or other beliefs or practices) conforming to what is generally or traditionally accepted as right or true; established and approved.",
    zhDefinition: "adj. 正统的；传统的；惯常的",
    example: "His orthodox approach to medicine was challenged by more modern theories.",
    category: "考研高频"
  },

  // --- 第63组 ---
  {
    word: "paradox",
    phonetic: "[ˈpærədɒks]",
    enDefinition: "A seemingly absurd or self-contradictory statement or proposition that when investigated or explained may prove to be well founded or true.",
    zhDefinition: "n. 悖论；自相矛盾的人或事",
    example: "It is a paradox that the more money he earns, the more miserable he seems to become.",
    category: "考研高频"
  },
  {
    word: "reconcile",
    phonetic: "[ˈrekənsaɪl]",
    enDefinition: "Restore friendly relations between.",
    zhDefinition: "v. 使和解；调和；使一致",
    example: "It is sometimes difficult to reconcile career ambitions with family responsibilities.",
    category: "考研高频"
  },
  {
    word: "speculate",
    phonetic: "[ˈspekjuleɪt]",
    enDefinition: "Form a theory or conjecture about a subject without firm evidence.",
    zhDefinition: "v. 推测；投机",
    example: "Experts speculate that the economy will begin to recover next year.",
    category: "考研高频"
  },
  {
    word: "theoretical",
    phonetic: "[ˌθɪəˈretɪkl]",
    enDefinition: "Concerned with or involving the theory of a subject or area of study rather than its practical application.",
    zhDefinition: "adj. 理论上的；假设的",
    example: "The study provides a theoretical framework for future research on the topic.",
    category: "考研高频"
  },
  {
    word: "unanimous",
    phonetic: "[juˈnænɪməs]",
    enDefinition: "(Of two or more people) fully in agreement.",
    zhDefinition: "adj. 全体一致的；无异议的",
    example: "The committee reached a unanimous decision to approve the new project.",
    category: "考研高频"
  },
  {
    word: "validate",
    phonetic: "[ˈvælɪdeɪt]",
    enDefinition: "Check or prove the validity or accuracy of (something).",
    zhDefinition: "v. 证实；使生效；批准",
    example: "The results of the second experiment served to validate the findings of the first.",
    category: "考研高频"
  },
  {
    word: "boisterous",
    phonetic: "[ˈbɔɪstərəs]",
    enDefinition: "(Of a person, event, or behavior) noisy, energetic, and cheerful; rowdy.",
    zhDefinition: "adj. 喧闹的；狂暴的；精力充沛的",
    example: "The classroom was filled with boisterous children waiting for the party to start.",
    category: "考研高频"
  },
  {
    word: "corroborate",
    phonetic: "[kəˈrɒbəreɪt]",
    enDefinition: "Confirm or give support to (a statement, theory, or finding).",
    zhDefinition: "v. 证实；支持（证据等）",
    example: "Several witnesses were able to corroborate the man's story.",
    category: "考研高频"
  },
  {
    word: "formidable",
    phonetic: "[ˈfɔːmɪdəbl]",
    enDefinition: "Inspiring fear or respect through being impressively large, powerful, intense, or capable.",
    zhDefinition: "adj. 可怕的；难对付的；令人敬畏的",
    example: "The team faced a formidable opponent in the final round of the competition.",
    category: "考研高频"
  },
  {
    word: "grueling",
    phonetic: "[ˈɡruːəlɪŋ]",
    enDefinition: "Extremely tiring and demanding.",
    zhDefinition: "adj. 繁重而累人的；惩罚性的",
    example: "After a grueling 12-hour flight, they were finally able to rest.",
    category: "考研高频"
  },

  // --- 第64组 ---
  {
    word: "hinder",
    phonetic: "[ˈhɪndə(r)]",
    enDefinition: "Create difficulties for (someone or something), resulting in delay or obstruction.",
    zhDefinition: "v. 阻碍；妨碍",
    example: "A lack of resources could hinder the progress of the research project.",
    category: "考研高频"
  },
  {
    word: "imminent",
    phonetic: "[ˈɪmɪnənt]",
    enDefinition: "About to happen.",
    zhDefinition: "adj. 即将来临的；迫近的",
    example: "The dark clouds were a sign that a storm was imminent.",
    category: "考研高频"
  },
  {
    word: "malice",
    phonetic: "[ˈmælɪs]",
    enDefinition: "The intention or desire to do evil; ill will.",
    zhDefinition: "n. 恶意；怨恨",
    example: "The gossip was spread with the clear intention of causing malice.",
    category: "考研高频"
  },
  {
    word: "negligible",
    phonetic: "[ˈneɡlɪdʒəbl]",
    enDefinition: "So small or unimportant as to be not worth considering; insignificant.",
    zhDefinition: "adj. 微不足道的；可忽略的",
    example: "The difference in price between the two products is negligible.",
    category: "考研高频"
  },
  {
    word: "perceptive",
    phonetic: "[pəˈseptɪv]",
    enDefinition: "Having or showing sensitive insight.",
    zhDefinition: "adj. 洞察力强的；敏锐的",
    example: "His perceptive comments on the situation helped us see the problem more clearly.",
    category: "考研高频"
  },
  {
    word: "relinquish",
    phonetic: "[rɪˈlɪŋkwɪʃ]",
    enDefinition: "Voluntarily cease to keep or claim; give up.",
    zhDefinition: "v. 放弃；松开；让渡",
    example: "The king was forced to relinquish his throne and leave the country.",
    category: "考研高频"
  },
  {
    word: "strenuous",
    phonetic: "[ˈstrenjuəs]",
    enDefinition: "Requiring or using great exertion.",
    zhDefinition: "adj. 艰苦的；费力的；剧烈的",
    example: "Avoid strenuous exercise for a few days after the surgery.",
    category: "考研高频"
  },
  {
    word: "turbulent",
    phonetic: "[ˈtɜːbjələnt]",
    enDefinition: "Characterized by conflict, disorder, or confusion; not controlled or calm.",
    zhDefinition: "adj. 动荡的；骚乱的；汹涌的",
    example: "The country has experienced a turbulent period of political change.",
    category: "考研高频"
  },
  {
    word: "unfathomable",
    phonetic: "[ʌnˈfæðəməbl]",
    enDefinition: "Incapable of being fully explored or understood.",
    zhDefinition: "adj. 深不可测的；难以理解的",
    example: "The motivations behind his sudden departure remain unfathomable.",
    category: "考研高频"
  },
  {
    word: "affluence",
    phonetic: "[ˈæfluəns]",
    enDefinition: "The state of having a great deal of money; wealth.",
    zhDefinition: "n. 富裕；富饶",
    example: "The city's rapid growth has led to a significant increase in overall affluence.",
    category: "考研高频"
  },

  // --- 第65组 ---
  {
    word: "bristle",
    phonetic: "[ˈbrɪsl]",
    enDefinition: "(Of a person) react angrily or defensively, typically by drawing oneself up.",
    zhDefinition: "v. 发怒；竖起；充满",
    example: "He began to bristle at the suggestion that he was being dishonest.",
    category: "考研高频"
  },
  {
    word: "divergent",
    phonetic: "[daɪˈvɜːdʒənt]",
    enDefinition: "Tending to be different or develop in different directions.",
    zhDefinition: "adj. 分歧的；相异的；发散的",
    example: "The two countries have divergent interests when it comes to trade policy.",
    category: "考研高频"
  },
  {
    word: "equate",
    phonetic: "[ɪˈkweɪt]",
    enDefinition: "Consider (one thing) to be the same as or equivalent to another.",
    zhDefinition: "v. 等同；使相等",
    example: "You cannot simply equate wealth with happiness.",
    category: "考研高频"
  },
  {
    word: "gilded",
    phonetic: "[ˈɡɪldɪd]",
    enDefinition: "Wealthy and privileged.",
    zhDefinition: "adj. 镀金的；虚饰的；富有特权的",
    example: "He was part of the gilded youth of the 1920s, spending his nights in exclusive clubs.",
    category: "考研高频"
  },
  {
    word: "implication",
    phonetic: "[ˌɪmplɪˈkeɪʃn]",
    enDefinition: "The conclusion that can be drawn from something although it is not explicitly stated.",
    zhDefinition: "n. 暗示；含义；牵连",
    example: "The study has important implications for how we treat the disease.",
    category: "考研高频"
  },
  {
    word: "justification",
    phonetic: "[ˌdʒʌstɪfɪˈkeɪʃn]",
    enDefinition: "The action of showing something to be right or reasonable.",
    zhDefinition: "n. 理由；辩解；正当性",
    example: "There is no possible justification for such violent behavior.",
    category: "考研高频"
  },
  {
    word: "legitimate",
    phonetic: "[ləˈdʒɪtɪmət]",
    enDefinition: "Conforming to the law or to rules.",
    zhDefinition: "adj. 合法的；正当的；合理的",
    example: "The government has a legitimate concern about the rise in crime rates.",
    category: "考研高频"
  },
  {
    word: "mandatory",
    phonetic: "[ˈmændətəri]",
    enDefinition: "Required by law or rules; compulsory.",
    zhDefinition: "adj. 强制的；义务的；托管的",
    example: "It is mandatory for all students to attend the orientation session.",
    category: "考研高频"
  },
  {
    word: "overlook",
    phonetic: "[ˌəʊvəˈlʊk]",
    enDefinition: "Fail to notice or consider.",
    zhDefinition: "v. 忽视；俯瞰；宽容",
    example: "It's easy to overlook some of the smaller details when you're in a hurry.",
    category: "考研高频"
  },
  {
    word: "perspective",
    phonetic: "[pəˈspektɪv]",
    enDefinition: "A particular attitude toward or way of regarding something; a point of view.",
    zhDefinition: "n. 观点；远景；透视图",
    example: "The book provides a fresh perspective on the history of the region.",
    category: "考研高频"
  },

  // --- 第66组 ---
  {
    word: "quota",
    phonetic: "[ˈkwəʊtə]",
    enDefinition: "A fixed share of something that a person or group is entitled to receive or is bound to contribute.",
    zhDefinition: "n. 配额；限额",
    example: "The government has set a quota on the number of immigrants allowed into the country each year.",
    category: "考研高频"
  },
  {
    word: "rationale",
    phonetic: "[ˌræʃəˈnɑːl]",
    enDefinition: "A set of reasons or a logical basis for a course of action or a particular belief.",
    zhDefinition: "n. 根本原因；逻辑依据",
    example: "The rationale behind the decision was to improve efficiency and reduce costs.",
    category: "考研高频"
  },
  {
    word: "skeptic",
    phonetic: "[ˈskeptɪk]",
    enDefinition: "A person inclined to question or doubt all accepted opinions.",
    zhDefinition: "n. 怀疑论者",
    example: "While many were excited about the new technology, some skeptics remained unconvinced.",
    category: "考研高频"
  },
  {
    word: "trivial",
    phonetic: "[ˈtrɪviəl]",
    enDefinition: "Of little value or importance.",
    zhDefinition: "adj. 琐碎的；不重要的",
    example: "We shouldn't waste our time on such trivial matters when there are more important issues to address.",
    category: "考研高频"
  },
  {
    word: "verifiable",
    phonetic: "[ˈverɪfaɪəbl]",
    enDefinition: "Able to be checked or demonstrated to be true, accurate, or justified.",
    zhDefinition: "adj. 可证实的；可检验的",
    example: "The claims made in the advertisement were not easily verifiable.",
    category: "考研高频"
  },
  {
    word: "widespread",
    phonetic: "[ˈwaɪdspred]",
    enDefinition: "Found or distributed over a large area or among many people.",
    zhDefinition: "adj. 广泛的；普遍的",
    example: "There is widespread concern about the impact of climate change on the environment.",
    category: "考研高频"
  },
  {
    word: "abundance",
    phonetic: "[əˈbʌndəns]",
    enDefinition: "A very large quantity of something.",
    zhDefinition: "n. 丰富；充裕",
    example: "The area is known for its abundance of natural resources.",
    category: "考研高频"
  },
  {
    word: "albeit",
    phonetic: "[ˌɔːlˈbiːɪt]",
    enDefinition: "Although.",
    zhDefinition: "conj. 尽管；虽然",
    example: "The project was a success, albeit a very expensive one.",
    category: "考研高频"
  },
  {
    word: "reinforce",
    phonetic: "[ˌriːɪnˈfɔːs]",
    enDefinition: "Strengthen or support, especially with additional personnel or material.",
    zhDefinition: "v. 加强；加固；补充",
    example: "The manager's comments served to reinforce the importance of safety in the workplace.",
    category: "考研高频"
  },
  {
    word: "complement",
    phonetic: "[ˈkɒmplɪment]",
    enDefinition: "A thing that completes or brings to perfection.",
    zhDefinition: "v./n. 补充；补足；配套",
    example: "The new software is designed to complement our existing systems perfectly.",
    category: "考研高频"
  },

  // --- 第67组 ---
  {
    word: "endure",
    phonetic: "[ɪnˈdjʊə(r)]",
    enDefinition: "Suffer (something painful or difficult) patiently.",
    zhDefinition: "v. 忍受；持久",
    example: "The company has managed to endure several economic downturns over the years.",
    category: "考研高频"
  },
  {
    word: "flourish",
    phonetic: "[ˈflʌrɪʃ]",
    enDefinition: "(Of a person, animal, or other living organism) grow or develop in a healthy or vigorous way, especially as the result of a particularly favorable environment.",
    zhDefinition: "v. 繁荣；茂盛；挥舞",
    example: "The local economy began to flourish after the new factory opened.",
    category: "考研高频"
  },
  {
    word: "glimpse",
    phonetic: "[ɡlɪmps]",
    enDefinition: "A momentary or partial view.",
    zhDefinition: "n./v. 一瞥；瞥见",
    example: "The documentary provides a fascinating glimpse into the lives of ancient people.",
    category: "考研高频"
  },
  {
    word: "supremacy",
    phonetic: "[suːˈpreməsi]",
    enDefinition: "The state or condition of being superior to all others in authority, power, or status.",
    zhDefinition: "n. 至高无上；优势；霸权",
    example: "The battle was fought to establish naval supremacy in the region.",
    category: "考研高频"
  },
  {
    word: "intrinsic",
    phonetic: "[ɪnˈtrɪnzɪk]",
    enDefinition: "Belonging naturally; essential.",
    zhDefinition: "adj. 本质的；固有的",
    example: "The value of the painting is intrinsic, not just based on its age or artist.",
    category: "考研高频"
  },
  {
    word: "jeopardize",
    phonetic: "[ˈdʒepədaɪz]",
    enDefinition: "Put (someone or something) into a situation in which there is a danger of loss, harm, or failure.",
    zhDefinition: "v. 危及；危害",
    example: "One small mistake could jeopardize the entire project.",
    category: "考研高频"
  },
  {
    word: "ignite",
    phonetic: "[ɪɡˈnaɪt]",
    enDefinition: "Catch fire or cause to catch fire.",
    zhDefinition: "v. 点燃；激起",
    example: "The speaker's words served to ignite a passionate debate among the audience.",
    category: "考研高频"
  },
  {
    word: "lucrative",
    phonetic: "[ˈluːkrətɪv]",
    enDefinition: "Producing a great deal of profit.",
    zhDefinition: "adj. 获利丰厚的；有利可图的",
    example: "He left his job to start a lucrative business in the tech industry.",
    category: "考研高频"
  },
  {
    word: "manifest",
    phonetic: "[ˈmænɪfest]",
    enDefinition: "Display or show (a quality or feeling) by one's acts or appearance; demonstrate.",
    zhDefinition: "v. 表现；证明 adj. 明显的",
    example: "The symptoms of the disease usually manifest within a few days of infection.",
    category: "考研高频"
  },
  {
    word: "notorious",
    phonetic: "[nəʊˈtɔːriəs]",
    enDefinition: "Famous or well known, typically for some bad quality or deed.",
    zhDefinition: "adj. 声名狼藉的；臭名昭著的",
    example: "The area is notorious for its high crime rates and drug problems.",
    category: "考研高频"
  },

  // --- 第68组 ---
  {
    word: "obsolete",
    phonetic: "[ˈɒbsəliːt]",
    enDefinition: "No longer produced or used; out of date.",
    zhDefinition: "adj. 废弃的；过时的",
    example: "Many traditional skills are becoming obsolete in the digital age.",
    category: "考研高频"
  },
  {
    word: "paramount",
    phonetic: "[ˈpærəmaʊnt]",
    enDefinition: "More important than anything else; supreme.",
    zhDefinition: "adj. 最重要的；首要的",
    example: "The safety of the passengers is of paramount importance to the airline.",
    category: "考研高频"
  },
  {
    word: "quantitative",
    phonetic: "[ˈkwɒntɪtətɪv]",
    enDefinition: "Relating to, measuring, or measured by the quantity of something rather than its quality.",
    zhDefinition: "adj. 定量的；数量的",
    example: "The researchers conducted a quantitative study to measure the impact of the new policy.",
    category: "考研高频"
  },
  {
    word: "resilience",
    phonetic: "[rɪˈzɪliəns]",
    enDefinition: "The capacity to recover quickly from difficulties; toughness.",
    zhDefinition: "n. 恢复力；韧性",
    example: "The city's residents showed great resilience in the aftermath of the disaster.",
    category: "考研高频"
  },
  {
    word: "scrutiny",
    phonetic: "[ˈskruːtəni]",
    enDefinition: "Critical observation or examination.",
    zhDefinition: "n. 详细审查；监视",
    example: "The government's actions have come under intense scrutiny from the press.",
    category: "考研高频"
  },
  {
    word: "threshold",
    phonetic: "[ˈθreʃhəʊld]",
    enDefinition: "The magnitude or intensity that must be exceeded for a certain reaction, phenomenon, result, or condition to occur or be manifested.",
    zhDefinition: "n. 门槛；临界值；开端",
    example: "The study showed that there is a threshold beyond which the noise becomes harmful.",
    category: "考研高频"
  },
  {
    word: "utterly",
    phonetic: "[ˈʌtəli]",
    enDefinition: "Completely and without qualification; absolutely.",
    zhDefinition: "adv. 完全地；彻底地",
    example: "The situation was utterly hopeless, and they knew it.",
    category: "考研高频"
  },
  {
    word: "witness",
    phonetic: "[ˈwɪtnəs]",
    enDefinition: "A person who sees an event, typically a crime or accident, take place.",
    zhDefinition: "n. 证人；见证人 v. 目击",
    example: "Several people were able to witness the accident and provide details to the police.",
    category: "考研高频"
  },
  {
    word: "yield",
    phonetic: "[jiːld]",
    enDefinition: "Produce or provide (a natural, agricultural, or industrial product).",
    zhDefinition: "v. 产出；投降；让步 n. 产量",
    example: "The new farming methods are expected to significantly increase crop yields.",
    category: "考研高频"
  },
  {
    word: "ardent",
    phonetic: "[ˈɑːdnt]",
    enDefinition: "Enthusiastic or passionate.",
    zhDefinition: "adj. 热情的；热烈的",
    example: "She is an ardent supporter of the arts and regularly attends the theater.",
    category: "考研高频"
  },

  // --- 第69组 ---
  {
    word: "intermittent",
    phonetic: "[ˌɪntəˈmɪtənt]",
    enDefinition: "Occurring at irregular intervals; not continuous or steady.",
    zhDefinition: "adj. 间歇的；断断续续的",
    example: "The radio signal was intermittent, making it difficult to hear the news.",
    category: "考研高频"
  },
  {
    word: "incessant",
    phonetic: "[ɪnˈsesnt]",
    enDefinition: "(Of something regarded as unpleasant) continuing without pause or interruption.",
    zhDefinition: "adj. 不断的；连续的（常指令人不快的事）",
    example: "The incessant noise from the construction site was very annoying.",
    category: "考研高频"
  },
  {
    word: "precipitous",
    phonetic: "[prɪˈsɪpɪtəs]",
    enDefinition: "Dangerously high or steep; (of a change to a worse situation or condition) sudden and dramatic.",
    zhDefinition: "adj. 陡峭的；急剧的",
    example: "The stock market experienced a precipitous drop in prices yesterday.",
    category: "考研高频"
  },
  {
    word: "provisional",
    phonetic: "[prəˈvɪʒənl]",
    enDefinition: "Arranged or existing for the present, possibly to be changed later.",
    zhDefinition: "adj. 临时的；暂定的",
    example: "A provisional agreement was reached between the two parties.",
    category: "考研高频"
  },
  {
    word: "reiterate",
    phonetic: "[riˈɪtəreɪt]",
    enDefinition: "Say something again or a number of times, typically for emphasis or clarity.",
    zhDefinition: "v. 重申；反复说",
    example: "The manager reiterated the importance of following safety procedures.",
    category: "考研高频"
  },
  {
    word: "stagnate",
    phonetic: "[ˈstæɡneɪt]",
    enDefinition: "(Of water or air) cease to flow or move; become stagnant.",
    zhDefinition: "v. 停滞；不景气",
    example: "The economy began to stagnate after several years of rapid growth.",
    category: "考研高频"
  },
  {
    word: "subsidiary",
    phonetic: "[səbˈsɪdiəri]",
    enDefinition: "Less important than but related or supplementary to something.",
    zhDefinition: "adj. 附属的；辅助的 n. 子公司",
    example: "The company has several subsidiary firms operating in different countries.",
    category: "考研高频"
  },
  {
    word: "indispensable",
    phonetic: "[ˌɪndɪˈspensəbl]",
    enDefinition: "Absolutely necessary.",
    zhDefinition: "adj. 必不可少的；不可或缺的",
    example: "Computers have become an indispensable part of our daily lives.",
    category: "考研高频"
  },
  {
    word: "arbitrary",
    phonetic: "[ˈɑːbɪtrəri]",
    enDefinition: "Based on random choice or personal whim, rather than any reason or system.",
    zhDefinition: "adj. 任意的；武断的；专制的",
    example: "The decision was made in an arbitrary manner, without consulting anyone.",
    category: "考研高频"
  },
  {
    word: "discrepancy",
    phonetic: "[dɪˈskrepənsi]",
    enDefinition: "A lack of compatibility or similarity between two or more facts.",
    zhDefinition: "n. 差异；不一致",
    example: "There is a significant discrepancy between the two sets of data.",
    category: "考研高频"
  },

  // --- 第70组 ---
  {
    word: "cognitive",
    phonetic: "[ˈkɒɡnətɪv]",
    enDefinition: "Relating to the mental action or process of acquiring knowledge and understanding through thought, experience, and the senses.",
    zhDefinition: "adj. 认知的；认识的",
    example: "Cognitive psychology explores how we think, learn, and remember information.",
    category: "考研高频"
  },
  {
    word: "socioeconomic",
    phonetic: "[ˌsəʊsiəʊˌiːkəˈnɒmɪk]",
    enDefinition: "Relating to or concerned with the interaction of social and economic factors.",
    zhDefinition: "adj. 社会经济的",
    example: "The study explores the socioeconomic impact of the new tax laws on low-income families.",
    category: "考研高频"
  },
  {
    word: "infrastructure",
    phonetic: "[ˈɪnfrəstrʌktʃə(r)]",
    enDefinition: "The basic physical and organizational structures and facilities (e.g., buildings, roads, power supplies) needed for the operation of a society or enterprise.",
    zhDefinition: "n. 基础设施；下层结构",
    example: "The government is investing heavily in the country's transportation infrastructure.",
    category: "考研高频"
  },
  {
    word: "sustainability",
    phonetic: "[səˌsteɪnəˈbɪləti]",
    enDefinition: "The ability to be maintained at a certain rate or level.",
    zhDefinition: "n. 可持续性",
    example: "The company is committed to the long-term sustainability of its business operations.",
    category: "考研高频"
  },
  {
    word: "digitalization",
    phonetic: "[ˌdɪdʒɪtəlaɪˈzeɪʃn]",
    enDefinition: "The conversion of text, pictures, or sound into a digital form that can be processed by a computer.",
    zhDefinition: "n. 数字化",
    example: "The digitalization of historical records has made them much easier for researchers to access.",
    category: "考研高频"
  },
  {
    word: "globalization",
    phonetic: "[ˌɡləʊbəlaɪˈzeɪʃn]",
    enDefinition: "The process by which businesses or other organizations develop international influence or start operating on an international scale.",
    zhDefinition: "n. 全球化",
    example: "Globalization has led to increased competition and cooperation between nations.",
    category: "考研高频"
  },
  {
    word: "polarization",
    phonetic: "[ˌpəʊləraɪˈzeɪʃn]",
    enDefinition: "Division into two sharply contrasting groups or sets of opinions or beliefs.",
    zhDefinition: "n. 两极分化；极化",
    example: "The country has experienced increasing political polarization in recent years.",
    category: "考研高频"
  },
  {
    word: "marginalize",
    phonetic: "[ˈmɑːdʒɪnəlaɪz]",
    enDefinition: "Treat (a person, group, or concept) as insignificant or peripheral.",
    zhDefinition: "v. 使边缘化；排斥",
    example: "Certain groups in society feel that they have been marginalized by the government.",
    category: "考研高频"
  },
  {
    word: "empowerment",
    phonetic: "[ɪmˈpaʊəmənt]",
    enDefinition: "Authority or power given to someone to do something.",
    zhDefinition: "n. 授权；许可；赋能",
    example: "The organization's goal is the empowerment of women through education and training.",
    category: "考研高频"
  },
  {
    word: "underlie",
    phonetic: "[ˌʌndəˈlaɪ]",
    enDefinition: "Be the cause or basis of (something).",
    zhDefinition: "v. 构成...的基础；引起",
    example: "What are the fundamental principles that underlie the country's legal system?",
    category: "考研高频"
  },

  // --- 第71组 ---
  {
    word: "circumscribe",
    phonetic: "[ˈsɜːkəmskraɪb]",
    enDefinition: "Restrict (something) within limits.",
    zhDefinition: "v. 限制；约束；在...周围画线",
    example: "The power of the monarch was significantly circumscribed by the new constitution.",
    category: "考研高频"
  },
  {
    word: "proclivity",
    phonetic: "[prəˈklɪvəti]",
    enDefinition: "A tendency to choose or do something regularly; an inclination or predisposition toward a particular thing.",
    zhDefinition: "n. 倾向；癖性；嗜好",
    example: "He has a proclivity for hard work and long hours, which helped him succeed.",
    category: "考研高频"
  },
  {
    word: "auspicious",
    phonetic: "[ɔːˈspɪʃəs]",
    enDefinition: "Conducive to success; favorable.",
    zhDefinition: "adj. 吉利的；幸运的；有望成功的",
    example: "The success of the first product was an auspicious start for the new company.",
    category: "考研高频"
  },
  {
    word: "incumbent",
    phonetic: "[ɪnˈkʌmbənt]",
    enDefinition: "Necessary for (someone) as a duty or responsibility.",
    zhDefinition: "adj. 现任的；义不容辞的 n. 在职者",
    example: "It is incumbent upon all citizens to vote in the upcoming elections.",
    category: "考研高频"
  },
  {
    word: "plausible",
    phonetic: "[ˈplɔːzəbl]",
    enDefinition: "(Of an argument or statement) seeming reasonable or probable.",
    zhDefinition: "adj. 似有道理的；可信的；花言巧语的",
    example: "The witness provided a plausible explanation for his absence during the crime.",
    category: "考研高频"
  },
  {
    word: "tenets",
    phonetic: "[ˈtenɪts]",
    enDefinition: "A principle or belief, especially one of the main principles of a religion or philosophy.",
    zhDefinition: "n. 信条；原则；教义",
    example: "One of the central tenets of democracy is the right to free speech.",
    category: "考研高频"
  },
  {
    word: "consensus",
    phonetic: "[kənˈsensəs]",
    enDefinition: "A general agreement.",
    zhDefinition: "n. 共识；一致同意",
    example: "The committee finally reached a consensus on the new budget proposal.",
    category: "考研高频"
  },
  {
    word: "ambiguity",
    phonetic: "[ˌæmbɪˈɡjuːəti]",
    enDefinition: "The quality of being open to more than one interpretation; inexactness.",
    zhDefinition: "n. 模棱两可；含糊不清",
    example: "The ambiguity of the contract's language led to several legal disputes.",
    category: "考研高频"
  },
  {
    word: "autonomy",
    phonetic: "[ɔːˈtɒnəmi]",
    enDefinition: "The right or condition of self-government.",
    zhDefinition: "n. 自治；自主权",
    example: "The region is seeking greater autonomy from the central government.",
    category: "考研高频"
  },
  {
    word: "unprecedented",
    phonetic: "[ʌnˈpresɪdentɪd]",
    enDefinition: "Never done or known before.",
    zhDefinition: "adj. 前所未有的；史无前例的",
    example: "The company has experienced an unprecedented level of growth over the past year.",
    category: "考研高频"
  },

  // --- 第72组 ---
  {
    word: "stipulate",
    phonetic: "[ˈstɪpjuleɪt]",
    enDefinition: "Demand or specify (a requirement), typically as part of a bargain or agreement.",
    zhDefinition: "v. 规定；保证；约定",
    example: "The contract stipulates that all work must be completed by the end of the month.",
    category: "考研高频"
  },
  {
    word: "proliferation",
    phonetic: "[prəˌlɪfəˈreɪʃn]",
    enDefinition: "Rapid increase in numbers.",
    zhDefinition: "n. 增殖；激增；扩散",
    example: "The proliferation of nuclear weapons remains a major threat to global security.",
    category: "考研高频"
  },
  {
    word: "sovereignty",
    phonetic: "[ˈsɒvrənti]",
    enDefinition: "Supreme power or authority.",
    zhDefinition: "n. 主权；自主；统治权",
    example: "The country is determined to protect its national sovereignty at all costs.",
    category: "考研高频"
  },
  {
    word: "vulnerable",
    phonetic: "[ˈvʌlnərəbl]",
    enDefinition: "Susceptible to physical or emotional attack or harm.",
    zhDefinition: "adj. 易受攻击的；脆弱的",
    example: "Children are often the most vulnerable members of society during a crisis.",
    category: "考研高频"
  },
  {
    word: "scrutinize",
    phonetic: "[ˈskruːtənaɪz]",
    enDefinition: "Examine or inspect closely and thoroughly.",
    zhDefinition: "v. 仔细检查；彻查",
    example: "The government's spending habits are being closely scrutinized by the press.",
    category: "考研高频"
  },
  {
    word: "relegate",
    phonetic: "[ˈrelɪɡeɪt]",
    enDefinition: "Consign or dismiss to an inferior rank or position.",
    zhDefinition: "v. 降级；贬低；驱逐",
    example: "The team was relegated to the second division after a series of poor performances.",
    category: "考研高频"
  },
  {
    word: "paradigm",
    phonetic: "[ˈpærədaɪm]",
    enDefinition: "A typical example or pattern of something; a model.",
    zhDefinition: "n. 范式；典范",
    example: "The discovery of DNA led to a paradigm shift in the field of biology.",
    category: "考研高频"
  },
  {
    word: "manifestation",
    phonetic: "[ˌmænɪfeˈsteɪʃn]",
    enDefinition: "An event, action, or object that clearly shows or embodies something, especially a theory or an abstract idea.",
    zhDefinition: "n. 表现；显示；示威运动",
    example: "The protest was a clear manifestation of the public's anger over the new tax laws.",
    category: "考研高频"
  },
  {
    word: "integrity",
    phonetic: "[ɪnˈteɡrəti]",
    enDefinition: "The quality of being honest and having strong moral principles; moral uprightness.",
    zhDefinition: "n. 正直；诚实；完整",
    example: "He is a man of great integrity who always does what he believes is right.",
    category: "考研高频"
  },
  {
    word: "hegemony",
    phonetic: "[hɪˈɡeməni]",
    enDefinition: "Leadership or dominance, especially by one country or social group over others.",
    zhDefinition: "n. 霸权；领导权",
    example: "The country has long sought to maintain its hegemony in the region.",
    category: "考研高频"
  },

  // --- 第73组 ---
  {
    word: "empirical",
    phonetic: "[ɪmˈpɪrɪkl]",
    enDefinition: "Based on, concerned with, or verifiable by observation or experience rather than theory or pure logic.",
    zhDefinition: "adj. 经验主义的；实证的",
    example: "The study provides empirical evidence to support the theory of climate change.",
    category: "考研高频"
  },
  {
    word: "discrepancy",
    phonetic: "[dɪˈskrepənsi]",
    enDefinition: "A lack of compatibility or similarity between two or more facts.",
    zhDefinition: "n. 差异；不一致",
    example: "The accountant found a significant discrepancy in the company's financial records.",
    category: "考研高频"
  },
  {
    word: "cognitive",
    phonetic: "[ˈkɒɡnətɪv]",
    enDefinition: "Relating to the mental action or process of acquiring knowledge and understanding through thought, experience, and the senses.",
    zhDefinition: "adj. 认知的；认识的",
    example: "Cognitive development is an essential part of early childhood education.",
    category: "考研高频"
  },
  {
    word: "benevolent",
    phonetic: "[bəˈnevələnt]",
    enDefinition: "Well meaning and kindly.",
    zhDefinition: "adj. 仁慈的；慈善的",
    example: "A benevolent donor provided the funds needed to build the new library.",
    category: "考研高频"
  },
  {
    word: "aspiration",
    phonetic: "[ˌæspəˈreɪʃn]",
    enDefinition: "A hope or ambition of achieving something.",
    zhDefinition: "n. 抱负；渴望；志向",
    example: "She has high aspirations for her future career in the medical field.",
    category: "考研高频"
  },
  {
    word: "ambiguous",
    phonetic: "[æmˈbɪɡjuəs]",
    enDefinition: "Open to more than one interpretation; not having one obvious meaning.",
    zhDefinition: "adj. 模棱两可的；含糊不清的",
    example: "The instructions were so ambiguous that no one knew what to do.",
    category: "考研高频"
  },
  {
    word: "adversary",
    phonetic: "[ˈædvəsəri]",
    enDefinition: "One's opponent in a contest, conflict, or dispute.",
    zhDefinition: "n. 对手；敌手",
    example: "The two politicians have been adversaries for many years.",
    category: "考研高频"
  },
  {
    word: "absurd",
    phonetic: "[əbˈsɜːd]",
    enDefinition: "Wildly unreasonable, illogical, or inappropriate.",
    zhDefinition: "adj. 荒谬的；可笑的",
    example: "The idea that pigs can fly is completely absurd.",
    category: "考研高频"
  },
  {
    word: "vantage",
    phonetic: "[ˈvɑːntɪdʒ]",
    enDefinition: "A place or position affording a good view of something.",
    zhDefinition: "n. 优势；有利地位",
    example: "From our vantage point on the hill, we could see the entire valley below.",
    category: "考研高频"
  },
  {
    word: "ubiquitous",
    phonetic: "[juːˈbɪkwɪtəs]",
    enDefinition: "Present, appearing, or found everywhere.",
    zhDefinition: "adj. 无处不在的；普遍存在的",
    example: "Cell phones have become ubiquitous in modern society.",
    category: "考研高频"
  },

  // --- 第74组 ---
  {
    word: "synergy",
    phonetic: "[ˈsɪnədʒi]",
    enDefinition: "The interaction or cooperation of two or more organizations, substances, or other agents to produce a combined effect greater than the sum of their separate effects.",
    zhDefinition: "n. 协同作用；增效作用",
    example: "The merger was expected to create significant synergy between the two companies.",
    category: "考研高频"
  },
  {
    word: "susceptible",
    phonetic: "[səˈseptəbl]",
    enDefinition: "Likely or liable to be influenced or harmed by a particular thing.",
    zhDefinition: "adj. 易受影响的；敏感的；易受伤害的",
    example: "Elderly people are more susceptible to the flu and other viruses.",
    category: "考研高频"
  },
  {
    word: "stifling",
    phonetic: "[ˈstaɪflɪŋ]",
    enDefinition: "(Of a situation) making one feel constrained or oppressed.",
    zhDefinition: "adj. 令人窒息的；沉闷的；抑止的",
    example: "The stifling heat in the room made it difficult to concentrate.",
    category: "考研高频"
  },
  {
    word: "spontaneous",
    phonetic: "[spɒnˈteɪniəs]",
    enDefinition: "Performed or occurring as a result of a sudden inner impulse or inclination and without premeditation or external stimulus.",
    zhDefinition: "adj. 自发的；自然的；无意识的",
    example: "The crowd erupted into spontaneous applause when the performance ended.",
    category: "考研高频"
  },
  {
    word: "scrutiny",
    phonetic: "[ˈskruːtəni]",
    enDefinition: "Critical observation or examination.",
    zhDefinition: "n. 详细审查；仔细观察",
    example: "The company's financial records are under intense scrutiny from the authorities.",
    category: "考研高频"
  },
  {
    word: "robust",
    phonetic: "[rəʊˈbʌst]",
    enDefinition: "Strong and healthy; vigorous.",
    zhDefinition: "adj. 强健的；耐用的；坚固的",
    example: "The company has a robust system in place to protect against cyber attacks.",
    category: "考研高频"
  },
  {
    word: "rigorous",
    phonetic: "[ˈrɪɡərəs]",
    enDefinition: "Extremely thorough, exhaustive, or accurate.",
    zhDefinition: "adj. 严密的；严格的；严厉的",
    example: "The candidates underwent a rigorous selection process to be chosen for the role.",
    category: "考研高频"
  },
  {
    word: "retrospect",
    phonetic: "[ˈretrəspekt]",
    enDefinition: "A survey or review of a past course of events or period of time.",
    zhDefinition: "n. 回顾；回想",
    example: "In retrospect, it's clear that the decision to invest in the project was a mistake.",
    category: "考研高频"
  },
  {
    word: "reputable",
    phonetic: "[ˈrepjutəbl]",
    enDefinition: "Having a good reputation.",
    zhDefinition: "adj. 声誉好的；可尊敬的",
    example: "It is important to buy products from reputable companies that stand behind their work.",
    category: "考研高频"
  },
  {
    word: "relinquish",
    phonetic: "[rɪˈlɪŋkwɪʃ]",
    enDefinition: "Voluntarily cease to keep or claim; give up.",
    zhDefinition: "v. 放弃；松开；撤回",
    example: "The king was forced to relinquish his power to the people.",
    category: "考研高频"
  },

  // --- 第75组 ---
  {
    word: "qualitative",
    phonetic: "[ˈkwɒlɪtətɪv]",
    enDefinition: "Relating to, measuring, or measured by the quality of something rather than its quantity.",
    zhDefinition: "adj. 定性的；性质上的",
    example: "The researchers conducted a qualitative study to understand student motivations.",
    category: "考研高频"
  },
  {
    word: "prudent",
    phonetic: "[ˈpruːdnt]",
    enDefinition: "Acting with or showing care and thought for the future.",
    zhDefinition: "adj. 审慎的；精明的；节俭的",
    example: "It is always prudent to have a backup plan in case something goes wrong.",
    category: "考研高频"
  },
  {
    word: "prevalent",
    phonetic: "[ˈprevələnt]",
    enDefinition: "Widespread in a particular area or at a particular time.",
    zhDefinition: "adj. 流行的；普遍的",
    example: "Smoking is much less prevalent today than it was thirty years ago.",
    category: "考研高频"
  },
  {
    word: "precarious",
    phonetic: "[prɪˈkeəriəs]",
    enDefinition: "Not securely held or in position; dangerously likely to fall or collapse.",
    zhDefinition: "adj. 危险的；不稳定的",
    example: "The museum's financial position is precarious, and it may have to close.",
    category: "考研高频"
  },
  {
    word: "perspective",
    phonetic: "[pəˈspektɪv]",
    enDefinition: "A particular attitude toward or way of regarding something; a point of view.",
    zhDefinition: "n. 观点；远景；洞察力",
    example: "The book provides a fresh perspective on the history of the region.",
    category: "考研高频"
  },
  {
    word: "perceptive",
    phonetic: "[pəˈseptɪv]",
    enDefinition: "Having or showing sensitive insight.",
    zhDefinition: "adj. 敏锐的；洞察力强的",
    example: "His perceptive analysis of the problem helped us find a solution quickly.",
    category: "考研高频"
  },
  {
    word: "paramount",
    phonetic: "[ˈpærəmaʊnt]",
    enDefinition: "More important than anything else; supreme.",
    zhDefinition: "adj. 最重要的；首要的",
    example: "The safety of the passengers is of paramount importance to the airline.",
    category: "考研高频"
  },
  {
    word: "paradox",
    phonetic: "[ˈpærədɒks]",
    enDefinition: "A seemingly absurd or self-contradictory statement or proposition that when investigated or explained may prove to be well founded or true.",
    zhDefinition: "n. 悖论；自相矛盾的人或事",
    example: "It is a paradox that the more money he earns, the less happy he seems to be.",
    category: "考研高频"
  },
  {
    word: "obsolete",
    phonetic: "[ˈɒbsəliːt]",
    enDefinition: "No longer produced or used; out of date.",
    zhDefinition: "adj. 废弃的；过时的",
    example: "Many traditional manufacturing methods are becoming obsolete in the digital age.",
    category: "考研高频"
  },
  {
    word: "notorious",
    phonetic: "[nəʊˈtɔːriəs]",
    enDefinition: "Famous or well known, typically for some bad quality or deed.",
    zhDefinition: "adj. 声名狼藉的；臭名昭著的",
    example: "The area is notorious for its high crime rates and poverty.",
    category: "考研高频"
  },

  // --- 第76组 ---
  {
    word: "mitigate",
    phonetic: "[ˈmɪtɪɡeɪt]",
    enDefinition: "Make less severe, serious, or painful.",
    zhDefinition: "v. 减轻；缓和",
    example: "The government has taken steps to mitigate the effects of the economic crisis.",
    category: "考研高频"
  },
  {
    word: "manifest",
    phonetic: "[ˈmænɪfest]",
    enDefinition: "Clear or obvious to the eye or mind.",
    zhDefinition: "v. 表明；显示 adj. 明显的",
    example: "The symptoms of the disease usually manifest within a few days of infection.",
    category: "考研高频"
  },
  {
    word: "lucrative",
    phonetic: "[ˈluːkrətɪv]",
    enDefinition: "Producing a great deal of profit.",
    zhDefinition: "adj. 有利可图的；获利的",
    example: "He left his job to start a lucrative business in the tech industry.",
    category: "考研高频"
  },
  {
    word: "legitimate",
    phonetic: "[ləˈdʒɪtɪmət]",
    enDefinition: "Conforming to the law or to rules.",
    zhDefinition: "adj. 合法的；合理的；正当的",
    example: "The company has a legitimate concern about the rise in competition.",
    category: "考研高频"
  },
  {
    word: "intrinsic",
    phonetic: "[ɪnˈtrɪnzɪk]",
    enDefinition: "Belonging naturally; essential.",
    zhDefinition: "adj. 本质的；固有的",
    example: "The value of the diamond is intrinsic, not just based on its popularity.",
    category: "考研高频"
  },
  {
    word: "intermittent",
    phonetic: "[ˌɪntəˈmɪtənt]",
    enDefinition: "Occurring at irregular intervals; not continuous or steady.",
    zhDefinition: "adj. 间歇的；断断续续的",
    example: "The radio signal was intermittent, making it difficult to hear the news.",
    category: "考研高频"
  },
  {
    word: "innovation",
    phonetic: "[ˌɪnəˈveɪʃn]",
    enDefinition: "The action or process of innovating.",
    zhDefinition: "n. 创新；变革",
    example: "Technological innovation has transformed the way we communicate and work.",
    category: "考研高频"
  },
  {
    word: "indispensable",
    phonetic: "[ˌɪndɪˈspensəbl]",
    enDefinition: "Absolutely necessary.",
    zhDefinition: "adj. 必不可少的；必需的",
    example: "Computers have become an indispensable part of modern life.",
    category: "考研高频"
  },
  {
    word: "imminent",
    phonetic: "[ˈɪmɪnənt]",
    enDefinition: "About to happen.",
    zhDefinition: "adj. 即将来临的；迫近的",
    example: "The dark clouds were a sign that a storm was imminent.",
    category: "考研高频"
  },
  {
    word: "hypothesis",
    phonetic: "[haɪˈpɒθəsɪs]",
    enDefinition: "A supposition or proposed explanation made on the basis of limited evidence as a starting point for further investigation.",
    zhDefinition: "n. 假设；假说",
    example: "The researchers conducted an experiment to test their hypothesis.",
    category: "考研高频"
  },

  // --- 第77组 ---
  {
    word: "homogeneity",
    phonetic: "[ˌhɒmədʒəˈniːəti]",
    enDefinition: "The quality or state of being all of the same or a similar kind or nature.",
    zhDefinition: "n. 同质性；均匀性",
    example: "The population of the small town was marked by a high degree of homogeneity.",
    category: "考研高频"
  },
  {
    word: "globalization",
    phonetic: "[ˌɡləʊbəlaɪˈzeɪʃn]",
    enDefinition: "The process by which businesses or other organizations develop international influence or start operating on an international scale.",
    zhDefinition: "n. 全球化",
    example: "Globalization has led to increased competition and cooperation among nations.",
    category: "考研高频"
  },
  {
    word: "formidable",
    phonetic: "[ˈfɔːmɪdəbl]",
    enDefinition: "Inspiring fear or respect through being impressively large, powerful, intense, or capable.",
    zhDefinition: "adj. 可怕的；难对付的；令人敬畏的",
    example: "The team faced a formidable opponent in the final round of the competition.",
    category: "考研高频"
  },
  {
    word: "flourish",
    phonetic: "[ˈflʌrɪʃ]",
    enDefinition: "(Of a person, animal, or other living organism) grow or develop in a healthy or vigorous way, especially as the result of a particularly favorable environment.",
    zhDefinition: "v. 繁荣；茂盛；挥舞",
    example: "The local economy began to flourish after the new factory opened.",
    category: "考研高频"
  },
  {
    word: "feasible",
    phonetic: "[ˈfiːzəbl]",
    enDefinition: "Possible to do easily or conveniently.",
    zhDefinition: "adj. 可行的；可能的",
    example: "The project is technically feasible, but it would be very expensive to implement.",
    category: "考研高频"
  },
  {
    word: "equilibrium",
    phonetic: "[ˌiːkwɪˈlɪbriəm]",
    enDefinition: "A state in which opposing forces or influences are balanced.",
    zhDefinition: "n. 平衡；均势",
    example: "The market reached an equilibrium price where supply met demand.",
    category: "考研高频"
  },
  {
    word: "endure",
    phonetic: "[ɪnˈdjʊə(r)]",
    enDefinition: "Suffer (something painful or difficult) patiently.",
    zhDefinition: "v. 忍受；持久",
    example: "The company has managed to endure several economic downturns over the years.",
    category: "考研高频"
  },
  {
    word: "efficacy",
    phonetic: "[ˈefɪkəsi]",
    enDefinition: "The ability to produce a desired or intended result.",
    zhDefinition: "n. 功效；效力",
    example: "Scientists are still testing the efficacy of the new vaccine.",
    category: "考研高频"
  },
  {
    word: "diversity",
    phonetic: "[daɪˈvɜːsəti]",
    enDefinition: "The state of being diverse; variety.",
    zhDefinition: "n. 多样性；差异",
    example: "The university is committed to promoting diversity among its student body.",
    category: "考研高频"
  },
  {
    word: "deteriorate",
    phonetic: "[dɪˈtɪəriəreɪt]",
    enDefinition: "Become progressively worse.",
    zhDefinition: "v. 恶化；退化",
    example: "The patient's condition began to deteriorate rapidly after the surgery.",
    category: "考研高频"
  },

  // --- 第78组 ---
  {
    word: "consensus",
    phonetic: "[kənˈsensəs]",
    enDefinition: "A general agreement.",
    zhDefinition: "n. 共识；一致意见",
    example: "The committee reached a consensus on the new budget proposal.",
    category: "考研高频"
  },
  {
    word: "collaborate",
    phonetic: "[kəˈlæbəreɪt]",
    enDefinition: "Work jointly on an activity, especially to produce or create something.",
    zhDefinition: "v. 合作；协作",
    example: "Researchers from different universities collaborated on the project.",
    category: "考研高频"
  },
  {
    word: "cognition",
    phonetic: "[kɒɡˈnɪʃn]",
    enDefinition: "The mental action or process of acquiring knowledge and understanding through thought, experience, and the senses.",
    zhDefinition: "n. 认知；认识能力",
    example: "As we age, our cognitive abilities naturally begin to decline.",
    category: "考研高频"
  },
  {
    word: "aspiration",
    phonetic: "[ˌæspəˈreɪʃn]",
    enDefinition: "A hope or ambition of achieving something.",
    zhDefinition: "n. 志向；渴望；呼吸",
    example: "She has high aspirations for her future career in politics.",
    category: "考研高频"
  },
  {
    word: "articulate",
    phonetic: "[ɑːˈtɪkjuleɪt]",
    enDefinition: "(Of a person or a person's words) having or showing the ability to speak fluently and coherently.",
    zhDefinition: "v. 清楚地表达 adj. 口才好的",
    example: "He was an articulate speaker who could explain complex ideas clearly.",
    category: "考研高频"
  },
  {
    word: "advocate",
    phonetic: "[ˈædvəkeɪt]",
    enDefinition: "A person who publicly supports or recommends a particular cause or policy.",
    zhDefinition: "v. 提倡；支持 n. 拥护者",
    example: "She is a strong advocate for environmental protection and renewable energy.",
    category: "考研高频"
  },
  {
    word: "abundance",
    phonetic: "[əˈbʌndəns]",
    enDefinition: "A very large quantity of something.",
    zhDefinition: "n. 丰富；充裕",
    example: "The area is known for its abundance of natural resources.",
    category: "考研高频"
  },
  {
    word: "abstract",
    phonetic: "[ˈæbstrækt]",
    enDefinition: "Existing in thought or as an idea but not having a physical or concrete existence.",
    zhDefinition: "adj. 抽象的 n. 摘要",
    example: "The concept of justice is an abstract idea that is difficult to define.",
    category: "考研高频"
  },
  {
    word: "yield",
    phonetic: "[jiːld]",
    enDefinition: "Produce or provide (a natural, agricultural, or industrial product).",
    zhDefinition: "v. 产出；屈服 n. 产量",
    example: "The new farming techniques are expected to increase crop yields significantly.",
    category: "考研高频"
  },
  {
    word: "vulnerable",
    phonetic: "[ˈvʌlnərəbl]",
    enDefinition: "Susceptible to physical or emotional attack or harm.",
    zhDefinition: "adj. 脆弱的；易受影响的",
    example: "Children and elderly people are often the most vulnerable during a crisis.",
    category: "考研高频"
  },

  // --- 第79组 ---
  {
    word: "validate",
    phonetic: "[ˈvælɪdeɪt]",
    enDefinition: "Check or prove the validity or accuracy of (something).",
    zhDefinition: "v. 证实；使生效；批准",
    example: "The results of the second study served to validate the findings of the first.",
    category: "考研高频"
  },
  {
    word: "unprecedented",
    phonetic: "[ʌnˈpresɪdentɪd]",
    enDefinition: "Never done or known before.",
    zhDefinition: "adj. 史无前例的；空前的",
    example: "The country has experienced an unprecedented level of economic growth.",
    category: "考研高频"
  },
  {
    word: "sustainable",
    phonetic: "[səˈsteɪnəbl]",
    enDefinition: "Able to be maintained at a certain rate or level.",
    zhDefinition: "adj. 可持续的；可以养活的",
    example: "The company is committed to the sustainable development of its business operations.",
    category: "考研高频"
  },
  {
    word: "stagnation",
    phonetic: "[stæɡˈneɪʃn]",
    enDefinition: "The state of not flowing or moving.",
    zhDefinition: "n. 停滞；不景气",
    example: "The economy has been in a state of stagnation for several years.",
    category: "考研高频"
  },
  {
    word: "solidarity",
    phonetic: "[ˌsɒlɪˈdærəti]",
    enDefinition: "Unity or agreement of feeling or action, especially among individuals with a common interest; mutual support within a group.",
    zhDefinition: "n. 团结；一致性",
    example: "The workers showed great solidarity during the strike for better pay.",
    category: "考研高频"
  },
  {
    word: "skepticism",
    phonetic: "[ˈskeptɪsɪzəm]",
    enDefinition: "A skeptical attitude; doubt as to the truth of something.",
    zhDefinition: "n. 怀疑论；怀疑态度",
    example: "There is a great deal of skepticism about the government's ability to solve the crisis.",
    category: "考研高频"
  },
  {
    word: "scrutinize",
    phonetic: "[ˈskruːtənaɪz]",
    enDefinition: "Examine or inspect closely and thoroughly.",
    zhDefinition: "v. 仔细检查；彻查",
    example: "The government's spending habits are being closely scrutinized by the press.",
    category: "考研高频"
  },
  {
    word: "robust",
    phonetic: "[rəʊˈbʌst]",
    enDefinition: "Strong and healthy; vigorous.",
    zhDefinition: "adj. 强健的；坚固的；耐用的",
    example: "The company has a robust system in place to protect against cyber attacks.",
    category: "考研高频"
  },
  {
    word: "resonance",
    phonetic: "[ˈrezənəns]",
    enDefinition: "The quality in a sound of being deep, full, and echoing.",
    zhDefinition: "n. 共鸣；反响；共振",
    example: "The speaker's words had a deep resonance with the young audience.",
    category: "考研高频"
  },
  {
    word: "relinquish",
    phonetic: "[rɪˈlɪŋkwɪʃ]",
    enDefinition: "Voluntarily cease to keep or claim; give up.",
    zhDefinition: "v. 放弃；松开；撤回",
    example: "The king was forced to relinquish his power to the people.",
    category: "考研高频"
  },

  // --- 第80组 ---
  {
    word: "quantitative",
    phonetic: "[ˈkwɒntɪtətɪv]",
    enDefinition: "Relating to, measuring, or measured by the quantity of something rather than its quality.",
    zhDefinition: "adj. 定量的；数量的",
    example: "The researchers conducted a quantitative study to measure the impact of the new policy.",
    category: "考研高频"
  },
  {
    word: "prevalent",
    phonetic: "[ˈprevələnt]",
    enDefinition: "Widespread in a particular area or at a particular time.",
    zhDefinition: "adj. 流行的；普遍的",
    example: "Smoking is much less prevalent today than it was thirty years ago.",
    category: "考研高频"
  },
  {
    word: "perspective",
    phonetic: "[pəˈspektɪv]",
    enDefinition: "A particular attitude toward or way of regarding something; a point of view.",
    zhDefinition: "n. 观点；远景；洞察力",
    example: "The book provides a fresh perspective on the history of the region.",
    category: "考研高频"
  },
  {
    word: "perceptive",
    phonetic: "[pəˈseptɪv]",
    enDefinition: "Having or showing sensitive insight.",
    zhDefinition: "adj. 敏锐的；洞察力强的",
    example: "His perceptive analysis of the problem helped us find a solution quickly.",
    category: "考研高频"
  },
  {
    word: "paramount",
    phonetic: "[ˈpærəmaʊnt]",
    enDefinition: "More important than anything else; supreme.",
    zhDefinition: "adj. 最重要的；首要的",
    example: "The safety of the passengers is of paramount importance to the airline.",
    category: "考研高频"
  },
  {
    word: "paradox",
    phonetic: "[ˈpærədɒks]",
    enDefinition: "A seemingly absurd or self-contradictory statement or proposition.",
    zhDefinition: "n. 悖论；自相矛盾的人或事",
    example: "It is a paradox that the more money he earns, the less happy he seems to be.",
    category: "考研高频"
  },
  {
    word: "obsolete",
    phonetic: "[ˈɒbsəliːt]",
    enDefinition: "No longer produced or used; out of date.",
    zhDefinition: "adj. 废弃的；过时的",
    example: "Many traditional manufacturing methods are becoming obsolete in the digital age.",
    category: "考研高频"
  },
  {
    word: "notorious",
    phonetic: "[nəʊˈtɔːriəs]",
    enDefinition: "Famous or well known, typically for some bad quality or deed.",
    zhDefinition: "adj. 声名狼藉的；臭名昭著的",
    example: "The area is notorious for its high crime rates and poverty.",
    category: "考研高频"
  },
  {
    word: "mitigate",
    phonetic: "[ˈmɪtɪɡeɪt]",
    enDefinition: "Make less severe, serious, or painful.",
    zhDefinition: "v. 减轻；缓和",
    example: "The government has taken steps to mitigate the effects of the economic crisis.",
    category: "考研高频"
  },
  {
    word: "manifest",
    phonetic: "[ˈmænɪfest]",
    enDefinition: "Clear or obvious to the eye or mind.",
    zhDefinition: "v. 表明；显示 adj. 明显的",
    example: "The symptoms of the disease usually manifest within a few days of infection.",
    category: "考研高频"
  },

  // --- 第81组 ---
  {
    word: "preeminent",
    phonetic: "[priˈemɪnənt]",
    enDefinition: "Surpassing all others; very distinguished in some way.",
    zhDefinition: "adj. 卓越的；杰出的；超群的",
    example: "He is the preeminent scientist in the field of genetic engineering.",
    category: "考研高频"
  },
  {
    word: "prodigious",
    phonetic: "[prəˈdɪdʒəs]",
    enDefinition: "Remarkably or impressively great in extent, size, or degree.",
    zhDefinition: "adj. 巨大的；惊人的；庞大的",
    example: "The project required a prodigious amount of time and effort to complete.",
    category: "考研高频"
  },
  {
    word: "propitious",
    phonetic: "[prəˈpɪʃəs]",
    enDefinition: "Giving or indicating a good chance of success; favorable.",
    zhDefinition: "adj. 吉利的；有利的；合适的",
    example: "The lower interest rates provided a propitious environment for investment.",
    category: "考研高频"
  },
  {
    word: "prowess",
    phonetic: "[ˈpraʊəs]",
    enDefinition: "Skill or expertise in a particular activity or field.",
    zhDefinition: "n. 非凡的技巧；英勇；深厚的造诣",
    example: "His athletic prowess was evident even at a very young age.",
    category: "考研高频"
  },
  {
    word: "pugnacious",
    phonetic: "[pʌɡˈneɪʃəs]",
    enDefinition: "Eager or quick to argue, quarrel, or fight.",
    zhDefinition: "adj. 好斗的；好战的",
    example: "The president was known for his pugnacious attitude towards the press.",
    category: "考研高频"
  },
  {
    word: "purport",
    phonetic: "[pəˈpɔːt]",
    enDefinition: "Appear or claim to be or do something, especially falsely; profess.",
    zhDefinition: "v. 声称；打算 n. 意义；主旨",
    example: "The document purports to show that the company was aware of the risks.",
    category: "考研高频"
  },
  {
    word: "quiescence",
    phonetic: "[kwaɪˈesns]",
    enDefinition: "A state or period of inactivity or dormancy.",
    zhDefinition: "n. 静止；沉默；休眠",
    example: "The volcano has entered a state of quiescence after years of eruption.",
    category: "考研高频"
  },
  {
    word: "rancorous",
    phonetic: "[ˈræŋkərəs]",
    enDefinition: "Characterized by bitterness or resentment.",
    zhDefinition: "adj. 怨恨的；仇恨的；刻毒的",
    example: "The two parties were involved in a rancorous dispute over the land.",
    category: "考研高频"
  },
  {
    word: "rapprochement",
    phonetic: "[ræˈprɒʃmɒ̃]",
    enDefinition: "An establishment or resumption of harmonious relations.",
    zhDefinition: "n. 和解；恢复关系",
    example: "The visit was seen as a sign of rapprochement between the two nations.",
    category: "考研高频"
  },
  {
    word: "recalcitrant",
    phonetic: "[rɪˈkælsɪtrənt]",
    enDefinition: "Obstinately uncooperative toward authority or discipline.",
    zhDefinition: "adj. 顽抗的；不驯服的",
    example: "The recalcitrant child refused to follow the teacher's instructions.",
    category: "考研高频"
  },

  // --- 第82组 ---
  {
    word: "redress",
    phonetic: "[rɪˈdres]",
    enDefinition: "Remedy or set right (an undesirable or unfair situation).",
    zhDefinition: "v./n. 纠正；补救；赔偿",
    example: "The new law is intended to redress the imbalance of power in the workplace.",
    category: "考研高频"
  },
  {
    word: "refutation",
    phonetic: "[ˌrefjuˈteɪʃn]",
    enDefinition: "The action of proving a statement or theory to be wrong or false.",
    zhDefinition: "n. 驳斥；辩驳",
    example: "She provided a convincing refutation of the arguments made by her critics.",
    category: "考研高频"
  },
  {
    word: "reiteration",
    phonetic: "[riːˌɪtəˈreɪʃn]",
    enDefinition: "The action of repeating something, typically for emphasis or clarity.",
    zhDefinition: "n. 反复；重申",
    example: "The manager's reiteration of the company policy was necessary for the new staff.",
    category: "考研高频"
  },
  {
    word: "reproach",
    phonetic: "[rɪˈprəʊtʃ]",
    enDefinition: "Address (someone) in such a way as to express disapproval or disappointment.",
    zhDefinition: "v./n. 责备；指责；耻辱",
    example: "He felt a sense of reproach for not being able to help his friend.",
    category: "考研高频"
  },
  {
    word: "repudiate",
    phonetic: "[rɪˈpjuːdieɪt]",
    enDefinition: "Refuse to accept or be associated with.",
    zhDefinition: "v. 拒绝；否认；批判",
    example: "The candidate repudiated the allegations made by his opponent in the debate.",
    category: "考研高频"
  },
  {
    word: "resignation",
    phonetic: "[ˌrezɪɡˈneɪʃn]",
    enDefinition: "The acceptance of something undesirable but inevitable.",
    zhDefinition: "n. 辞职；听从；顺从",
    example: "She accepted the bad news with a sense of quiet resignation.",
    category: "考研高频"
  },
  {
    word: "resilient",
    phonetic: "[rɪˈzɪliənt]",
    enDefinition: "(Of a person or animal) able to withstand or recover quickly from difficult conditions.",
    zhDefinition: "adj. 有韧性的；能迅速恢复的",
    example: "Children are often more resilient than adults in the face of adversity.",
    category: "考研高频"
  },
  {
    word: "salient",
    phonetic: "[ˈseɪliənt]",
    enDefinition: "Most noticeable or important.",
    zhDefinition: "adj. 显著的；突出的；主要的",
    example: "He summarized the salient points of the report in a few short sentences.",
    category: "考研高频"
  },
  {
    word: "sanctimonious",
    phonetic: "[ˌæŋktɪˈməʊniəs]",
    enDefinition: "Making a show of being morally superior to other people.",
    zhDefinition: "adj. 假装圣洁的；道貌岸然的",
    example: "No one likes his sanctimonious lectures on how we should live our lives.",
    category: "考研高频"
  },
  {
    word: "scanty",
    phonetic: "[ˈskænti]",
    enDefinition: "Small or insufficient in quantity or amount.",
    zhDefinition: "adj. 缺乏的；不足的；狭小的",
    example: "The information provided was too scanty to make a proper assessment.",
    category: "考研高频"
  },

  // --- 第83组 ---
  {
    word: "scrutiny",
    phonetic: "[ˈskruːtəni]",
    enDefinition: "Critical observation or examination.",
    zhDefinition: "n. 详细审查；监视",
    example: "The government's actions have come under intense public scrutiny.",
    category: "考研高频"
  },
  {
    word: "sedentary",
    phonetic: "[ˈsedntri]",
    enDefinition: "(Of a person) tending to spend much time seated; somewhat inactive.",
    zhDefinition: "adj. 久坐的；定居的",
    example: "Office workers often lead a sedentary lifestyle, which can be bad for their health.",
    category: "考研高频"
  },
  {
    word: "skepticism",
    phonetic: "[ˈskeptɪsɪzəm]",
    enDefinition: "A skeptical attitude; doubt as to the truth of something.",
    zhDefinition: "n. 怀疑态度；怀疑论",
    example: "There is widespread skepticism about the company's claims of being eco-friendly.",
    category: "考研高频"
  },
  {
    word: "sporadic",
    phonetic: "[spəˈrædɪk]",
    enDefinition: "Occurring at irregular intervals or only in a few places; scattered or isolated.",
    zhDefinition: "adj. 零星的；偶尔发生的",
    example: "The country has experienced sporadic outbreaks of violence over the past month.",
    category: "考研高频"
  },
  {
    word: "spurious",
    phonetic: "[ˈspjʊəriəs]",
    enDefinition: "Not being what it purports to be; false or fake.",
    zhDefinition: "adj. 虚假的；伪造的",
    example: "The study was criticized for its spurious claims and flawed methodology.",
    category: "考研高频"
  },
  {
    word: "stagnation",
    phonetic: "[stæɡˈneɪʃn]",
    enDefinition: "The state of not flowing or moving; lack of activity, growth, or development.",
    zhDefinition: "n. 停滞；萧条",
    example: "The economy is suffering from a long period of stagnation and low growth.",
    category: "考研高频"
  },
  {
    word: "static",
    phonetic: "[ˈstætɪk]",
    enDefinition: "Lacking in movement, action, or change, especially in a way viewed as undesirable or uninteresting.",
    zhDefinition: "adj. 静态的；静止的；静电的",
    example: "The population of the town remained relatively static for many years.",
    category: "考研高频"
  },
  {
    word: "steadfast",
    phonetic: "[ˈstedfɑːst]",
    enDefinition: "Resolutely or dutifully firm and unwavering.",
    zhDefinition: "adj. 坚定的；不变的；忠实的",
    example: "She remained steadfast in her commitment to the cause, despite the difficulties.",
    category: "考研高频"
  },
  {
    word: "stigma",
    phonetic: "[ˈstɪɡmə]",
    enDefinition: "A mark of disgrace associated with a particular circumstance, quality, or person.",
    zhDefinition: "n. 污名；耻辱；特征",
    example: "There is still a social stigma attached to being unemployed in some cultures.",
    category: "考研高频"
  },
  {
    word: "stipulate",
    phonetic: "[ˈstɪpjuleɪt]",
    enDefinition: "Demand or specify (a requirement), typically as part of a bargain or agreement.",
    zhDefinition: "v. 规定；保证；约定",
    example: "The agreement stipulates that all work must be completed by the end of the month.",
    category: "考研高频"
  },

  // --- 第84组 ---
  {
    word: "strident",
    phonetic: "[ˈstraɪdnt]",
    enDefinition: "Loud and harsh; grating.",
    zhDefinition: "adj. 刺耳的；尖锐的；咄咄逼人的",
    example: "The strident criticism from the press led to the minister's resignation.",
    category: "考研高频"
  },
  {
    word: "subjective",
    phonetic: "[səbˈdʒektɪv]",
    enDefinition: "Based on or influenced by personal feelings, tastes, or opinions.",
    zhDefinition: "adj. 主观的；个人的",
    example: "Beauty is a subjective quality that varies from person to person.",
    category: "考研高频"
  },
  {
    word: "substantiate",
    phonetic: "[səbˈstænʃieɪt]",
    enDefinition: "Provide evidence to support or prove the truth of.",
    zhDefinition: "v. 证实；证明...有根据",
    example: "They were unable to substantiate the claims of fraud against the company.",
    category: "考研高频"
  },
  {
    word: "subversive",
    phonetic: "[səbˈvɜːsɪv]",
    enDefinition: "Seeking or intended to subvert an established system or institution.",
    zhDefinition: "adj. 颠覆性的；破坏性的",
    example: "He was arrested for his involvement in subversive activities against the government.",
    category: "考研高频"
  },
  {
    word: "succinct",
    phonetic: "[səkˈsɪŋkt]",
    enDefinition: "(Especially of something written or spoken) briefly and clearly expressed.",
    zhDefinition: "adj. 简明的；简洁的",
    example: "She provided a succinct summary of the project's progress so far.",
    category: "考研高频"
  },
  {
    word: "supercilious",
    phonetic: "[ˌsuːpəˈsɪliəs]",
    enDefinition: "Behaving or looking as though one thinks one is superior to others.",
    zhDefinition: "adj. 傲慢的；目中无人的",
    example: "He gave me a supercilious smile and walked away without answering.",
    category: "考研高频"
  },
  {
    word: "superficial",
    phonetic: "[ˌsuːpəˈfɪʃl]",
    enDefinition: "Appearing to be true or real only until examined more closely; not thorough.",
    zhDefinition: "adj. 表面的；肤浅的；浅薄的",
    example: "The changes made to the system were only superficial and didn't solve the problem.",
    category: "考研高频"
  },
  {
    word: "superfluous",
    phonetic: "[suːˈpɜːfluəs]",
    enDefinition: "Unnecessary, especially through being more than enough.",
    zhDefinition: "adj. 多余的；过剩的",
    example: "The additional information was superfluous and didn't add anything to the report.",
    category: "考研高频"
  },
  {
    word: "supplant",
    phonetic: "[səˈplɑːnt]",
    enDefinition: "Supersede and replace.",
    zhDefinition: "v. 代替；取代",
    example: "New technology often supplants older methods that are less efficient.",
    category: "考研高频"
  },
  {
    word: "surreptitious",
    phonetic: "[ˌsʌrəpˈtɪʃəs]",
    enDefinition: "Kept secret, especially because it would not be approved of.",
    zhDefinition: "adj. 鬼鬼祟祟的；秘密的",
    example: "They had a surreptitious meeting in a small café to avoid being seen.",
    category: "考研高频"
  },

  // --- 第85组 ---
  {
    word: "susceptible",
    phonetic: "[əˈseptəbl]",
    enDefinition: "Likely or liable to be influenced or harmed by a particular thing.",
    zhDefinition: "adj. 易受影响的；敏感的；易受伤害的",
    example: "Young children are often more susceptible to diseases than adults.",
    category: "考研高频"
  },
  {
    word: "sycophant",
    phonetic: "[ˈsɪkəfænt]",
    enDefinition: "A person who acts obsequiously toward someone important in order to gain advantage.",
    zhDefinition: "n. 谄媚者；拍马屁的人",
    example: "The CEO was surrounded by sycophants who never disagreed with him.",
    category: "考研高频"
  },
  {
    word: "tacit",
    phonetic: "[ˈtæsɪt]",
    enDefinition: "Understood or implied without being stated.",
    zhDefinition: "adj. 心照不宣的；默示的",
    example: "By staying silent, they gave their tacit approval to the new policy.",
    category: "考研高频"
  },
  {
    word: "taciturn",
    phonetic: "[ˈtæsɪtɜːn]",
    enDefinition: "(Of a person) reserved or uncommunicative in speech; saying little.",
    zhDefinition: "adj. 沉默寡言的",
    example: "He was a taciturn man who rarely shared his thoughts with anyone.",
    category: "考研高频"
  },
  {
    word: "tangential",
    phonetic: "[tænˈdʒenʃl]",
    enDefinition: "Relating to or along a tangent; diverging from a previous course.",
    zhDefinition: "adj. 离题的；切线的；间接相关的",
    example: "The point he raised was only tangential to the main discussion.",
    category: "考研高频"
  },
  {
    word: "tangible",
    phonetic: "[ˈtændʒəbl]",
    enDefinition: "Perceptible by touch; clear and definite; real.",
    zhDefinition: "adj. 有形的；切实的；可触知的",
    example: "The company's success is based on tangible results, not just vague promises.",
    category: "考研高频"
  },
  {
    word: "tantamount",
    phonetic: "[ˈtæntəmaʊnt]",
    enDefinition: "Equivalent in seriousness to; virtually the same as.",
    zhDefinition: "adj. 等同于；相等的",
    example: "To ignore the warning would be tantamount to admitting defeat.",
    category: "考研高频"
  },
  {
    word: "tenuous",
    phonetic: "[ˈtenjuəs]",
    enDefinition: "Very weak or slight.",
    zhDefinition: "adj. 脆弱的；细微的；稀薄的",
    example: "The connection between the two events is tenuous at best.",
    category: "考研高频"
  },
  {
    word: "terse",
    phonetic: "[tɜːs]",
    enDefinition: "Sparing in the use of words; abrupt.",
    zhDefinition: "adj. 简练的；扼要的",
    example: "She gave a terse reply that showed she was clearly annoyed.",
    category: "考研高频"
  },
  {
    word: "thrive",
    phonetic: "[θraɪv]",
    enDefinition: "Prosper; flourish.",
    zhDefinition: "v. 繁荣；茁壮成长",
    example: "The company has continued to thrive despite the economic downturn.",
    category: "考研高频"
  },

  // --- 第86组 ---
  {
    word: "tirade",
    phonetic: "[taɪˈreɪd]",
    enDefinition: "A long, angry speech of criticism or accusation.",
    zhDefinition: "n. 激烈的长篇演说",
    example: "The manager went on a tirade against the staff's poor performance.",
    category: "考研高频"
  },
  {
    word: "torpor",
    phonetic: "[ˈtɔːpə(r)]",
    enDefinition: "A state of physical or mental inactivity; lethargy.",
    zhDefinition: "n. 麻木；不活泼；迟钝",
    example: "After the heavy meal, we fell into a state of pleasant torpor.",
    category: "考研高频"
  },
  {
    word: "tractable",
    phonetic: "[ˈtræktəbl]",
    enDefinition: "(Of a person or animal) easy to control or influence.",
    zhDefinition: "adj. 温顺的；易处理的",
    example: "The problem proved to be more tractable than we had initially thought.",
    category: "考研高频"
  },
  {
    word: "transient",
    phonetic: "[ˈtrænziənt]",
    enDefinition: "Lasting only for a short time; impermanent.",
    zhDefinition: "adj. 短暂的；转瞬即逝的",
    example: "The beauty of the sunset was transient, lasting only a few minutes.",
    category: "考研高频"
  },
  {
    word: "trepidation",
    phonetic: "[ˌtrepɪˈdeɪʃn]",
    enDefinition: "A feeling of fear or agitation about something that may happen.",
    zhDefinition: "n. 恐惧；颤抖；惶恐",
    example: "She approached the meeting with some trepidation, not knowing what to expect.",
    category: "考研高频"
  },
  {
    word: "trite",
    phonetic: "[traɪt]",
    enDefinition: "(Of a remark, opinion, or idea) overused and consequently of little import; unoriginal.",
    zhDefinition: "adj. 陈腐的；老生常谈的",
    example: "I found the movie's plot to be a bit trite and predictable.",
    category: "考研高频"
  },
  {
    word: "trivial",
    phonetic: "[ˈtrɪviəl]",
    enDefinition: "Of little value or importance.",
    zhDefinition: "adj. 琐碎的；不重要的",
    example: "We shouldn't spend our time on such trivial matters when there are bigger problems.",
    category: "考研高频"
  },
  {
    word: "truculent",
    phonetic: "[ˈtrʌkjələnt]",
    enDefinition: "Eager or quick to argue or fight; aggressively defiant.",
    zhDefinition: "adj. 凶猛的；好斗的",
    example: "His truculent behavior during the game led to his being sent off.",
    category: "考研高频"
  },
  {
    word: "ubiquitous",
    phonetic: "[juːˈbɪkwɪtəs]",
    enDefinition: "Present, appearing, or found everywhere.",
    zhDefinition: "adj. 无处不在的；普遍存在的",
    example: "Cell phones have become ubiquitous in almost every part of the world.",
    category: "考研高频"
  },
  {
    word: "unabashed",
    phonetic: "[ˌʌnəˈbæʃt]",
    enDefinition: "Not embarrassed, disconcerted, or ashamed.",
    zhDefinition: "adj. 不害臊的；厚脸皮的；不加掩饰的",
    example: "She was unabashed about her political views, even when they were unpopular.",
    category: "考研高频"
  },

  // --- 第87组 ---
  {
    word: "unassailable",
    phonetic: "[ˌʌnəˈseɪləbl]",
    enDefinition: "Unable to be attacked, questioned, or defeated.",
    zhDefinition: "adj. 不容置疑的；攻不破的",
    example: "The company has an unassailable position in the market.",
    category: "考研高频"
  },
  {
    word: "unconventional",
    phonetic: "[ˌʌnkənˈvenʃənl]",
    enDefinition: "Not based on or conforming to what is generally done or believed.",
    zhDefinition: "adj. 非传统的；非常规的",
    example: "His unconventional methods of teaching proved to be very successful.",
    category: "考研高频"
  },
  {
    word: "unctuous",
    phonetic: "[ˈʌŋktʃuəs]",
    enDefinition: "(Of a person) excessively or ingratiatingly flattering; oily.",
    zhDefinition: "adj. 油腔滑调的；虚情假意的",
    example: "I was repelled by the unctuous manner of the salesman.",
    category: "考研高频"
  },
  {
    word: "underlie",
    phonetic: "[ˌʌndəˈlaɪ]",
    enDefinition: "Be the cause or basis of (something).",
    zhDefinition: "v. 构成...的基础；引起",
    example: "What are the fundamental principles that underlie this new theory?",
    category: "考研高频"
  },
  {
    word: "undermine",
    phonetic: "[ˌʌndəˈmaɪn]",
    enDefinition: "Erode the base or foundation of; lessen the effectiveness, power, or ability of.",
    zhDefinition: "v. 破坏；削弱；暗中破坏",
    example: "Constant criticism can undermine a person's self-confidence.",
    category: "考研高频"
  },
  {
    word: "underscore",
    phonetic: "[ˌʌndəˈskɔː(r)]",
    enDefinition: "Emphasize.",
    zhDefinition: "v. 强调；在...下面划线",
    example: "The recent report underscores the need for more investment in education.",
    category: "考研高频"
  },
  {
    word: "unilateral",
    phonetic: "[ˌjuːniˈlætrəl]",
    enDefinition: "(Of an action or decision) performed by or affecting only one person, group, or country.",
    zhDefinition: "adj. 单方面的；单边的",
    example: "The country took a unilateral decision to withdraw from the treaty.",
    category: "考研高频"
  },
  {
    word: "unprecedented",
    phonetic: "[ʌnˈpresɪdentɪd]",
    enDefinition: "Never done or known before.",
    zhDefinition: "adj. 史无前例的；空前的",
    example: "The company has experienced an unprecedented level of growth over the past year.",
    category: "考研高频"
  },
  {
    word: "unravel",
    phonetic: "[ʌnˈrævl]",
    enDefinition: "Investigate and solve or explain (something complicated or puzzling).",
    zhDefinition: "v. 阐明；解开；拆散",
    example: "Detectives are still trying to unravel the mystery of the disappearance.",
    category: "考研高频"
  },
  {
    word: "unscrupulous",
    phonetic: "[ʌnˈskruːpjələs]",
    enDefinition: "Having or showing no moral principles; not honest or fair.",
    zhDefinition: "adj. 不道德的；肆无忌惮的",
    example: "Unscrupulous businessmen were taking advantage of the situation.",
    category: "考研高频"
  },

  // --- 第88组 ---
  {
    word: "untenable",
    phonetic: "[ʌnˈtenəbl]",
    enDefinition: "(Especially of a theory or position) not able to be maintained or defended against attack or objection.",
    zhDefinition: "adj. 站不住脚的；难以防守的",
    example: "His position in the company became untenable after the scandal broke.",
    category: "考研高频"
  },
  {
    word: "upbraid",
    phonetic: "[ʌpˈbreɪd]",
    enDefinition: "Find fault with (someone); scold.",
    zhDefinition: "v. 责骂；训斥",
    example: "He was upbraided by his manager for being late for the third time this week.",
    category: "考研高频"
  },
  {
    word: "upheaval",
    phonetic: "[ʌpˈhiːvl]",
    enDefinition: "A violent or sudden change or disruption to something.",
    zhDefinition: "n. 剧变；动乱",
    example: "The country has experienced significant political upheaval over the past decade.",
    category: "考研高频"
  },
  {
    word: "utilitarian",
    phonetic: "[ˌjuːtɪlɪˈteəriən]",
    enDefinition: "Designed to be useful or practical rather than attractive.",
    zhDefinition: "adj. 实用的；功利主义的",
    example: "The building's design was plain and utilitarian, built for efficiency.",
    category: "考研高频"
  },
  {
    word: "vacillate",
    phonetic: "[ˈvæsəleɪt]",
    enDefinition: "Alternate or waver between different opinions or actions; be indecisive.",
    zhDefinition: "v. 犹豫；动摇",
    example: "She vacillated between accepting the new job and staying where she was.",
    category: "考研高频"
  },
  {
    word: "valid",
    phonetic: "[ˈvælɪd]",
    enDefinition: "(Of an argument or point) having a sound basis in logic or fact; reasonable or cogent.",
    zhDefinition: "adj. 有效的；正当的；合法的",
    example: "The researchers provided a valid explanation for their findings.",
    category: "考研高频"
  },
  {
    word: "vanity",
    phonetic: "[ˈvænəti]",
    enDefinition: "Excessive pride in or admiration of one's own appearance or achievements.",
    zhDefinition: "n. 虚荣心；自大；空虚",
    example: "He was criticized for his vanity and constant need for attention.",
    category: "考研高频"
  },
  {
    word: "venerate",
    phonetic: "[ˈvenəreɪt]",
    enDefinition: "Regard with great respect; revere.",
    zhDefinition: "v. 崇敬；敬仰",
    example: "The monk was venerated by the local community for his wisdom.",
    category: "考研高频"
  },
  {
    word: "veracity",
    phonetic: "[vəˈræsəti]",
    enDefinition: "Conformity to facts; accuracy; habitual truthfulness.",
    zhDefinition: "n. 真实性；诚实",
    example: "The lawyer questioned the veracity of the witness's testimony.",
    category: "考研高频"
  },
  {
    word: "verbose",
    phonetic: "[vɜːˈbəʊs]",
    enDefinition: "Using or expressed in more words than are needed.",
    zhDefinition: "adj. 啰嗦的；冗长的",
    example: "The professor's verbose explanations were often difficult to follow.",
    category: "考研高频"
  },

  // --- 第89组 ---
  {
    word: "veritable",
    phonetic: "[ˈverɪtəbl]",
    enDefinition: "Used as an intensifier, often to qualify a metaphor; real or genuine.",
    zhDefinition: "adj. 名副其实的；真正的",
    example: "The garden was a veritable paradise, filled with exotic flowers.",
    category: "考研高频"
  },
  {
    word: "versatile",
    phonetic: "[ˈvɜːsətaɪl]",
    enDefinition: "Able to adapt or be adapted to many different functions or activities.",
    zhDefinition: "adj. 多才多艺的；通用的；多功能的",
    example: "He is a versatile actor who is equally comfortable in comedy or drama.",
    category: "考研高频"
  },
  {
    word: "vestige",
    phonetic: "[ˈvestɪdʒ]",
    enDefinition: "A trace of something that is disappearing or no longer exists.",
    zhDefinition: "n. 残余；遗迹；痕迹",
    example: "The ancient ruins are a vestige of a long-lost civilization.",
    category: "考研高频"
  },
  {
    word: "vex",
    phonetic: "[veks]",
    enDefinition: "Make (someone) feel annoyed, frustrated, or worried.",
    zhDefinition: "v. 使烦恼；困扰",
    example: "The complicated legal issue continues to vex the small business owner.",
    category: "考研高频"
  },
  {
    word: "viable",
    phonetic: "[ˈvaɪəbl]",
    enDefinition: "Capable of working successfully; feasible.",
    zhDefinition: "adj. 可行的；能养活的",
    example: "The committee is looking for a viable solution to the parking problem.",
    category: "考研高频"
  },
  {
    word: "vicarious",
    phonetic: "[vɪˈkeəriəs]",
    enDefinition: "Experienced in the imagination through the feelings or actions of another person.",
    zhDefinition: "adj. 间接体验的；代人受过的",
    example: "Many parents get a vicarious pleasure from their children's success.",
    category: "考研高频"
  },
  {
    word: "vicissitude",
    phonetic: "[vɪˈsɪsɪtjuːd]",
    enDefinition: "A change of circumstances or fortune, typically one that is unwelcome or unpleasant.",
    zhDefinition: "n. 变迁；兴衰；荣辱",
    example: "The company has survived the vicissitudes of the business cycle.",
    category: "考研高频"
  },
  {
    word: "vigilance",
    phonetic: "[ˈvɪdʒɪləns]",
    enDefinition: "The action or state of keeping careful watch for possible danger or difficulties.",
    zhDefinition: "n. 警觉；警惕",
    example: "Constant vigilance is necessary to maintain the security of the building.",
    category: "考研高频"
  },
  {
    word: "vignette",
    phonetic: "[viˈnjet]",
    enDefinition: "A brief evocative description, account, or episode.",
    zhDefinition: "n. 小插曲；速写；花絮",
    example: "The book is a collection of vignettes about life in a small town.",
    category: "考研高频"
  },
  {
    word: "vilify",
    phonetic: "[ˈvɪlɪfaɪ]",
    enDefinition: "Speak or write about in an abusively disparaging manner.",
    zhDefinition: "v. 诽谤；诋毁",
    example: "He was vilified in the press for his controversial decision.",
    category: "考研高频"
  },

  // --- 第90组 ---
  {
    word: "vindicate",
    phonetic: "[ˈvɪndɪkeɪt]",
    enDefinition: "Clear (someone) of blame or suspicion.",
    zhDefinition: "v. 证明...无罪；辩护；证实",
    example: "The discovery of the new evidence will help to vindicate him.",
    category: "考研高频"
  },
  {
    word: "virulent",
    phonetic: "[ˈvɪrʊlənt]",
    enDefinition: "(Of a disease or poison) extremely severe or harmful in its effects.",
    zhDefinition: "adj. 剧毒的；恶毒的；致命的",
    example: "A virulent strain of the flu has been spreading throughout the region.",
    category: "考研高频"
  },
  {
    word: "visceral",
    phonetic: "[ˈvɪsərəl]",
    enDefinition: "Relating to deep inward feelings rather than to the intellect.",
    zhDefinition: "adj. 发自内心的；出自本能的",
    example: "The film evoked a visceral reaction from the audience, with many people crying.",
    category: "考研高频"
  },
  {
    word: "visionary",
    phonetic: "[ˈvɪʒənri]",
    enDefinition: "Thinking about or planning the future with imagination or wisdom.",
    zhDefinition: "adj. 有远见的；梦幻的 n. 愿景家",
    example: "He was a visionary leader who foresaw the potential of the internet.",
    category: "考研高频"
  },
  {
    word: "vitality",
    phonetic: "[vaɪˈtæləti]",
    enDefinition: "The state of being strong and active; energy.",
    zhDefinition: "n. 活力；生命力",
    example: "The exercise program helped her to regain her vitality and energy.",
    category: "考研高频"
  },
  {
    word: "vituperative",
    phonetic: "[vɪˈtjuːpərətɪv]",
    enDefinition: "Bitter and abusive.",
    zhDefinition: "adj. 谩骂的；责骂的",
    example: "The candidate's vituperative attacks on his opponent backfired.",
    category: "考研高频"
  },
  {
    word: "vociferous",
    phonetic: "[vəˈsɪfərəs]",
    enDefinition: "Vehement or clamorous.",
    zhDefinition: "adj. 叫嚣的；大声疾呼的",
    example: "He was a vociferous critic of the new government policy.",
    category: "考研高频"
  },
  {
    word: "volatile",
    phonetic: "[ˈvɒlətaɪl]",
    enDefinition: "(Of a substance) easily evaporated at normal temperatures; liable to change rapidly and unpredictably.",
    zhDefinition: "adj. 易变的；不稳定的；挥发性的",
    example: "The stock market has been very volatile over the past few weeks.",
    category: "考研高频"
  },
  {
    word: "voluminous",
    phonetic: "[vəˈluːmɪnəs]",
    enDefinition: "(Of a piece of writing) very lengthy and detailed.",
    zhDefinition: "adj. 卷数多的；宏大的；冗长的",
    example: "The writer is known for her voluminous novels, some of which are over 1000 pages.",
    category: "考研高频"
  },
  {
    word: "voracious",
    phonetic: "[vəˈreɪʃəs]",
    enDefinition: "Wanting or devouring great quantities of food; having a very eager approach to an activity.",
    zhDefinition: "adj. 贪婪的；求知欲强的",
    example: "He is a voracious reader who gets through several books every week.",
    category: "考研高频"
  },

  // --- 第91组 ---
  {
    word: "axiom",
    phonetic: "[ˈæksiəm]",
    enDefinition: "A statement or proposition which is regarded as being established, accepted, or self-evidently true.",
    zhDefinition: "n. 公理；格言；不言自明的真理",
    example: "It is a fundamental axiom of economics that resources are scarce.",
    category: "考研高频"
  },
  {
    word: "dialectic",
    phonetic: "[ˌdaɪəˈlektɪk]",
    enDefinition: "The art of investigating or discussing the truth of opinions.",
    zhDefinition: "n. 辩证法；对立统一 adj. 辩证的",
    example: "The philosopher explored the complex dialectic between tradition and modernity.",
    category: "考研高频"
  },
  {
    word: "epistemology",
    phonetic: "[ɪˌpɪstɪˈmɒlədʒi]",
    enDefinition: "The theory of knowledge, especially with regard to its methods, validity, and scope.",
    zhDefinition: "n. 认识论（关于知识来源及性质的理论）",
    example: "The course provides an introduction to classical epistemology.",
    category: "考研高频"
  },
  {
    word: "incontrovertible",
    phonetic: "[ˌɪnkɒntrəˈvɜːtəbl]",
    enDefinition: "Not able to be denied or disputed.",
    zhDefinition: "adj. 不容置疑的；无可辩驳的",
    example: "The video evidence provided incontrovertible proof of the suspect's guilt.",
    category: "考研高频"
  },
  {
    word: "jurisprudence",
    phonetic: "[ˌdʒʊərɪsˈpruːdns]",
    enDefinition: "The theory or philosophy of law.",
    zhDefinition: "n. 法学；法律体系",
    example: "American jurisprudence is based on both common law and constitutional principles.",
    category: "考研高频"
  },
  {
    word: "kinetic",
    phonetic: "[kɪˈnetɪk]",
    enDefinition: "Relating to or resulting from motion.",
    zhDefinition: "adj. 运动的；动力学的",
    example: "Modern dance is a highly kinetic form of artistic expression.",
    category: "考研高频"
  },
  {
    word: "labyrinthine",
    phonetic: "[ˌlæbəˈrɪnθaɪn]",
    enDefinition: "(Of a network) like a labyrinth; irregular and twisting.",
    zhDefinition: "adj. 迷宫般的；复杂的；混乱的",
    example: "The researchers struggled to navigate the labyrinthine tax regulations.",
    category: "考研高频"
  },
  {
    word: "magniloquent",
    phonetic: "[mæɡˈnɪləkwənt]",
    enDefinition: "Using high-flown or bombastic language.",
    zhDefinition: "adj. 夸张的；言辞浮夸的",
    example: "His magniloquent speech failed to hide the lack of actual substance.",
    category: "考研高频"
  },
  {
    word: "metaphysical",
    phonetic: "[ˌmetəˈfɪzɪkl]",
    enDefinition: "Relating to the branch of philosophy that deals with the first principles of things.",
    zhDefinition: "adj. 形而上学的；纯哲学上的；超自然的",
    example: "The poem explores metaphysical questions about the nature of existence.",
    category: "考研高频"
  },
  {
    word: "microcosm",
    phonetic: "[ˈmaɪkrəʊkɒzəm]",
    enDefinition: "A community, place, or situation regarded as encapsulating in miniature the characteristic qualities of something much larger.",
    zhDefinition: "n. 微观世界；缩影",
    example: "The small village is a microcosm of the entire country's social problems.",
    category: "考研高频"
  },

  // --- 第92组 ---
  {
    word: "misnomer",
    phonetic: "[ˌmɪsˈnəʊmə(r)]",
    enDefinition: "A wrong or inaccurate name or designation.",
    zhDefinition: "n. 名称失当；用词错误",
    example: "To call the project a success is something of a misnomer, as it failed to meet its goals.",
    category: "考研高频"
  },
  {
    word: "modulate",
    phonetic: "[ˈmɒdjuleɪt]",
    enDefinition: "Exert a modifying or controlling influence on.",
    zhDefinition: "v. 调整；调节；调制（声音等）",
    example: "The body has mechanisms to modulate its own temperature in response to environment.",
    category: "考研高频"
  },
  {
    word: "monolithic",
    phonetic: "[ˌmɒnəˈlɪθɪk]",
    enDefinition: "(Of an organization or system) large, powerful, and intractably indivisible and uniform.",
    zhDefinition: "adj. 庞大且单一的；大一统的；僵化的",
    example: "We must avoid viewing the media as a single, monolithic entity.",
    category: "考研高频"
  },
  {
    word: "myopia",
    phonetic: "[maɪˈəʊpiə]",
    enDefinition: "Nearsightedness; lack of imagination, foresight, or intellectual insight.",
    zhDefinition: "n. 近视；目光短浅",
    example: "The manager's political myopia prevented him from seeing the long-term risks.",
    category: "考研高频"
  },
  {
    word: "nomenclature",
    phonetic: "[nəˈmenklətʃə(r)]",
    enDefinition: "The devising or choosing of names for things, especially in a science or other discipline.",
    zhDefinition: "n. 命名法；术语",
    example: "The chemical nomenclature used in the report follows international standards.",
    category: "考研高频"
  },
  {
    word: "obliterate",
    phonetic: "[əˈblɪtəreɪt]",
    enDefinition: "Destroy utterly; wipe out.",
    zhDefinition: "v. 抹除；使消失；毁坏",
    example: "The explosion was powerful enough to obliterate the entire building.",
    category: "考研高频"
  },
  {
    word: "omnipotent",
    phonetic: "[ɒmˈnɪpətənt]",
    enDefinition: "(Of a deity) having unlimited power; able to do anything.",
    zhDefinition: "adj. 全能的；无所不能的",
    example: "In ancient myths, the gods were often depicted as omnipotent beings.",
    category: "考研高频"
  },
  {
    word: "ontological",
    phonetic: "[ˌɒntəˈlɒdʒɪkl]",
    enDefinition: "Relating to the branch of metaphysics dealing with the nature of being.",
    zhDefinition: "adj. 存在论的；本体论的",
    example: "The argument raises profound ontological questions about human consciousness.",
    category: "考研高频"
  },
  {
    word: "parochial",
    phonetic: "[pəˈrəʊkiəl]",
    enDefinition: "Having a limited or narrow outlook or scope.",
    zhDefinition: "adj. 狭隘的；教区的",
    example: "Local politicians are often criticized for their parochial focus on small issues.",
    category: "考研高频"
  },
  {
    word: "patronize",
    phonetic: "[ˈpætrənaɪz]",
    enDefinition: "Treat with an apparent kindness that betrays a feeling of superiority.",
    zhDefinition: "v. 以恩赐态度对待；资助；光顾",
    example: "Don't patronize me; I understand the situation as well as you do.",
    category: "考研高频"
  },

  // --- 第93组 ---
  {
    word: "pecuniary",
    phonetic: "[pɪˈkjuːniəri]",
    enDefinition: "Relating to or consisting of money.",
    zhDefinition: "adj. 金钱的；金钱方面的",
    example: "He was motivated by pecuniary interest rather than a desire for fame.",
    category: "考研高频"
  },
  {
    word: "pedagogy",
    phonetic: "[ˈpedəɡɒdʒi]",
    enDefinition: "The method and practice of teaching, especially as an academic subject or theoretical concept.",
    zhDefinition: "n. 教育学；教学法",
    example: "The new curriculum is based on the latest research in child pedagogy.",
    category: "考研高频"
  },
  {
    word: "penchant",
    phonetic: "[ˈpəntʃənt]",
    enDefinition: "A strong or habitual liking for something or tendency to do something.",
    zhDefinition: "n. 嗜好；倾向",
    example: "She has a penchant for collecting rare first-edition books.",
    category: "考研高频"
  },
  {
    word: "pensive",
    phonetic: "[ˈpensɪv]",
    enDefinition: "Engaged in, involving, or reflecting deep or serious thought.",
    zhDefinition: "adj. 沉思的；忧思的",
    example: "He sat by the window in a pensive mood, watching the rain fall.",
    category: "考研高频"
  },
  {
    word: "peremptory",
    phonetic: "[pəˈremptəri]",
    enDefinition: "(Especially of a person's manner or actions) insisting on immediate attention or obedience.",
    zhDefinition: "adj. 专横的；强制的；不容置辩的",
    example: "She issued a peremptory order for the staff to return to their desks.",
    category: "考研高频"
  },
  {
    word: "perfidious",
    phonetic: "[pəˈfɪdiəs]",
    enDefinition: "Deceitful and untrustworthy.",
    zhDefinition: "adj. 背信弃义的；不忠的",
    example: "The king was betrayed by his own perfidious advisors.",
    category: "考研高频"
  },
  {
    word: "peripheral",
    phonetic: "[pəˈrɪfərəl]",
    enDefinition: "Of secondary or minor importance; marginal.",
    zhDefinition: "adj. 次要的；周边的",
    example: "These issues are peripheral to the main problem we are trying to solve.",
    category: "考研高频"
  },
  {
    word: "perpetuate",
    phonetic: "[pəˈpetʃueɪt]",
    enDefinition: "Make (something, typically an undesirable situation or an unfounded belief) continue indefinitely.",
    zhDefinition: "v. 使永存；使持续",
    example: "These myths serve only to perpetuate negative stereotypes about the region.",
    category: "考研高频"
  },
  {
    word: "perspicacious",
    phonetic: "[ˌpɜːspɪˈkeɪʃəs]",
    enDefinition: "Having a ready insight into and understanding of things.",
    zhDefinition: "adj. 有洞察力的；敏锐的",
    example: "The detective's perspicacious mind allowed him to solve the mystery.",
    category: "考研高频"
  },
  {
    word: "pertinent",
    phonetic: "[ˈpɜːtɪnənt]",
    enDefinition: "Relevant or applicable to a particular matter; apposite.",
    zhDefinition: "adj. 相关的；中肯的；切当的",
    example: "The lawyer asked several pertinent questions about the witness's history.",
    category: "考研高频"
  },

  // --- 第94组 ---
  {
    word: "petrified",
    phonetic: "[ˈpetrɪfaɪd]",
    enDefinition: "So frightened that one is unable to move; terrified.",
    zhDefinition: "adj. 惊呆的；石化的",
    example: "The little boy stood petrified as the large dog ran towards him.",
    category: "考研高频"
  },
  {
    word: "phenomenon",
    phonetic: "[fəˈnɒmɪnən]",
    enDefinition: "A fact or situation that is observed to exist or happen, especially one whose cause or explanation is in question.",
    zhDefinition: "n. 现象；杰出的人或事",
    example: "The rapid growth of social media is a global phenomenon.",
    category: "考研高频"
  },
  {
    word: "philanthropic",
    phonetic: "[ˌfɪlənˈθrɒpɪk]",
    enDefinition: "(Of a person or organization) seeking to promote the welfare of others; generous.",
    zhDefinition: "adj. 慈善的；博爱的",
    example: "The billionaire is known for his extensive philanthropic work around the world.",
    category: "考研高频"
  },
  {
    word: "pinnacle",
    phonetic: "[ˈpɪnəkl]",
    enDefinition: "The most successful point; the culmination.",
    zhDefinition: "n. 顶峰；极点",
    example: "Winning the award was the pinnacle of her long and successful career.",
    category: "考研高频"
  },
  {
    word: "pious",
    phonetic: "[ˈpaɪəs]",
    enDefinition: "Devoutly religious.",
    zhDefinition: "adj. 虔诚的；伪善的",
    example: "The family was known for its pious devotion to the church.",
    category: "考研高频"
  },
  {
    word: "piquant",
    phonetic: "[ˈpiːkənt]",
    enDefinition: "Having a pleasantly sharp taste or appetizing flavor.",
    zhDefinition: "adj. 辛辣有味的；开胃的；刺激的",
    example: "The chef added a piquant sauce to the dish to enhance its flavor.",
    category: "考研高频"
  },
  {
    word: "pithy",
    phonetic: "[ˈpɪθi]",
    enDefinition: "(Of language or style) concise and forcefully expressive.",
    zhDefinition: "adj. 简练的；精辟的；有力的",
    example: "The book is full of pithy observations about modern life.",
    category: "考研高频"
  },
  {
    word: "placid",
    phonetic: "[ˈplæsɪd]",
    enDefinition: "(Of a person or animal) not easily upset or excited.",
    zhDefinition: "adj. 平静的；温和的；沉着的",
    example: "The lake was so placid that it looked like a mirror in the morning light.",
    category: "考研高频"
  },
  {
    word: "plagiarism",
    phonetic: "[ˈpleɪdʒərɪzəm]",
    enDefinition: "The practice of taking someone else's work or ideas and passing them off as one's own.",
    zhDefinition: "n. 剽窃；抄袭",
    example: "The student was expelled from the university for plagiarism.",
    category: "考研高频"
  },
  {
    word: "plaintive",
    phonetic: "[ˈpleɪntɪv]",
    enDefinition: "Sounding sad and mournful.",
    zhDefinition: "adj. 哀怨的；悲哀的",
    example: "The lonely bird's plaintive cry could be heard throughout the woods.",
    category: "考研高频"
  },

  // --- 第95组 ---
  {
    word: "plasticity",
    phonetic: "[plæˈstɪsəti]",
    enDefinition: "The quality of being easily shaped or molded.",
    zhDefinition: "n. 可塑性；适应性",
    example: "The brain's plasticity allows it to adapt and learn throughout life.",
    category: "考研高频"
  },
  {
    word: "plebeian",
    phonetic: "[pləˈbiːən]",
    enDefinition: "Of or belonging to the commoners of ancient Rome; lacking in refinement.",
    zhDefinition: "adj. 平民的；粗俗的",
    example: "The critic dismissed the movie as catering to plebeian tastes.",
    category: "考研高频"
  },
  {
    word: "pliables",
    phonetic: "[ˈplaɪəbl]",
    enDefinition: "Easily bent; flexible; easily influenced.",
    zhDefinition: "adj. 易弯曲的；柔韧的；易受影响的",
    example: "Quality leather should be strong yet pliable.",
    category: "考研高频"
  },
  {
    word: "plight",
    phonetic: "[plaɪt]",
    enDefinition: "A dangerous, difficult, or otherwise unfortunate situation.",
    zhDefinition: "n. 困境；境况",
    example: "The documentary highlights the plight of refugees fleeing the war.",
    category: "考研高频"
  },
  {
    word: "plumb",
    phonetic: "[plʌm]",
    enDefinition: "Explore or experience (something) fully or to extremes.",
    zhDefinition: "v. 探测；垂直 n. 铅锤",
    example: "The philosopher tried to plumb the depths of human nature.",
    category: "考研高频"
  },
  {
    word: "polemic",
    phonetic: "[pəˈlemɪk]",
    enDefinition: "A strong verbal or written attack on someone or something.",
    zhDefinition: "n. 争论；辩论；抨击性文章",
    example: "His latest book is a fierce polemic against modern capitalism.",
    category: "考研高频"
  },
  {
    word: "politic",
    phonetic: "[ˈpɒlətɪk]",
    enDefinition: "(Of an action) seeming sensible and judicious under the circumstances.",
    zhDefinition: "adj. 明智的；有策略的",
    example: "I thought it would be politic to wait until the manager was in a better mood.",
    category: "考研高频"
  },
  {
    word: "pompous",
    phonetic: "[ˈpɒmpəs]",
    enDefinition: "Affectedly and irritatingly grand, solemn, or self-important.",
    zhDefinition: "adj. 自大的；浮夸的；华而不实的",
    example: "He gave a pompous speech that failed to impress the audience.",
    category: "考研高频"
  },
  {
    word: "ponderous",
    phonetic: "[ˈpɒndərəs]",
    enDefinition: "Slow and clumsy because of great weight.",
    zhDefinition: "adj. 沉重的；笨重的；乏味的",
    example: "The book's ponderous style made it very difficult to read.",
    category: "考研高频"
  },
  {
    word: "portend",
    phonetic: "[pɔːˈtend]",
    enDefinition: "Be a sign or warning that (something, especially something momentous or calamitous) is likely to happen.",
    zhDefinition: "v. 预示；预兆",
    example: "The sudden drop in temperature seemed to portend a severe winter.",
    category: "考研高频"
  },

  // --- 第96组 ---
  {
    word: "postulate",
    phonetic: "[ˈpɒstʃuleɪt]",
    enDefinition: "Suggest or assume the existence, fact, or truth of (something) as a basis for reasoning, discussion, or belief.",
    zhDefinition: "v. 假定；假设 n. 基本前提",
    example: "The researchers postulate that the drug may have long-term benefits.",
    category: "考研高频"
  },
  {
    word: "potent",
    phonetic: "[ˈpəʊtnt]",
    enDefinition: "Having great power, influence, or effect.",
    zhDefinition: "adj. 有效的；强有力的",
    example: "The medicine is a potent treatment for a variety of conditions.",
    category: "考研高频"
  },
  {
    word: "precede",
    phonetic: "[prɪˈsiːd]",
    enDefinition: "Come before (something) in time.",
    zhDefinition: "v. 在...之前；先于",
    example: "A short introduction will precede the main part of the program.",
    category: "考研高频"
  },
  {
    word: "precept",
    phonetic: "[ˈpriːsept]",
    enDefinition: "A general rule intended to regulate behavior or thought.",
    zhDefinition: "n. 准则；格言；训条",
    example: "The organization is founded on the precepts of equality and justice.",
    category: "考研高频"
  },
  {
    word: "predicament",
    phonetic: "[prɪˈdɪkəmənt]",
    enDefinition: "A difficult, unpleasant, or embarrassing situation.",
    zhDefinition: "n. 困境；窘境",
    example: "He found himself in a difficult predicament, with no easy way out.",
    category: "考研高频"
  },
  {
    word: "predicate",
    phonetic: "[ˈpredɪkət]",
    enDefinition: "Found or base something on.",
    zhDefinition: "v. 基于；断言 n. 谓语",
    example: "The theory is predicated on the assumption that resources are limited.",
    category: "考研高频"
  },
  {
    word: "predisposition",
    phonetic: "[ˌpriːdɪspəˈzɪʃn]",
    enDefinition: "A liability or tendency to suffer from a particular condition, hold a particular attitude, or act in a particular way.",
    zhDefinition: "n. 倾向；易患病的体质",
    example: "There is evidence of a genetic predisposition to certain types of cancer.",
    category: "考研高频"
  },
  {
    word: "preempt",
    phonetic: "[priˈempt]",
    enDefinition: "Take action in order to prevent (an anticipated event) from happening; forestall.",
    zhDefinition: "v. 预先占有；先发制人",
    example: "The company increased production to preempt any potential shortages.",
    category: "考研高频"
  },
  {
    word: "prefatory",
    phonetic: "[ˈprefətəri]",
    enDefinition: "Serving as an introduction; introductory.",
    zhDefinition: "adj. 前言的；序幕的",
    example: "The speaker made some prefatory remarks before starting his main lecture.",
    category: "考研高频"
  },
  {
    word: "prelude",
    phonetic: "[ˈpreljuːd]",
    enDefinition: "An action or event serving as an introduction to something more important.",
    zhDefinition: "n. 前奏；序幕",
    example: "The small protests were a prelude to the larger revolution that followed.",
    category: "考研高频"
  },

  // --- 第97组 ---
  {
    word: "premise",
    phonetic: "[ˈpremɪs]",
    enDefinition: "A previous statement or proposition from which another is inferred or follows as a conclusion.",
    zhDefinition: "n. 前提；假定",
    example: "The argument is based on a false premise and is therefore flawed.",
    category: "考研高频"
  },
  {
    word: "preponderance",
    phonetic: "[prɪˈpɒndərəns]",
    enDefinition: "The quality or fact of being greater in number, quantity, or importance.",
    zhDefinition: "n. 优势；多数",
    example: "There is a preponderance of evidence to suggest that the plan will fail.",
    category: "考研高频"
  },
  {
    word: "prepossessing",
    phonetic: "[ˌpriːpəˈzesɪŋ]",
    enDefinition: "Attractive or appealing in appearance.",
    zhDefinition: "adj. 给人好感的；迷人的",
    example: "He was a very prepossessing young man, with a kind smile and friendly manner.",
    category: "考研高频"
  },
  {
    word: "prerogative",
    phonetic: "[prɪˈrɒɡətɪv]",
    enDefinition: "A right or privilege exclusive to a particular individual or class.",
    zhDefinition: "n. 特权；权利",
    example: "In some countries, it is the monarch's prerogative to choose the prime minister.",
    category: "考研高频"
  },
  {
    word: "presage",
    phonetic: "[ˈpresɪdʒ]",
    enDefinition: "(Of an event) be a sign or warning that (typically something bad) will happen.",
    zhDefinition: "v./n. 预示；预兆",
    example: "The dark clouds seemed to presage a violent storm.",
    category: "考研高频"
  },
  {
    word: "prescribe",
    phonetic: "[prɪˈskraɪb]",
    enDefinition: "State authoritatively or as a rule that (an action or procedure) should be carried out.",
    zhDefinition: "v. 规定；开药方",
    example: "The law prescribes the methods that must be used to collect data.",
    category: "考研高频"
  },
  {
    word: "prestigious",
    phonetic: "[preˈstɪdʒəs]",
    enDefinition: "Inspiring respect and admiration; having high status.",
    zhDefinition: "adj. 有名望的；享有声誉的",
    example: "Winning the prestigious award was the highlight of her career.",
    category: "考研高频"
  },
  {
    word: "presume",
    phonetic: "[prɪˈzjuːm]",
    enDefinition: "Suppose that something is the case on the basis of probability.",
    zhDefinition: "v. 假设；冒昧；推测",
    example: "I presume that you are interested in the job, since you applied for it.",
    category: "考研高频"
  },
  {
    word: "pretentious",
    phonetic: "[prɪˈtenʃəs]",
    enDefinition: "Attempting to impress by affecting greater importance, talent, culture, etc., than is actually possessed.",
    zhDefinition: "adj. 自命不凡的；炫耀的；虚夸的",
    example: "I found the movie's title to be a bit pretentious and over-the-top.",
    category: "考研高频"
  },
  {
    word: "preternatural",
    phonetic: "[ˌpriːtəˈnætʃrəl]",
    enDefinition: "Beyond what is normal or natural.",
    zhDefinition: "adj. 超自然的；奇异的",
    example: "The child had a preternatural ability to memorize long poems after only one reading.",
    category: "考研高频"
  },

  // --- 第98组 ---
  {
    word: "prevail",
    phonetic: "[prɪˈveɪl]",
    enDefinition: "Prove more powerful than opposing forces; be victorious.",
    zhDefinition: "v. 盛行；战胜；说服",
    example: "Common sense eventually prevailed, and the plan was cancelled.",
    category: "考研高频"
  },
  {
    word: "primacy",
    phonetic: "[ˈpraɪməsi]",
    enDefinition: "The state of being important or first.",
    zhDefinition: "n. 第一位；首位",
    example: "The company's goal is to maintain its primacy in the global market.",
    category: "考研高频"
  },
  {
    word: "primal",
    phonetic: "[ˈpraɪml]",
    enDefinition: "Relating to an early stage in evolutionary development; basic or fundamental.",
    zhDefinition: "adj. 原始的；首要的；最初的",
    example: "Fear of the dark is a primal instinct that many people share.",
    category: "考研高频"
  },
  {
    word: "primordial",
    phonetic: "[praɪˈmɔːdiəl]",
    enDefinition: "Existing at or from the beginning of time; primeval.",
    zhDefinition: "adj. 原始的；根本的",
    example: "The scientists explored the primordial history of the universe.",
    category: "考研高频"
  },
  {
    word: "probity",
    phonetic: "[ˈprəʊbəti]",
    enDefinition: "The quality of having strong moral principles; honesty and decency.",
    zhDefinition: "n. 正直；廉洁",
    example: "He was respected by everyone for his financial probity and integrity.",
    category: "考研高频"
  },
  {
    word: "problematic",
    phonetic: "[ˌprɒbləˈmætɪk]",
    enDefinition: "Constituting or presenting a problem or difficulty.",
    zhDefinition: "adj. 成问题的；难处理的；未定的",
    example: "The lack of funding is a problematic issue for the project.",
    category: "考研高频"
  },
  {
    word: "proclaim",
    phonetic: "[prəˈkleɪm]",
    enDefinition: "Announce officially or publicly.",
    zhDefinition: "v. 宣布；声明；表明",
    example: "The king proclaimed a day of national celebration to mark the victory.",
    category: "考研高频"
  },
  {
    word: "procure",
    phonetic: "[prəˈkjʊə(r)]",
    enDefinition: "Obtain (something), especially with care or effort.",
    zhDefinition: "v. 获得；取得",
    example: "He managed to procure a rare copy of the ancient manuscript.",
    category: "考研高频"
  },
  {
    word: "prodigal",
    phonetic: "[ˈprɒdɪɡl]",
    enDefinition: "Spending money or resources freely and recklessly; wastefully extravagant.",
    zhDefinition: "adj. 挥霍的；浪费的",
    example: "The prodigal prince spent all his money on luxury parties and gifts.",
    category: "考研高频"
  },
  {
    word: "proffer",
    phonetic: "[ˈprɒfə(r)]",
    enDefinition: "Hold out (something) to someone for acceptance; offer.",
    zhDefinition: "v. 提供；提出",
    example: "He proffered a solution to the problem, but it was rejected by the team.",
    category: "考研高频"
  },

  // --- 第99组 ---
  {
    word: "prohibitive",
    phonetic: "[prəˈhɪbətɪv]",
    enDefinition: "(Of a price or charge) excessively high; difficult or impossible to pay.",
    zhDefinition: "adj. 禁止性的；（价格）高得买不起的",
    example: "The cost of housing in the city is prohibitive for many young families.",
    category: "考研高频"
  },
  {
    word: "proponent",
    phonetic: "[prəˈpəʊnənt]",
    enDefinition: "A person who advocates a theory, proposal, or project.",
    zhDefinition: "n. 支持者；建议者",
    example: "She is a leading proponent of renewable energy and environmental protection.",
    category: "考研高频"
  },
  {
    word: "provocative",
    phonetic: "[prəˈvɒkətɪv]",
    enDefinition: "Causing annoyance, anger, or another strong reaction, especially deliberately.",
    zhDefinition: "adj. 挑衅的；刺激的；煽动的",
    example: "The speaker's provocative comments led to a heated debate among the audience.",
    category: "考研高频"
  },
  {
    word: "puerile",
    phonetic: "[ˈpjʊəraɪl]",
    enDefinition: "Childishly silly and trivial.",
    zhDefinition: "adj. 孩子气的；幼稚的",
    example: "I found his jokes to be a bit puerile and unfunny.",
    category: "考研高频"
  },
  {
    word: "pulverize",
    phonetic: "[ˈpʌlvəraɪz]",
    enDefinition: "Reduce to fine particles; defeat utterly.",
    zhDefinition: "v. 粉碎；彻底击败",
    example: "The heavy machinery was used to pulverize the rocks into small pieces.",
    category: "考研高频"
  },
  {
    word: "punctilious",
    phonetic: "[pʌŋkˈtɪliəs]",
    enDefinition: "Showing great attention to detail or correct behavior.",
    zhDefinition: "adj. 一丝不苟的；拘泥细节的",
    example: "He was punctilious about punctuality and always arrived on time.",
    category: "考研高频"
  },
  {
    word: "pundit",
    phonetic: "[ˈpʌndɪt]",
    enDefinition: "An expert in a particular subject or field who is frequently called on to give opinions about it to the public.",
    zhDefinition: "n. 权威；专家；博学者",
    example: "Political pundits were busy analyzing the results of the election.",
    category: "考研高频"
  },
  {
    word: "pungent",
    phonetic: "[ˈpʌndʒənt]",
    enDefinition: "Having a sharply strong taste or smell.",
    zhDefinition: "adj. 刺鼻的；尖刻的",
    example: "The pungent smell of onions filled the kitchen while she was cooking.",
    category: "考研高频"
  },
  {
    word: "punitive",
    phonetic: "[ˈpjuːnətɪv]",
    enDefinition: "Inflicting or intended as punishment.",
    zhDefinition: "adj. 惩罚性的",
    example: "The government took punitive action against the companies that had broken the law.",
    category: "考研高频"
  },
  {
    word: "purport",
    phonetic: "[pəˈpɔːt]",
    enDefinition: "Appear or claim to be or do something, especially falsely; profess.",
    zhDefinition: "v. 声称；意指 n. 主旨",
    example: "The document purports to show that the company was aware of the risks.",
    category: "考研高频"
  },

  // --- 第100组 (Final Group) ---
  {
    word: "rhetorical",
    phonetic: "[rɪˈtɒrɪkl]",
    enDefinition: "Relating to or concerned with the art of rhetoric; (of a question) asked in order to produce an effect.",
    zhDefinition: "adj. 修辞的；反问的；辞藻华丽的",
    example: "The speaker used several rhetorical devices to persuade the audience.",
    category: "考研高频"
  },
  {
    word: "stipulation",
    phonetic: "[ˌstɪpjuˈleɪʃn]",
    enDefinition: "A condition or requirement that is specified or demanded as part of an agreement.",
    zhDefinition: "n. 规定；条款",
    example: "One of the stipulations of the contract was that the work must be done by hand.",
    category: "考研高频"
  },
  {
    word: "subjectivity",
    phonetic: "[ˌsʌbdʒekˈtɪvəti]",
    enDefinition: "The quality of being based on or influenced by personal feelings, tastes, or opinions.",
    zhDefinition: "n. 主观性",
    example: "The critic was accused of allowing his personal subjectivity to influence his review.",
    category: "考研高频"
  },
  {
    word: "synchronize",
    phonetic: "[ˈsɪŋkrənaɪz]",
    enDefinition: "Cause to occur or operate at the same time or rate.",
    zhDefinition: "v. 同步；同时发生",
    example: "The dancers spent weeks practicing to synchronize their movements perfectly.",
    category: "考研高频"
  },
  {
    word: "synthesis",
    phonetic: "[ˈsɪnθəsɪs]",
    enDefinition: "The combination of ideas to form a theory or system.",
    zhDefinition: "n. 综合；合成；人工合成",
    example: "The book is a masterly synthesis of several different fields of research.",
    category: "考研高频"
  },
  {
    word: "tentative",
    phonetic: "[ˈtentətɪv]",
    enDefinition: "Not certain or fixed; provisional.",
    zhDefinition: "adj. 暂定的；试验性的；犹豫不决的",
    example: "We have reached a tentative agreement, but it still needs to be approved by the board.",
    category: "考研高频"
  },
  {
    word: "transcend",
    phonetic: "[trænˈsend]",
    enDefinition: "Be or go beyond the range or limits of (something abstract, typically a conceptual field or division).",
    zhDefinition: "v. 超越；胜过",
    example: "The beauty of the music seemed to transcend time and space.",
    category: "考研高频"
  },
  {
    word: "validation",
    phonetic: "[ˌvælɪˈdeɪʃn]",
    enDefinition: "The action of checking or proving the validity or accuracy of something.",
    zhDefinition: "n. 验证；批准；证实",
    example: "The results of the study provided validation for the new treatment method.",
    category: "考研高频"
  },
  {
    word: "vocation",
    phonetic: "[vəʊˈkeɪʃn]",
    enDefinition: "A strong feeling of suitability for a particular career or occupation.",
    zhDefinition: "n. 职业；使命感；神召",
    example: "For many doctors, medicine is not just a job, but a true vocation.",
    category: "考研高频"
  },
  {
    word: "watershed",
    phonetic: "[ˈwɔːtəʃed]",
    enDefinition: "An event or period marking a turning point in a course of action or state of affairs.",
    zhDefinition: "n. 分水岭；转折点",
    example: "The discovery of DNA was a watershed moment in the history of science.",
    category: "考研高频"
  }


];

module.exports = {
  wordList: wordList
};