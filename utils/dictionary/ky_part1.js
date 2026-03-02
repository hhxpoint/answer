/**
 * 考研词库 Part 1 (100词) - 完美适配 UI 版
 * 包含：英文定义 (enDefinition)、中文释义 (zhDefinition)、例句 (example)
 */
const wordList = [
  {
    word: "abandon",
    phonetic: "[ə'bændən]",
    enDefinition: "To leave someone or something that you are responsible for, usually permanently.",
    zhDefinition: "v. 离弃，丢弃；遗弃，抛弃；放弃",
    example: "The broken car was abandoned by the side of the road.",
    category: "考研高频"
  },
  {
    word: "ability",
    phonetic: "[ə'bɪləti]",
    enDefinition: "The physical or mental power or skill needed to do something.",
    zhDefinition: "n. 能力；本领；才能，才干",
    example: "She has the ability to explain complex things simply.",
    category: "考研高频"
  },
  {
    word: "abnormal",
    phonetic: "[æb'nɔːml]",
    enDefinition: "Different from what is usual or average, especially in a way that is worrying.",
    zhDefinition: "adj. 反常的，异常的；变态的",
    example: "Tests revealed abnormal levels of sugar in the blood.",
    category: "考研高频"
  },
  {
    word: "aboard",
    phonetic: "[ə'bɔːd]",
    enDefinition: "On or onto a ship, aircraft, bus, or train.",
    zhDefinition: "adv./prep. 在船(车、飞行器)上",
    example: "There are 200 passengers aboard the plane.",
    category: "考研高频"
  },
  {
    word: "abolish",
    phonetic: "[ə'bɒlɪʃ]",
    enDefinition: "To end a law or system officially.",
    zhDefinition: "v. 废除，取消",
    example: "Slavery was abolished in the US in the 19th century.",
    category: "考研高频"
  },
  {
    word: "abrupt",
    phonetic: "[ə'brʌpt]",
    enDefinition: "Sudden and unexpected, and often unpleasant.",
    zhDefinition: "adj. 突然的，意外的；鲁莽的",
    example: "The road ended in an abrupt slope.",
    category: "考研高频"
  },
  {
    word: "absence",
    phonetic: "['æbsəns]",
    enDefinition: "The state of being away from a place or person.",
    zhDefinition: "n. 缺席，不在；缺乏，不存在",
    example: "The decision was made in my absence.",
    category: "考研高频"
  },
  {
    word: "absolute",
    phonetic: "['æbsəluːt]",
    enDefinition: "Very great or to the largest degree possible.",
    zhDefinition: "adj. 绝对的，完全的；肯定的",
    example: "You must tell the absolute truth.",
    category: "考研高频"
  },
  {
    word: "absorb",
    phonetic: "[əb'sɔːb]",
    enDefinition: "To take something in, especially gradually.",
    zhDefinition: "v. 吸收；吸引…的注意，使全神贯注",
    example: "Plants absorb carbon dioxide from the air.",
    category: "考研高频"
  },
  {
    word: "abstract",
    phonetic: "['æbstrækt]",
    enDefinition: "Existing as an idea, feeling, or quality, not as a material object.",
    zhDefinition: "adj. 抽象的 n. 摘要，提要 v. 提取",
    example: "Truth and beauty are abstract concepts.",
    category: "考研高频"
  },
  {
    word: "absurd",
    phonetic: "[əb'sɜːd]",
    enDefinition: "Stupid and unreasonable, or silly in a humorous way.",
    zhDefinition: "adj. 荒谬的，荒唐的，可笑的",
    example: "It is absurd to think that he could win.",
    category: "考研高频"
  },
  {
    word: "abundance",
    phonetic: "[ə'bʌndəns]",
    enDefinition: "The situation in which there is more than enough of something.",
    zhDefinition: "n. 丰富，充裕",
    example: "There was an abundance of food at the party.",
    category: "考研高频"
  },
  {
    word: "abuse",
    phonetic: "[ə'bjuːs]",
    enDefinition: "To use something for the wrong purpose in a way that is harmful.",
    zhDefinition: "v./n. 滥用；虐待；辱骂",
    example: "She is accused of abusing her power.",
    category: "考研高频"
  },
  {
    word: "academic",
    phonetic: "[ˌækə'demɪk]",
    enDefinition: "Relating to schools, colleges, and universities.",
    zhDefinition: "adj. 学院的；学术的",
    example: "The university has high academic standards.",
    category: "考研高频"
  },
  {
    word: "accelerate",
    phonetic: "[ək'seləreɪt]",
    enDefinition: "To happen or make something happen sooner or faster.",
    zhDefinition: "v. 加速；促进",
    example: "Inflation is continuing to accelerate.",
    category: "考研高频"
  },
  {
    word: "access",
    phonetic: "['ækses]",
    enDefinition: "The method or possibility of getting near to a place or person.",
    zhDefinition: "n. 接近；入口 v. 存取(数据)",
    example: "I can't gain access to the file.",
    category: "考研高频"
  },
  {
    word: "accessible",
    phonetic: "[ək'sesəbl]",
    enDefinition: "Able to be reached or entered.",
    zhDefinition: "adj. 易接近的；可进入的；可理解的",
    example: "The island is only accessible by boat.",
    category: "考研高频"
  },
  {
    word: "accommodate",
    phonetic: "[ə'kɒmədeɪt]",
    enDefinition: "To provide with a place to live or to be stored in.",
    zhDefinition: "v. 容纳；向…提供住处；使适应",
    example: "The hotel can accommodate 200 guests.",
    category: "考研高频"
  },
  {
    word: "accompany",
    phonetic: "[ə'kʌmpəni]",
    enDefinition: "To go with someone or to be provided or exist at the same time.",
    zhDefinition: "v. 陪伴，陪同；伴随",
    example: "Children must be accompanied by an adult.",
    category: "考研高频"
  },
  {
    word: "accomplish",
    phonetic: "[ə'kʌmplɪʃ]",
    enDefinition: "To finish something successfully or to achieve something.",
    zhDefinition: "v. 完成，实现，成功",
    example: "We have accomplished all our goals.",
    category: "考研高频"
  },
  {
    word: "accordance",
    phonetic: "[ə'kɔːdns]",
    enDefinition: "In a way that agrees with or follows something.",
    zhDefinition: "n. 一致，和谐",
    example: "Everything was done in accordance with the law.",
    category: "考研高频"
  },
  {
    word: "accordingly",
    phonetic: "[ə'kɔːdɪŋli]",
    enDefinition: "In a way that is suitable or right for the situation.",
    zhDefinition: "adv. 相应地；因此，于是",
    example: "Plan accordingly for the holiday weekend.",
    category: "考研高频"
  },
  {
    word: "account",
    phonetic: "[ə'kaʊnt]",
    enDefinition: "A written or spoken description of an event.",
    zhDefinition: "n. 叙述；帐目 v. 说明原因；占…",
    example: "He gave a detailed account of his trip.",
    category: "考研高频"
  },
  {
    word: "accumulate",
    phonetic: "[ə'kjuːmjəleɪt]",
    enDefinition: "To collect a large number of things over a period of time.",
    zhDefinition: "v. 积累，堆积",
    example: "As people age, they accumulate experience.",
    category: "考研高频"
  },
  {
    word: "accurate",
    phonetic: "['ækjərət]",
    enDefinition: "Correct, exact, and without any mistakes.",
    zhDefinition: "adj. 准确的，精确的",
    example: "The report was accurate and well-written.",
    category: "考研高频"
  },
  {
    word: "accuse",
    phonetic: "[ə'kjuːz]",
    enDefinition: "To say that someone is responsible for a crime or a mistake.",
    zhDefinition: "v. 指控，控告；指责",
    example: "He was accused of stealing the money.",
    category: "考研高频"
  },
  {
    word: "accustom",
    phonetic: "[ə'kʌstəm]",
    enDefinition: "To make someone familiar with new conditions.",
    zhDefinition: "v. 使习惯",
    example: "It takes time to accustom oneself to a new climate.",
    category: "考研高频"
  },
  {
    word: "achieve",
    phonetic: "[ə'tʃiːv]",
    enDefinition: "To succeed in finishing something or reaching an aim.",
    zhDefinition: "v. 完成，实现；达到，获得",
    example: "She finally achieved her ambition.",
    category: "考研高频"
  },
  {
    word: "acknowledge",
    phonetic: "[ək'nɒlɪdʒ]",
    enDefinition: "To accept, admit, or recognize something, or the truth or existence of something.",
    zhDefinition: "v. 承认；致谢；确认收到",
    example: "He acknowledged that he was wrong.",
    category: "考研高频"
  },
  {
    word: "acquaint",
    phonetic: "[ə'kweɪnt]",
    enDefinition: "To make someone or yourself familiar with something.",
    zhDefinition: "v. 使认识，使了解",
    example: "Take time to acquaint yourself with the rules.",
    category: "考研高频"
  },
  {
    word: "acquire",
    phonetic: "[ə'kwaɪə(r)]",
    enDefinition: "To get or buy something.",
    zhDefinition: "v. 获得，习得；学到",
    example: "He acquired a reputation for being difficult.",
    category: "考研高频"
  },
  {
    word: "acquisition",
    phonetic: "[ˌækwɪ'zɪʃn]",
    enDefinition: "The process of getting something.",
    zhDefinition: "n. 获得；获得物；收购",
    example: "The acquisition of huge amounts of data has begun.",
    category: "考研高频"
  },
  {
    word: "adapt",
    phonetic: "[ə'dæpt]",
    enDefinition: "To change, or to change something, to suit different conditions or uses.",
    zhDefinition: "v. 使适应；改编",
    example: "Successful businesses adapt to change.",
    category: "考研高频"
  },
  {
    word: "adequate",
    phonetic: "['ædɪkwət]",
    enDefinition: "Enough or satisfactory for a particular purpose.",
    zhDefinition: "adj. 充足的，足够的；适当的",
    example: "The supply of food is adequate for our needs.",
    category: "考研高频"
  },
  {
    word: "adhere",
    phonetic: "[əd'hɪə(r)]",
    enDefinition: "To stick firmly.",
    zhDefinition: "v. 粘附；坚持，遵守",
    example: "We must adhere to the plan.",
    category: "考研高频"
  },
  {
    word: "adjacent",
    phonetic: "[ə'dʒeɪsnt]",
    enDefinition: "Very near, next to, or touching.",
    zhDefinition: "adj. 毗连的，邻近的",
    example: "The building is adjacent to the park.",
    category: "考研高频"
  },
  {
    word: "adjust",
    phonetic: "[ə'dʒʌst]",
    enDefinition: "To change something slightly, especially to make it more correct.",
    zhDefinition: "v. 调节，改变…以适应；校正",
    example: "You can adjust the height of the chair.",
    category: "考研高频"
  },
  {
    word: "administration",
    phonetic: "[ədˌmɪnɪ'streɪʃn]",
    enDefinition: "The arrangements and tasks needed to control an organization.",
    zhDefinition: "n. 管理；行政；政府",
    example: "The administration of the school is excellent.",
    category: "考研高频"
  },
  {
    word: "admire",
    phonetic: "[əd'maɪə(r)]",
    enDefinition: "To find someone or something attractive and pleasant to look at.",
    zhDefinition: "v. 钦佩，赞赏，羡慕",
    example: "I really admire your courage.",
    category: "考研高频"
  },
  {
    word: "admission",
    phonetic: "[əd'mɪʃn]",
    enDefinition: "The act of agreeing that something is true, especially unwillingly.",
    zhDefinition: "n. 准许进入；承认；入场券",
    example: "Admission to the museum is free.",
    category: "考研高频"
  },
  {
    word: "admit",
    phonetic: "[əd'mɪt]",
    enDefinition: "To agree that something is true, especially unwillingly.",
    zhDefinition: "v. 承认；准许进入",
    example: "He admitted his mistake.",
    category: "考研高频"
  },
  {
    word: "adopt",
    phonetic: "[ə'dɒpt]",
    enDefinition: "To legally take another person's child into your own family.",
    zhDefinition: "v. 采用；收养",
    example: "They decided to adopt a child.",
    category: "考研高频"
  },
  {
    word: "advance",
    phonetic: "[əd'vɑːns]",
    enDefinition: "To go or move forward, or to develop or improve something.",
    zhDefinition: "v./n. 前进，进展 adj. 预先的",
    example: "Technology continues to advance rapidly.",
    category: "考研高频"
  },
  {
    word: "advantage",
    phonetic: "[əd'vɑːntɪdʒ]",
    enDefinition: "A condition or situation that causes you to have a better chance of success.",
    zhDefinition: "n. 优点，优势；利益",
    example: "Speed is an advantage in this game.",
    category: "考研高频"
  },
  {
    word: "adventure",
    phonetic: "[əd'ventʃə(r)]",
    enDefinition: "An unusual, exciting, and possibly dangerous activity.",
    zhDefinition: "n. 冒险；奇遇",
    example: "Traveling to Mars would be a great adventure.",
    category: "考研高频"
  },
  {
    word: "adverse",
    phonetic: "['ædvɜːs]",
    enDefinition: "Having a negative or harmful effect on something.",
    zhDefinition: "adj. 不利的；相反的；敌对的",
    example: "The match was cancelled due to adverse weather.",
    category: "考研高频"
  },
  {
    word: "advocate",
    phonetic: "['ædvəkeɪt]",
    enDefinition: "To publicly support or suggest an idea, development, or way of doing something.",
    zhDefinition: "v. 拥护，提倡 n. 拥护者",
    example: "He is a strong advocate of free speech.",
    category: "考研高频"
  },
  {
    word: "aesthetic",
    phonetic: "[iːs'θetɪk]",
    enDefinition: "Relating to the enjoyment or study of beauty.",
    zhDefinition: "adj. 美学的；艺术的；审美的",
    example: "The building has great aesthetic appeal.",
    category: "考研高频"
  },
  {
    word: "affair",
    phonetic: "[ə'feə(r)]",
    enDefinition: "A situation or subject that is being dealt with or considered.",
    zhDefinition: "n. 事情，事件；事务",
    example: "The mayor's private affairs were kept secret.",
    category: "考研高频"
  },
  {
    word: "affect",
    phonetic: "[ə'fekt]",
    enDefinition: "To have an influence on someone or something.",
    zhDefinition: "v. 影响；感动；假装",
    example: "The pollution is affecting our health.",
    category: "考研高频"
  },
  {
    word: "affiliate",
    phonetic: "[ə'fɪlieɪt]",
    enDefinition: "To cause a group to become part of or form a close relationship with another organization.",
    zhDefinition: "v. 使隶属(或附属于) n. 附属机构",
    example: "The school is affiliated with the university.",
    category: "考研高频"
  },
  {
    word: "affirm",
    phonetic: "[ə'fɜːm]",
    enDefinition: "To state something as true.",
    zhDefinition: "v. 断言，肯定；证实",
    example: "He affirmed his commitment to the project.",
    category: "考研高频"
  },
  {
    word: "affluent",
    phonetic: "['æfluənt]",
    enDefinition: "Having a lot of money or owning a lot of things.",
    zhDefinition: "adj. 富裕的，丰富的",
    example: "They live in an affluent neighborhood.",
    category: "考研高频"
  },
  {
    word: "afford",
    phonetic: "[ə'fɔːd]",
    enDefinition: "To be able to buy or do something because you have enough money or time.",
    zhDefinition: "v. 担负得起；提供",
    example: "I can't afford a new car.",
    category: "考研高频"
  },
  {
    word: "agency",
    phonetic: "['eɪdʒənsi]",
    enDefinition: "A business that represents one group of people when dealing with another group.",
    zhDefinition: "n. 代理行；机构",
    example: "She works for an advertising agency.",
    category: "考研高频"
  },
  {
    word: "agenda",
    phonetic: "[ə'dʒendə]",
    enDefinition: "A list of matters to be discussed at a meeting.",
    zhDefinition: "n. 议事日程",
    example: "What's the first item on the agenda?",
    category: "考研高频"
  },
  {
    word: "agent",
    phonetic: "['eɪdʒənt]",
    enDefinition: "A person who acts for or represents another.",
    zhDefinition: "n. 代理人；媒介；代理商",
    example: "Our agent will handle the contract.",
    category: "考研高频"
  },
  {
    word: "aggravate",
    phonetic: "['æɡrəveɪt]",
    enDefinition: "To make a bad situation worse.",
    zhDefinition: "v. 加重，加剧；使恼火",
    example: "The rain only aggravated the traffic jam.",
    category: "考研高频"
  },
  {
    word: "aggregate",
    phonetic: "['æɡrɪɡət]",
    enDefinition: "Something formed by adding together several amounts or things.",
    zhDefinition: "v. 总计 n. 总数 adj. 总计的",
    example: "The aggregate profit exceeded expectations.",
    category: "考研高频"
  },
  {
    word: "aggressive",
    phonetic: "[ə'ɡresɪv]",
    enDefinition: "Behaving in an angry and violent way towards another person.",
    zhDefinition: "adj. 侵略的；好斗的；有进取心的",
    example: "He has an aggressive management style.",
    category: "考研高频"
  },
  {
    word: "agitate",
    phonetic: "['ædʒɪteɪt]",
    enDefinition: "To make someone feel worried or angry.",
    zhDefinition: "v. 鼓动；使焦虑；搅拌",
    example: "Don't let the news agitate you.",
    category: "考研高频"
  },
  {
    word: "agony",
    phonetic: "['æɡəni]",
    enDefinition: "Extreme physical or mental pain or suffering.",
    zhDefinition: "n. 极度痛苦",
    example: "He was in agony after the accident.",
    category: "考研高频"
  },
  {
    word: "agree",
    phonetic: "[ə'ɡriː]",
    enDefinition: "To have the same opinion.",
    zhDefinition: "v. 同意；一致；答应",
    example: "I totally agree with you.",
    category: "考研高频"
  },
  {
    word: "agriculture",
    phonetic: "['æɡrɪkʌltʃə(r)]",
    enDefinition: "The work of farming or gardening.",
    zhDefinition: "n. 农业，农学",
    example: "The country's economy depends on agriculture.",
    category: "考研高频"
  },
  {
    word: "aid",
    phonetic: "[eɪd]",
    enDefinition: "Help or support.",
    zhDefinition: "v./n. 援助，救援；辅助物",
    example: "Humanitarian aid was sent to the region.",
    category: "考研高频"
  },
  {
    word: "aim",
    phonetic: "[eɪm]",
    enDefinition: "A result that your plans or actions are intended to achieve.",
    zhDefinition: "n. 目标 v. 目的在于；瞄准",
    example: "My aim is to become a doctor.",
    category: "考研高频"
  },
  {
    word: "alarm",
    phonetic: "[ə'lɑːm]",
    enDefinition: "A warning of danger or the feeling of fear.",
    zhDefinition: "n. 惊恐；警报 v. 使惊恐",
    example: "The fire alarm went off at midnight.",
    category: "考研高频"
  },
  {
    word: "album",
    phonetic: "['ælbəm]",
    enDefinition: "A collection of music or photographs.",
    zhDefinition: "n. 相册；集邮册；唱片集",
    example: "They just released their second album.",
    category: "考研高频"
  },
  {
    word: "alcohol",
    phonetic: "['ælkəhɒl]",
    enDefinition: "A liquid found in drinks like beer and wine.",
    zhDefinition: "n. 酒精，乙醇",
    example: "Drinking alcohol is not allowed here.",
    category: "考研高频"
  },
  {
    word: "alert",
    phonetic: "[ə'lɜːt]",
    enDefinition: "Quick to see, understand, and act in a particular situation.",
    zhDefinition: "adj. 机警的 v. 向…报警 n. 警戒",
    example: "The guards were on full alert.",
    category: "考研高频"
  },
  {
    word: "alien",
    phonetic: "['eɪliən]",
    enDefinition: "Coming from a different country, race, or group.",
    zhDefinition: "adj. 外国的；外星的 n. 外国人",
    example: "The film is about an alien invasion.",
    category: "考研高频"
  },
  {
    word: "align",
    phonetic: "[ə'laɪn]",
    enDefinition: "To put things in a straight line.",
    zhDefinition: "v. 使结盟；排成一行",
    example: "Make sure the wheels are aligned correctly.",
    category: "考研高频"
  },
  {
    word: "alike",
    phonetic: "[ə'laɪk]",
    enDefinition: "Similar to each other.",
    zhDefinition: "adj. 同样的 adv. 相似地",
    example: "The two sisters are very much alike.",
    category: "考研高频"
  },
  {
    word: "alive",
    phonetic: "[ə'laɪv]",
    enDefinition: "Living, not dead.",
    zhDefinition: "adj. 活着的；活跃的",
    example: "It's good to feel alive.",
    category: "考研高频"
  },
  {
    word: "allege",
    phonetic: "[ə'ledʒ]",
    enDefinition: "To say that someone has done something illegal or wrong without proof.",
    zhDefinition: "v. 断言，宣称",
    example: "They allege that he stole the car.",
    category: "考研高频"
  },
  {
    word: "alleviate",
    phonetic: "[ə'liːvieɪt]",
    enDefinition: "To make something bad such as pain or problems less severe.",
    zhDefinition: "v. 减轻，缓解",
    example: "The medicine will alleviate your pain.",
    category: "考研高频"
  },
  {
    word: "alliance",
    phonetic: "[ə'laɪəns]",
    enDefinition: "An agreement between countries, political parties, or people to work together.",
    zhDefinition: "n. 结盟，联盟",
    example: "The two countries formed a military alliance.",
    category: "考研高频"
  },
  {
    word: "allocate",
    phonetic: "['æləkeɪt]",
    enDefinition: "To give something to a person or organization for a particular purpose.",
    zhDefinition: "v. 分配，分派",
    example: "The government allocated money for the project.",
    category: "考研高频"
  },
  {
    word: "allow",
    phonetic: "[ə'laʊ]",
    enDefinition: "To give permission for someone to do something.",
    zhDefinition: "v. 允许；认可；考虑到",
    example: "Smoking is not allowed in the building.",
    category: "考研高频"
  },
  {
    word: "alloy",
    phonetic: "['ælɔɪ]",
    enDefinition: "A metal that is made by mixing two or more metals.",
    zhDefinition: "n. 合金 v. 将…铸成合金",
    example: "Brass is an alloy of copper and zinc.",
    category: "考研高频"
  },
  {
    word: "ally",
    phonetic: "['ælaɪ]",
    enDefinition: "A country or person that has agreed to help and support another.",
    zhDefinition: "n. 同盟国 v. (with) 结盟",
    example: "The US is a key ally of the UK.",
    category: "考研高频"
  },
  {
    word: "alone",
    phonetic: "[ə'ləʊn]",
    enDefinition: "Without other people.",
    zhDefinition: "adj. 单独的 adv. 独自地；仅仅",
    example: "I like being alone sometimes.",
    category: "考研高频"
  },
  {
    word: "along",
    phonetic: "[ə'lɒŋ]",
    enDefinition: "From one part of a road, river, etc. to another.",
    zhDefinition: "prep. 沿着 adv. 向前；来到",
    example: "We walked along the beach.",
    category: "考研高频"
  },
  {
    word: "aloud",
    phonetic: "[ə'laʊd]",
    enDefinition: "Using the voice; not silently.",
    zhDefinition: "adv. 大声地，响亮地",
    example: "Please read the text aloud.",
    category: "考研高频"
  },
  {
    word: "alphabet",
    phonetic: "['ælfəbet]",
    enDefinition: "A set of letters arranged in a fixed order.",
    zhDefinition: "n. 字母表",
    example: "The English alphabet has 26 letters.",
    category: "考研高频"
  },
  {
    word: "alter",
    phonetic: "['ɔːltə(r)]",
    enDefinition: "To change something, usually slightly.",
    zhDefinition: "v. 改变，变更",
    example: "We can't alter the past.",
    category: "考研高频"
  },
  {
    word: "alternative",
    phonetic: "[ɔːl'tɜːnətɪv]",
    enDefinition: "An alternative plan or method is one that you can use if you do not want to use another one.",
    zhDefinition: "n. 二选一；替换物 adj. 备选的",
    example: "Is there an alternative to this plan?",
    category: "考研高频"
  },
  {
    word: "altitude",
    phonetic: "['æltɪtjuːd]",
    enDefinition: "The height of an object or place above sea level.",
    zhDefinition: "n. 高度，海拔",
    example: "The plane is flying at a high altitude.",
    category: "考研高频"
  },
  {
    word: "aluminium",
    phonetic: "[ˌæljə'mɪniəm]",
    enDefinition: "A light silver-coloured metal.",
    zhDefinition: "n. 铝",
    example: "Cans are often made of aluminium.",
    category: "考研高频"
  },
  {
    word: "amateur",
    phonetic: "['æmətə(r)]",
    enDefinition: "Taking part in an activity for pleasure, not as a job.",
    zhDefinition: "adj. 业余的 n. 业余爱好者",
    example: "He is an amateur photographer.",
    category: "考研高频"
  },
  {
    word: "amaze",
    phonetic: "[ə'meɪz]",
    enDefinition: "To cause someone to be extremely surprised.",
    zhDefinition: "v. 使惊奇，使惊愕",
    example: "Your progress continues to amaze me.",
    category: "考研高频"
  },
  {
    word: "ambassador",
    phonetic: "[æm'bæsədə(r)]",
    enDefinition: "An important official who represents their country in a foreign country.",
    zhDefinition: "n. 大使，使节",
    example: "She was appointed ambassador to France.",
    category: "考研高频"
  },
  {
    word: "ambiguous",
    phonetic: "[æm'bɪɡjuəs]",
    enDefinition: "Having or expressing more than one possible meaning.",
    zhDefinition: "adj. 模棱两可的，含糊的",
    example: "The instructions are somewhat ambiguous.",
    category: "考研高频"
  },
  {
    word: "ambition",
    phonetic: "[æm'bɪʃn]",
    enDefinition: "A strong wish to achieve something.",
    zhDefinition: "n. 抱负，雄心，野心",
    example: "My ambition is to travel the world.",
    category: "考研高频"
  },
  {
    word: "ambitious",
    phonetic: "[æm'bɪʃəs]",
    enDefinition: "Having a strong wish to be successful, powerful, or rich.",
    zhDefinition: "adj. 有抱负的；有野心的",
    example: "He is an ambitious young man.",
    category: "考研高频"
  },
  {
    word: "ambulance",
    phonetic: "['æmbjələns]",
    enDefinition: "A vehicle used to take sick or injured people to hospital.",
    zhDefinition: "n. 救护车",
    example: "The ambulance arrived within five minutes.",
    category: "考研高频"
  },
  {
    word: "amend",
    phonetic: "[ə'mend]",
    enDefinition: "To change something, especially a law or a statement, in order to improve it.",
    zhDefinition: "v. 修改，修订",
    example: "They decided to amend the contract.",
    category: "考研高频"
  },
  {
    word: "amiable",
    phonetic: "['eɪmiəbl]",
    enDefinition: "Pleasant and friendly.",
    zhDefinition: "adj. 和蔼可亲的，友好的",
    example: "The host was very amiable.",
    category: "考研高频"
  },
  {
    word: "amid",
    phonetic: "[ə'mɪd]",
    enDefinition: "In the middle of or surrounded by.",
    zhDefinition: "prep. 在…中间，被…围绕",
    example: "The house stood amid a field of flowers.",
    category: "考研高频"
  },
  {
    word: "among",
    phonetic: "[ə'mʌŋ]",
    enDefinition: "In the middle of or surrounded by other things.",
    zhDefinition: "prep. 在…之中；在…中间",
    example: "He was hiding among the trees.",
    category: "考研高频"
  },

  {
    word: "amount",
    phonetic: "[ə'maʊnt]",
    enDefinition: "A collection or mass, especially of something that cannot be counted.",
    zhDefinition: "n. 总额，数量 v. 合计，等同于",
    example: "The project will cost a huge amount of money.",
    category: "考研高频"
  },
  {
    word: "ample",
    phonetic: "['æmpl]",
    enDefinition: "More than enough.",
    zhDefinition: "adj. 足够的，充裕的；宽敞的",
    example: "You'll have ample opportunity to ask questions.",
    category: "考研高频"
  },
  {
    word: "amplify",
    phonetic: "['æmplɪfaɪ]",
    enDefinition: "To make something louder or stronger.",
    zhDefinition: "v. 放大，增强；详述",
    example: "Electric guitars are used with an amplifier to amplify the sound.",
    category: "考研高频"
  },
  {
    word: "amuse",
    phonetic: "[ə'mjuːz]",
    enDefinition: "To entertain someone and make them laugh or smile.",
    zhDefinition: "v. 逗乐，使消遣",
    example: "I've brought some books to amuse the children.",
    category: "考研高频"
  },
  {
    word: "analogy",
    phonetic: "[ə'nælədʒi]",
    enDefinition: "A comparison between things that have similar features.",
    zhDefinition: "n. 比拟，类比",
    example: "She drew an analogy between the human heart and a pump.",
    category: "考研高频"
  },
  {
    word: "analyze",
    phonetic: "['ænəlaɪz]",
    enDefinition: "To study or examine something in detail.",
    zhDefinition: "v. 分析，分解",
    example: "Researchers are analyzing the results of the experiment.",
    category: "考研高频"
  },
  {
    word: "ancestor",
    phonetic: "['ænsestə(r)]",
    enDefinition: "A person related to you who lived a long time ago.",
    zhDefinition: "n. 祖先，祖宗",
    example: "His ancestors came from Italy.",
    category: "考研高频"
  },
  {
    word: "anchor",
    phonetic: "['æŋkə(r)]",
    enDefinition: "A heavy metal object used to keep a ship in one place.",
    zhDefinition: "n. 锚 v. 抛锚；固定",
    example: "The ship dropped anchor in the bay.",
    category: "考研高频"
  },
  {
    word: "ancient",
    phonetic: "['eɪnʃənt]",
    enDefinition: "From a long time ago, very old.",
    zhDefinition: "adj. 古老的，古代的",
    example: "Archaeologists are studying ancient civilizations.",
    category: "考研高频"
  },
  {
    word: "anecdote",
    phonetic: "['ænɪkdəʊt]",
    enDefinition: "A short, often funny story about a real person or event.",
    zhDefinition: "n. 轶事，趣闻",
    example: "The book is full of amusing anecdotes about his life.",
    category: "考研高频"
  },
  {
    word: "angle",
    phonetic: "['æŋɡl]",
    enDefinition: "The space between two lines or surfaces at the point at which they touch.",
    zhDefinition: "n. 角，角度；观点",
    example: "The tower is leaning at a dangerous angle.",
    category: "考研高频"
  },
  {
    word: "angular",
    phonetic: "['æŋɡjələ(r)]",
    enDefinition: "Having a sharp corner or many sharp corners.",
    zhDefinition: "adj. 有角的，尖角的；瘦骨嶙峋的",
    example: "She has a very angular face.",
    category: "考研高频"
  },
  {
    word: "anniversary",
    phonetic: "[ˌænɪ'vɜːsəri]",
    enDefinition: "The day on which an important event happened in a previous year.",
    zhDefinition: "n. 周年纪念日",
    example: "We are celebrating our tenth wedding anniversary.",
    category: "考研高频"
  },
  {
    word: "announce",
    phonetic: "[ə'naʊns]",
    enDefinition: "To make something known or tell people about something officially.",
    zhDefinition: "v. 宣布，通告",
    example: "The government has announced plans to cut taxes.",
    category: "考研高频"
  },
  {
    word: "annoy",
    phonetic: "[ə'nɔɪ]",
    enDefinition: "To make someone feel slightly angry.",
    zhDefinition: "v. 使恼怒，打搅",
    example: "It really annoys me when people are late.",
    category: "考研高频"
  },
  {
    word: "annual",
    phonetic: "['ænjuəl]",
    enDefinition: "Happening once every year.",
    zhDefinition: "adj. 每年的，年度的",
    example: "The company holds an annual general meeting.",
    category: "考研高频"
  },
  {
    word: "anonymous",
    phonetic: "[ə'nɒnɪməs]",
    enDefinition: "Made or done by someone whose name is not known.",
    zhDefinition: "adj. 匿名的，无名的",
    example: "The donor wishes to remain anonymous.",
    category: "考研高频"
  },
  {
    word: "anticipate",
    phonetic: "[æn'tɪsɪpeɪt]",
    enDefinition: "To imagine or expect that something will happen.",
    zhDefinition: "v. 预料，预期；期望",
    example: "We don't anticipate any problems with the new system.",
    category: "考研高频"
  },
  {
    word: "anxiety",
    phonetic: "[æŋ'zaɪəti]",
    enDefinition: "An uncomfortable feeling of nervousness or worry.",
    zhDefinition: "n. 焦虑，忧虑；渴望",
    example: "The waiting is causing a lot of anxiety.",
    category: "考研高频"
  },
  {
    word: "anxious",
    phonetic: "['æŋkʃəs]",
    enDefinition: "Worried and nervous.",
    zhDefinition: "adj. 焦虑的；渴望的",
    example: "I'm very anxious about the exam results.",
    category: "考研高频"
  },
  {
    word: "apart",
    phonetic: "[ə'pɑːt]",
    enDefinition: "Separated by a distance or at a specified distance from each other.",
    zhDefinition: "adv. 分离；相隔 adj. 分离的",
    example: "The two houses are about 500 meters apart.",
    category: "考研高频"
  },
  {
    word: "apartment",
    phonetic: "[ə'pɑːtmənt]",
    enDefinition: "A set of rooms for living in, especially on one floor of a building.",
    zhDefinition: "n. 公寓套房",
    example: "They live in a small apartment in New York.",
    category: "考研高频"
  },
  {
    word: "apologize",
    phonetic: "[ə'pɒlədʒaɪz]",
    enDefinition: "To say sorry for something wrong you have done.",
    zhDefinition: "v. 道歉，谢罪",
    example: "You should apologize for your behavior.",
    category: "考研高频"
  },
  {
    word: "apparatus",
    phonetic: "[ˌæpə'reɪtəs]",
    enDefinition: "A set of equipment or tools used for a particular purpose.",
    zhDefinition: "n. 器械，设备；机构",
    example: "The divers were wearing breathing apparatus.",
    category: "考研高频"
  },
  {
    word: "apparent",
    phonetic: "[ə'pærənt]",
    enDefinition: "Able to be seen or understood.",
    zhDefinition: "adj. 明显的；表面上的",
    example: "It was apparent that she was not happy.",
    category: "考研高频"
  },
  {
    word: "appeal",
    phonetic: "[ə'piːl]",
    enDefinition: "A request to the public for money, information, or help.",
    zhDefinition: "v./n. 呼吁；申诉；有吸引力",
    example: "The police made an appeal for witnesses.",
    category: "考研高频"
  },
  {
    word: "appearance",
    phonetic: "[ə'pɪərəns]",
    enDefinition: "The way that someone or something looks.",
    zhDefinition: "n. 出现；外观，外貌",
    example: "She has a very youthful appearance.",
    category: "考研高频"
  },
  {
    word: "appendix",
    phonetic: "[ə'pendɪks]",
    enDefinition: "A separate part at the end of a book or document.",
    zhDefinition: "n. 附录；阑尾",
    example: "The full details are given in Appendix 3.",
    category: "考研高频"
  },
  {
    word: "appetite",
    phonetic: "['æpɪtaɪt]",
    enDefinition: "The feeling that you want to eat food.",
    zhDefinition: "n. 食欲，胃口；欲望",
    example: "He has a healthy appetite.",
    category: "考研高频"
  },
  {
    word: "applaud",
    phonetic: "[ə'plɔːd]",
    enDefinition: "To show enjoyment or approval of something by clapping your hands.",
    zhDefinition: "v. 鼓掌欢迎；赞许",
    example: "The audience stood up to applaud the performance.",
    category: "考研高频"
  },
  {
    word: "appliance",
    phonetic: "[ə'plaɪəns]",
    enDefinition: "A device, machine, or piece of equipment, especially an electrical one used in the home.",
    zhDefinition: "n. 器具，器械",
    example: "We sell a wide range of domestic appliances.",
    category: "考研高频"
  },
  {
    word: "applicable",
    phonetic: "['æplɪkəbl]",
    enDefinition: "Affecting or relating to a particular person, group, or situation.",
    zhDefinition: "adj. 可应用的，合适的",
    example: "These rules are not applicable to foreign students.",
    category: "考研高频"
  },
  {
    word: "apply",
    phonetic: "[ə'plaɪ]",
    enDefinition: "To request something, usually officially, especially in writing.",
    zhDefinition: "v. 申请；应用；涂抹",
    example: "I've decided to apply for the job.",
    category: "考研高频"
  },
  {
    word: "appoint",
    phonetic: "[ə'pɔɪnt]",
    enDefinition: "To choose someone officially for a job or responsibility.",
    zhDefinition: "v. 任命，委派；约定(时间地点)",
    example: "They appointed him as manager of the team.",
    category: "考研高频"
  },
  {
    word: "appraisal",
    phonetic: "[ə'preɪzl]",
    enDefinition: "The act of examining someone or something in order to judge their qualities, success, or needs.",
    zhDefinition: "n. 评价，估价",
    example: "The report gives a critical appraisal of the project.",
    category: "考研高频"
  },
  {
    word: "appreciate",
    phonetic: "[ə'priːʃieɪt]",
    enDefinition: "To recognize how good someone or something is and to value him, her, or it.",
    zhDefinition: "v. 欣赏；感激；增值",
    example: "I really appreciate your help.",
    category: "考研高频"
  },
  {
    word: "approach",
    phonetic: "[ə'prəʊtʃ]",
    enDefinition: "To come near or nearer to something or someone in space or time.",
    zhDefinition: "v. 靠近 n. 方法，途径",
    example: "The plane is making its final approach to the runway.",
    category: "考研高频"
  },
  {
    word: "appropriate",
    phonetic: "[ə'prəʊpriət]",
    enDefinition: "Suitable or right for a particular situation or occasion.",
    zhDefinition: "adj. 适当的，恰当的",
    example: "Please dress in clothes appropriate for an interview.",
    category: "考研高频"
  },
  {
    word: "approve",
    phonetic: "[ə'pruːv]",
    enDefinition: "To have a positive opinion of someone or something.",
    zhDefinition: "v. 赞成；批准",
    example: "My parents don't approve of my new friends.",
    category: "考研高频"
  },
  {
    word: "approximate",
    phonetic: "[ə'prɒksɪmət]",
    enDefinition: "Not completely accurate but close.",
    zhDefinition: "adj. 大约的 v. 接近",
    example: "The approximate cost will be around $500.",
    category: "考研高频"
  },
  {
    word: "aptitude",
    phonetic: "['æptɪtjuːd]",
    enDefinition: "A natural ability or skill.",
    zhDefinition: "n. 天资，天赋",
    example: "She has a natural aptitude for music.",
    category: "考研高频"
  },
  {
    word: "arbitrary",
    phonetic: "['ɑːbɪtrəri]",
    enDefinition: "Based on chance rather than being planned or based on reason.",
    zhDefinition: "adj. 随意的，武断的；专断的",
    example: "The choice of players was completely arbitrary.",
    category: "考研高频"
  },
  {
    word: "architecture",
    phonetic: "['ɑːkɪtektʃə(r)]",
    enDefinition: "The design and style of buildings.",
    zhDefinition: "n. 建筑学，建筑风格",
    example: "I love the modern architecture in this city.",
    category: "考研高频"
  },
  {
    word: "area",
    phonetic: "['eəriə]",
    enDefinition: "A particular part of a place, piece of land, or country.",
    zhDefinition: "n. 地区；面积；领域",
    example: "The area around the park is very quiet.",
    category: "考研高频"
  },
  {
    word: "argue",
    phonetic: "['ɑːɡjuː]",
    enDefinition: "To speak angrily to someone because you disagree with them.",
    zhDefinition: "v. 争吵，争论；论证",
    example: "They are always arguing about money.",
    category: "考研高频"
  },
  {
    word: "arise",
    phonetic: "[ə'raɪz]",
    enDefinition: "To happen; to start to exist or occur.",
    zhDefinition: "v. 出现，发生；起床",
    example: "A lot of problems arise from a lack of communication.",
    category: "考研高频"
  },
  {
    word: "arithmetic",
    phonetic: "[ə'rɪθmətɪk]",
    enDefinition: "The part of mathematics that involves the adding and multiplying, etc. of numbers.",
    zhDefinition: "n. 算术",
    example: "He's not very good at mental arithmetic.",
    category: "考研高频"
  },
  {
    word: "arouse",
    phonetic: "[ə'raʊz]",
    enDefinition: "To cause someone to have a particular feeling.",
    zhDefinition: "v. 引起，激起；唤醒",
    example: "The strange behavior aroused my suspicions.",
    category: "考研高频"
  },
  {
    word: "arrange",
    phonetic: "[ə'reɪndʒ]",
    enDefinition: "To plan, prepare for, or organize something.",
    zhDefinition: "v. 安排，筹划；整理",
    example: "I've arranged a meeting for Wednesday.",
    category: "考研高频"
  },
  {
    word: "array",
    phonetic: "[ə'reɪ]",
    enDefinition: "A large group of things or people, especially one that is attractive or causes admiration.",
    zhDefinition: "n. 阵列；一大批",
    example: "The store offers a vast array of products.",
    category: "考研高频"
  },
  {
    word: "arrest",
    phonetic: "[ə'rest]",
    enDefinition: "If the police arrest someone, they take them away to ask them about a crime.",
    zhDefinition: "v./n. 逮捕，拘留；阻碍",
    example: "He was arrested for shoplifting.",
    category: "考研高频"
  },
  {
    word: "arrogant",
    phonetic: "['ærəɡənt]",
    enDefinition: "Proud and unpleasant, and behaving as if you are more important than other people.",
    zhDefinition: "adj. 傲慢的，自大的",
    example: "He was so arrogant that he never listened to anyone.",
    category: "考研高频"
  },
  {
    word: "arrow",
    phonetic: "['ærəʊ]",
    enDefinition: "A long thin stick with a sharp point that is shot from a bow.",
    zhDefinition: "n. 箭；箭头符号",
    example: "Follow the arrows to the exit.",
    category: "考研高频"
  },
  {
    word: "art",
    phonetic: "[ɑːt]",
    enDefinition: "The making of objects such as paintings or sculptures that are beautiful or that express feelings.",
    zhDefinition: "n. 艺术，美术；技艺",
    example: "I'm not very good at art.",
    category: "考研高频"
  },
  {
    word: "artery",
    phonetic: "['ɑːtəri]",
    enDefinition: "One of the thick tubes that carry blood from the heart to other parts of the body.",
    zhDefinition: "n. 动脉；干道",
    example: "Hardening of the arteries is a serious health problem.",
    category: "考研高频"
  },
  {
    word: "article",
    phonetic: "['ɑːtɪkl]",
    enDefinition: "A piece of writing on a particular subject in a newspaper or magazine.",
    zhDefinition: "n. 文章；物品；条款",
    example: "I read an interesting article about travel today.",
    category: "考研高频"
  },
  {
    word: "artificial",
    phonetic: "[ˌɑːtɪ'fɪʃl]",
    enDefinition: "Made by people, often as a copy of something natural.",
    zhDefinition: "adj. 人造的，人工的；虚假的",
    example: "The garden was filled with artificial flowers.",
    category: "考研高频"
  },
  {
    word: "artist",
    phonetic: "['ɑːtɪst]",
    enDefinition: "Someone who paints, draws, or makes sculptures.",
    zhDefinition: "n. 艺术家，画家",
    example: "He is a very talented young artist.",
    category: "考研高频"
  },
  {
    word: "ascend",
    phonetic: "[ə'send]",
    enDefinition: "To move up or climb something.",
    zhDefinition: "v. 上升，攀登",
    example: "The path ascends to the top of the hill.",
    category: "考研高频"
  },
  {
    word: "ascertain",
    phonetic: "[ˌæsə'teɪn]",
    enDefinition: "To discover a fact; to find out something for certain.",
    zhDefinition: "v. 查明，弄清",
    example: "Police are trying to ascertain the cause of the fire.",
    category: "考研高频"
  },
  {
    word: "ash",
    phonetic: "[æʃ]",
    enDefinition: "The grey powder that is left after something has burnt.",
    zhDefinition: "n. 灰，灰烬",
    example: "Cigarette ash was scattered all over the floor.",
    category: "考研高频"
  },
  {
    word: "ashamed",
    phonetic: "[ə'ʃeɪmd]",
    enDefinition: "Feeling guilty or embarrassed about something you have done.",
    zhDefinition: "adj. 羞耻的，惭愧的",
    example: "You should be ashamed of yourself.",
    category: "考研高频"
  },
  {
    word: "aside",
    phonetic: "[ə'saɪd]",
    enDefinition: "To one side; out of the way.",
    zhDefinition: "adv. 在旁边 n. 旁白",
    example: "He pushed his plate aside and stood up.",
    category: "考研高频"
  },
  {
    word: "aspect",
    phonetic: "['æspekt]",
    enDefinition: "One part of a situation, problem, or subject.",
    zhDefinition: "n. 方面；样子，外观",
    example: "Which aspect of the job do you enjoy most?",
    category: "考研高频"
  },
  {
    word: "aspire",
    phonetic: "[ə'spaɪə(r)]",
    enDefinition: "To have a strong wish or hope to do or have something.",
    zhDefinition: "v. 渴望，追求",
    example: "Many young people aspire to be famous.",
    category: "考研高频"
  },
  {
    word: "assassinate",
    phonetic: "[ə'sæsɪneɪt]",
    enDefinition: "To kill someone famous or important.",
    zhDefinition: "v. 暗杀，行刺",
    example: "President Kennedy was assassinated in 1963.",
    category: "考研高频"
  },
  {
    word: "assault",
    phonetic: "[ə'sɔːlt]",
    enDefinition: "A violent attack.",
    zhDefinition: "v./n. 攻击，袭击",
    example: "He was charged with sexual assault.",
    category: "考研高频"
  },
  {
    word: "assemble",
    phonetic: "[ə'sembl]",
    enDefinition: "To come together in a single place or bring parts together in a single group.",
    zhDefinition: "v. 集合；组装",
    example: "We assembled in the main hall.",
    category: "考研高频"
  },
  {
    word: "assert",
    phonetic: "[ə'sɜːt]",
    enDefinition: "To say that something is certainly true.",
    zhDefinition: "v. 断言，宣称；维护",
    example: "He continues to assert his innocence.",
    category: "考研高频"
  },
  {
    word: "assess",
    phonetic: "[ə'ses]",
    enDefinition: "To judge or decide the amount, value, quality, or importance of something.",
    zhDefinition: "v. 评估，估价",
    example: "The damage was assessed at $1000.",
    category: "考研高频"
  },
  {
    word: "asset",
    phonetic: "['æset]",
    enDefinition: "A useful or valuable quality, skill, or person.",
    zhDefinition: "n. 资产，财产；优点",
    example: "A sense of humor is a great asset.",
    category: "考研高频"
  },
  {
    word: "assign",
    phonetic: "[ə'saɪn]",
    enDefinition: "To give a particular job or piece of work to someone.",
    zhDefinition: "v. 指派，分配；布置(作业)",
    example: "The teacher assigned a new project to the class.",
    category: "考研高频"
  },
  {
    word: "assimilate",
    phonetic: "[ə'sɪməleɪt]",
    enDefinition: "To become part of a group, country, society, etc., or to make someone or something become part of a group, country, society, etc.",
    zhDefinition: "v. 同化；吸收",
    example: "It takes time to assimilate new ideas.",
    category: "考研高频"
  },
  {
    word: "assist",
    phonetic: "[ə'sɪst]",
    enDefinition: "To help.",
    zhDefinition: "v. 帮助，援助",
    example: "The robot is designed to assist the elderly.",
    category: "考研高频"
  },
  {
    word: "assistant",
    phonetic: "[ə'sɪstənt]",
    enDefinition: "Someone who helps someone else to do a job.",
    zhDefinition: "n. 助手，助理",
    example: "He works as a sales assistant.",
    category: "考研高频"
  },
  {
    word: "associate",
    phonetic: "[ə'səʊʃieɪt]",
    enDefinition: "To connect someone or something in your mind with someone or something else.",
    zhDefinition: "v. 交往；联系 n. 伙伴",
    example: "Most people associate this brand with high quality.",
    category: "考研高频"
  },
  {
    word: "assume",
    phonetic: "[ə'sjuːm]",
    enDefinition: "To accept something to be true without question or proof.",
    zhDefinition: "v. 假定，假设；承担",
    example: "Let's assume that they are coming.",
    category: "考研高频"
  },
  {
    word: "assurance",
    phonetic: "[ə'ʃʊərəns]",
    enDefinition: "A promise to tell something to someone confidently or firmly, or a promise that something will happen.",
    zhDefinition: "n. 保证；把握，自信",
    example: "He gave me his assurance that he would help.",
    category: "考研高频"
  },
  {
    word: "astonish",
    phonetic: "[ə'stɒnɪʃ]",
    enDefinition: "To surprise someone very much.",
    zhDefinition: "v. 使惊讶，使大吃一惊",
    example: "The news astonished everyone.",
    category: "考研高频"
  },
  {
    word: "astronaut",
    phonetic: "['æstrənɔːt]",
    enDefinition: "A person who has been trained for travelling in space.",
    zhDefinition: "n. 宇航员",
    example: "The astronaut spent six months on the space station.",
    category: "考研高频"
  },
  {
    word: "astronomy",
    phonetic: "[ə'strɒnəmi]",
    enDefinition: "The scientific study of the universe and of objects that exist naturally in space, such as the moon, the sun, planets, and stars.",
    zhDefinition: "n. 天文学",
    example: "She has been interested in astronomy since childhood.",
    category: "考研高频"
  },
  {
    word: "athlete",
    phonetic: "['æθliːt]",
    enDefinition: "A person who is very good at sports or physical exercise, especially one who competes in organized events.",
    zhDefinition: "n. 运动员",
    example: "He is a natural athlete.",
    category: "考研高频"
  },
  {
    word: "atmosphere",
    phonetic: "['ætməsfɪə(r)]",
    enDefinition: "The mixture of gases around the earth.",
    zhDefinition: "n. 大气层；气氛",
    example: "The restaurant has a very friendly atmosphere.",
    category: "考研高频"
  },
  {
    word: "atom",
    phonetic: "['ætəm]",
    enDefinition: "The smallest unit of any chemical element, consisting of a nucleus with a positive charge or of a nucleus with a positive charge surrounded by negatively charged electrons.",
    zhDefinition: "n. 原子",
    example: "Everything in the world is made of atoms.",
    category: "考研高频"
  },
  {
    word: "attach",
    phonetic: "[ə'tætʃ]",
    enDefinition: "To fasten, join, or connect something.",
    zhDefinition: "v. 系，贴；使隶属",
    example: "I've attached the photo to the email.",
    category: "考研高频"
  },
  {
    word: "attain",
    phonetic: "[ə'teɪn]",
    enDefinition: "To reach or succeed in getting something; to achieve.",
    zhDefinition: "v. 达到，获得",
    example: "She has attained a high level of proficiency in English.",
    category: "考研高频"
  },
  {
    word: "attempt",
    phonetic: "[ə'tempt]",
    enDefinition: "To try to do something, especially something difficult.",
    zhDefinition: "v./n. 尝试，试图",
    example: "He made an attempt to climb the mountain.",
    category: "考研高频"
  },
  {
    word: "attend",
    phonetic: "[ə'tend]",
    enDefinition: "To go to an event, place, etc.",
    zhDefinition: "v. 出席；照料",
    example: "Thousands of people attended the concert.",
    category: "考研高频"
  },
  {
    word: "attention",
    phonetic: "[ə'tenʃn]",
    enDefinition: "Notice, thought, or consideration.",
    zhDefinition: "n. 注意，留心",
    example: "Please pay attention to the safety rules.",
    category: "考研高频"
  },
  {
    word: "attitude",
    phonetic: "['ætɪtjuːd]",
    enDefinition: "A feeling or opinion about something or someone, or a way of behaving that is caused by this.",
    zhDefinition: "n. 态度，看法",
    example: "He has a positive attitude towards life.",
    category: "考研高频"
  },
  {
    word: "attorney",
    phonetic: "[ə'tɜːni]",
    enDefinition: "A lawyer.",
    zhDefinition: "n. 律师，代理人",
    example: "He hired a top attorney to defend him.",
    category: "考研高频"
  },
  {
    word: "attract",
    phonetic: "[ə'trækt]",
    enDefinition: "To pull or draw someone or something towards them, by the qualities they have, especially good ones.",
    zhDefinition: "v. 吸引，引起注意",
    example: "The flowers attract bees and butterflies.",
    category: "考研高频"
  },
  {
    word: "attractive",
    phonetic: "[ə'træktɪv]",
    enDefinition: "Very pleasing in appearance or sound.",
    zhDefinition: "adj. 有吸引力的，迷人的",
    example: "The town is very attractive to tourists.",
    category: "考研高频"
  },
  {
    word: "attribute",
    phonetic: "['ætrɪbjuːt]",
    enDefinition: "A quality or characteristic that someone or something has.",
    zhDefinition: "v. 归因于 n. 属性，特征",
    example: "Patience is one of his best attributes.",
    category: "考研高频"
  },
  {
    word: "auction",
    phonetic: "['ɔːkʃn]",
    enDefinition: "A usually public sale of goods or property, where people make higher and higher bids (= offers of money) for each thing, until the thing is sold to the person who will pay most.",
    zhDefinition: "v./n. 拍卖",
    example: "The painting was sold at an auction for $1 million.",
    category: "考研高频"
  },
  {
    word: "audience",
    phonetic: "['ɔːdiəns]",
    enDefinition: "The group of people together in one place to watch or listen to a play, movie, someone speaking, etc.",
    zhDefinition: "n. 观众，听众",
    example: "The audience gave him a standing ovation.",
    category: "考研高频"
  },
  {
    word: "audio",
    phonetic: "['ɔːdiəʊ]",
    enDefinition: "Relating to sound that is recorded or broadcast.",
    zhDefinition: "adj. 音频的，声音的",
    example: "The audio quality of the video is excellent.",
    category: "考研高频"
  },
  {
    word: "audit",
    phonetic: "['ɔːdɪt]",
    enDefinition: "An official examination of an organization's accounts.",
    zhDefinition: "v./n. 审计，查账；旁听",
    example: "The company's accounts are audited every year.",
    category: "考研高频"
  },
  {
    word: "augment",
    phonetic: "[ɔːɡ'ment]",
    enDefinition: "To increase the size or value of something by adding something to it.",
    zhDefinition: "v. 增加，提高",
    example: "He worked overtime to augment his income.",
    category: "考研高频"
  },
  {
    word: "authentic",
    phonetic: "[ɔː'θentɪk]",
    enDefinition: "If something is authentic, it is real, true, or what people say it is.",
    zhDefinition: "adj. 真实的，正宗的",
    example: "The restaurant serves authentic Italian food.",
    category: "考研高频"
  },

  {
    word: "author",
    phonetic: "['ɔːθə(r)]",
    enDefinition: "The writer of a book, article, play, etc.",
    zhDefinition: "n. 作者，作家；创始人",
    example: "Who is your favorite author?",
    category: "考研高频"
  },
  {
    word: "authority",
    phonetic: "[ɔː'θɒrəti]",
    enDefinition: "The moral or legal right to rule, control, or make decisions.",
    zhDefinition: "n. 权威；权力；当局",
    example: "He has no authority over us.",
    category: "考研高频"
  },
  {
    word: "authorize",
    phonetic: "['ɔːθəraɪz]",
    enDefinition: "To give official permission for something to happen.",
    zhDefinition: "v. 授权，批准",
    example: "Only the director can authorize the purchase.",
    category: "考研高频"
  },
  {
    word: "automatic",
    phonetic: "[ˌɔːtə'mætɪk]",
    enDefinition: "An automatic machine or device is one that starts by itself.",
    zhDefinition: "adj. 自动的；不假思索的",
    example: "The building has automatic sliding doors.",
    category: "考研高频"
  },
  {
    word: "auxiliary",
    phonetic: "[ɔːɡ'zɪliəri]",
    enDefinition: "Giving help or support, especially to a more important person or thing.",
    zhDefinition: "adj. 辅助的，备用的 n. 助动词",
    example: "The hospital has an auxiliary power supply.",
    category: "考研高频"
  },
  {
    word: "avail",
    phonetic: "[ə'veɪl]",
    enDefinition: "To help or be useful to someone or something.",
    zhDefinition: "v. 有用，有益 n. 效用，利益",
    example: "Our efforts were of little avail.",
    category: "考研高频"
  },
  {
    word: "available",
    phonetic: "[ə'veɪləbl]",
    enDefinition: "Able to be bought or used.",
    zhDefinition: "adj. 可用的，可得到的；有空的",
    example: "Is this seat available?",
    category: "考研高频"
  },
  {
    word: "avenue",
    phonetic: "['ævənjuː]",
    enDefinition: "A wide road, with trees or tall buildings on both sides.",
    zhDefinition: "n. 林荫道，大街；途径",
    example: "We should explore every avenue for a solution.",
    category: "考研高频"
  },
  {
    word: "average",
    phonetic: "['ævərɪdʒ]",
    enDefinition: "The result you get by adding two or more amounts together and dividing the total by the number of amounts.",
    zhDefinition: "adj. 平均的；普通的 n. 平均数",
    example: "The average age of the students is 20.",
    category: "考研高频"
  },
  {
    word: "avert",
    phonetic: "[ə'vɜːt]",
    enDefinition: "To prevent something bad from happening.",
    zhDefinition: "v. 防止，避免；转移(目光)",
    example: "She averted her eyes from the scene.",
    category: "考研高频"
  },
  {
    word: "aviation",
    phonetic: "[ˌeɪvi'eɪʃn]",
    enDefinition: "The activity of flying aircraft, or the design and production of aircraft.",
    zhDefinition: "n. 航空，飞行",
    example: "He has a great interest in aviation history.",
    category: "考研高频"
  },
  {
    word: "avoid",
    phonetic: "[ə'vɔɪd]",
    enDefinition: "To stay away from someone or something.",
    zhDefinition: "v. 避免，避开",
    example: "I try to avoid traveling during rush hour.",
    category: "考研高频"
  },
  {
    word: "await",
    phonetic: "[ə'weɪt]",
    enDefinition: "To wait for something.",
    zhDefinition: "v. 等候，期待",
    example: "A surprise awaits you at home.",
    category: "考研高频"
  },
  {
    word: "award",
    phonetic: "[ə'wɔːd]",
    enDefinition: "To give money or a prize to someone officially or legally.",
    zhDefinition: "n. 奖，奖品 v. 授予",
    example: "She won an award for her research.",
    category: "考研高频"
  },
  {
    word: "aware",
    phonetic: "[ə'weə(r)]",
    enDefinition: "Knowing that something exists, or having knowledge or experience of a particular thing.",
    zhDefinition: "adj. 意识到的，知道的",
    example: "Are you aware of the danger?",
    category: "考研高频"
  },
  {
    word: "awful",
    phonetic: "['ɔːfl]",
    enDefinition: "Extremely bad or unpleasant.",
    zhDefinition: "adj. 糟糕的，可怕的",
    example: "The weather was absolutely awful.",
    category: "考研高频"
  },
  {
    word: "awkward",
    phonetic: "['ɔːkwəd]",
    enDefinition: "Difficult to use, do, or deal with.",
    zhDefinition: "adj. 尴尬的；笨拙的；难处理的",
    example: "There was an awkward silence in the room.",
    category: "考研高频"
  },
  {
    word: "axis",
    phonetic: "['æksɪs]",
    enDefinition: "A real or imaginary straight line going through the centre of an object that is spinning.",
    zhDefinition: "n. 轴，轴线",
    example: "The earth rotates on its axis.",
    category: "考研高频"
  },
  {
    word: "baby",
    phonetic: "['beɪbi]",
    enDefinition: "A very young child, especially one that has not yet begun to walk or talk.",
    zhDefinition: "n. 婴儿",
    example: "The baby is sleeping peacefully.",
    category: "考研高频"
  },
  {
    word: "bachelor",
    phonetic: "['bætʃələ(r)]",
    enDefinition: "A man who has never married; a person who has a first degree from a university.",
    zhDefinition: "n. 单身汉；学士",
    example: "He is a confirmed bachelor. / He has a Bachelor of Arts.",
    category: "考研高频"
  },
  {
    word: "background",
    phonetic: "['bækɡraʊnd]",
    enDefinition: "The things that can be seen behind the main things or people in a picture.",
    zhDefinition: "n. 背景；经历",
    example: "The photo was taken against a mountain background.",
    category: "考研高频"
  },
  {
    word: "backward",
    phonetic: "['bækwəd]",
    enDefinition: "Not advanced.",
    zhDefinition: "adj. 向后的；落后的 adv. 向后地",
    example: "They are trying to help people in backward areas.",
    category: "考研高频"
  },
  {
    word: "bacon",
    phonetic: "['beɪkən]",
    enDefinition: "Meat from the back or sides of a pig that is cured with salt or smoke.",
    zhDefinition: "n. 咸肉，培根",
    example: "I'd like some bacon and eggs for breakfast.",
    category: "考研高频"
  },
  {
    word: "badly",
    phonetic: "['bædli]",
    enDefinition: "In a severe and harmful way.",
    zhDefinition: "adv. 坏地，恶劣地；严重地",
    example: "The company was badly managed.",
    category: "考研高频"
  },
  {
    word: "badminton",
    phonetic: "['bædmɪntən]",
    enDefinition: "A sport in which two or four people hit a shuttlecock over a high net.",
    zhDefinition: "n. 羽毛球",
    example: "Do you want to play badminton this afternoon?",
    category: "考研高频"
  },
  {
    word: "baggage",
    phonetic: "['bæɡɪdʒ]",
    enDefinition: "All the cases and bags that you take with you when you travel.",
    zhDefinition: "n. 行李",
    example: "We left our baggage at the station.",
    category: "考研高频"
  },
  {
    word: "bait",
    phonetic: "[beɪt]",
    enDefinition: "A small amount of food on a hook or in a trap used to attract and catch a fish or animal.",
    zhDefinition: "n. 饵，诱饵 v. 引诱",
    example: "We used worms as bait to catch the fish.",
    category: "考研高频"
  },
  {
    word: "bake",
    phonetic: "[beɪk]",
    enDefinition: "To cook food such as bread and cakes in an oven.",
    zhDefinition: "v. 烘，烤",
    example: "I love the smell of fresh bread baking.",
    category: "考研高频"
  },
  {
    word: "balance",
    phonetic: "['bæləns]",
    enDefinition: "A state where things are of equal weight or force.",
    zhDefinition: "v./n. 平衡；天平；差额",
    example: "It's important to maintain a healthy work-life balance.",
    category: "考研高频"
  },
  {
    word: "bald",
    phonetic: "[bɔːld]",
    enDefinition: "With little or no hair on the head.",
    zhDefinition: "adj. 秃顶的；单调的",
    example: "He started to go bald in his twenties.",
    category: "考研高频"
  },
  {
    word: "ballet",
    phonetic: "['bæleɪ]",
    enDefinition: "A type of dancing that tells a story with music but no words.",
    zhDefinition: "n. 芭蕾舞",
    example: "She has been studying ballet since she was five.",
    category: "考研高频"
  },
  {
    word: "balloon",
    phonetic: "[bə'luːn]",
    enDefinition: "A small coloured rubber bag that you fill with air or gas.",
    zhDefinition: "n. 气球",
    example: "The children were playing with colourful balloons.",
    category: "考研高频"
  },
  {
    word: "ban",
    phonetic: "[bæn]",
    enDefinition: "To forbid something, especially officially.",
    zhDefinition: "v./n. 禁止，禁令",
    example: "The government has banned smoking in public places.",
    category: "考研高频"
  },
  {
    word: "band",
    phonetic: "[bænd]",
    enDefinition: "A group of musicians who play together.",
    zhDefinition: "n. 乐队；带子；波段",
    example: "The band played all their hit songs.",
    category: "考研高频"
  },
  {
    word: "bandage",
    phonetic: "['bændɪdʒ]",
    enDefinition: "A long, narrow piece of cloth that is tied around an injury or a part of the body that has been hurt.",
    zhDefinition: "n. 绷带 v. 用绷带扎",
    example: "He had a bandage on his arm.",
    category: "考研高频"
  },
  {
    word: "bang",
    phonetic: "[beɪŋ]",
    enDefinition: "A sudden loud noise, as of an explosion.",
    zhDefinition: "n. 巨响；猛击 v. 猛撞",
    example: "The door slammed shut with a loud bang.",
    category: "考研高频"
  },
  {
    word: "bankrupt",
    phonetic: "['bæŋkrʌpt]",
    enDefinition: "Unable to pay what you owe, and having had your control of your financial matters taken away by a court of law.",
    zhDefinition: "adj. 破产的 v. 使破产",
    example: "The company went bankrupt last year.",
    category: "考研高频"
  },
  {
    word: "banner",
    phonetic: "['bænə(r)]",
    enDefinition: "A long piece of cloth with words or signs on it.",
    zhDefinition: "n. 旗帜，横幅",
    example: "A large banner was hanging across the street.",
    category: "考研高频"
  },
  {
    word: "bar",
    phonetic: "[bɑː(r)]",
    enDefinition: "A place where alcoholic drinks are sold and drunk.",
    zhDefinition: "n. 酒吧；条，块；障碍 v. 阻拦",
    example: "I'll meet you at the bar. / A bar of chocolate.",
    category: "考研高频"
  },
  {
    word: "barbecue",
    phonetic: "['bɑːbɪkjuː]",
    enDefinition: "A metal frame on which meat, fish, or vegetables are cooked outdoors over a fire.",
    zhDefinition: "n. 户外烧烤",
    example: "We're having a barbecue in the garden on Saturday.",
    category: "考研高频"
  },
  {
    word: "barber",
    phonetic: "['bɑːbə(r)]",
    enDefinition: "A person whose job is to cut men's hair and sometimes to shave them.",
    zhDefinition: "n. 理发师",
    example: "I need to go to the barber's.",
    category: "考研高频"
  },
  {
    word: "bare",
    phonetic: "[beə(r)]",
    enDefinition: "Without any clothes or not covered by anything.",
    zhDefinition: "adj. 裸露的；仅仅的",
    example: "He walked on the sand with bare feet.",
    category: "考研高频"
  },
  {
    word: "barely",
    phonetic: "['beəli]",
    enDefinition: "By the smallest amount; only just.",
    zhDefinition: "adv. 仅仅，几乎不",
    example: "I could barely see the road in the fog.",
    category: "考研高频"
  },
  {
    word: "bargain",
    phonetic: "['bɑːɡən]",
    enDefinition: "Something on sale at a lower price than its true value.",
    zhDefinition: "n. 特价商品；协议 v. 讨价还价",
    example: "This dress was a real bargain.",
    category: "考研高频"
  },
  {
    word: "bark",
    phonetic: "[bɑːk]",
    enDefinition: "The loud, short noise that a dog and some other animals make.",
    zhDefinition: "v./n. 狗吠；树皮",
    example: "The dog started to bark at the stranger.",
    category: "考研高频"
  },
  {
    word: "barrel",
    phonetic: "['bærəl]",
    enDefinition: "A large container, made of wood, metal, or plastic, with a flat top and bottom and curved sides.",
    zhDefinition: "n. 桶；枪管",
    example: "They drank a whole barrel of beer.",
    category: "考研高频"
  },
  {
    word: "barrier",
    phonetic: "['bæriə(r)]",
    enDefinition: "A long pole, fence, wall, or natural feature, such as a mountain or sea, that stops people or vehicles from going somewhere.",
    zhDefinition: "n. 屏障；障碍，隔阂",
    example: "Language can be a barrier to communication.",
    category: "考研高频"
  },
  {
    word: "base",
    phonetic: "[beɪs]",
    enDefinition: "The bottom part of an object, on which it rests, or the lowest part of something.",
    zhDefinition: "n. 基础；基地 v. 以…为基础",
    example: "The lamp has a heavy base.",
    category: "考研高频"
  },
  {
    word: "baseball",
    phonetic: "['beɪsbɔːl]",
    enDefinition: "A game played especially in North America by two teams of nine players, using a bat and ball.",
    zhDefinition: "n. 棒球",
    example: "Baseball is a very popular sport in the USA.",
    category: "考研高频"
  },
  {
    word: "basement",
    phonetic: "['beɪsmənt]",
    enDefinition: "A part of a building that is below the level of the ground.",
    zhDefinition: "n. 地下室",
    example: "The laundry room is in the basement.",
    category: "考研高频"
  },
  {
    word: "basic",
    phonetic: "['beɪsɪk]",
    enDefinition: "Simple and not complicated, so providing a base for other things.",
    zhDefinition: "adj. 基本的，基础的",
    example: "Food and shelter are basic human needs.",
    category: "考研高频"
  },
  {
    word: "basin",
    phonetic: "['beɪsn]",
    enDefinition: "An open, round container shaped like a bowl with sloping sides, used for holding food or liquid.",
    zhDefinition: "n. 盆，脸盆；盆地",
    example: "Please wash your hands in the basin.",
    category: "考研高频"
  },
  {
    word: "basis",
    phonetic: "['beɪsɪs]",
    enDefinition: "The most important facts, ideas, etc. from which something is developed.",
    zhDefinition: "n. 基础，根据；准则",
    example: "The book is the basis for a new movie.",
    category: "考研高频"
  },
  {
    word: "basket",
    phonetic: "['bɑːskɪt]",
    enDefinition: "A container for holding or carrying things, which is made from thin strips of material that are woven together.",
    zhDefinition: "n. 篮，筐",
    example: "She put the fruit in a wicker basket.",
    category: "考研高频"
  },
  {
    word: "basketball",
    phonetic: "['bɑːskɪtbɔːl]",
    enDefinition: "A game played by two teams of five players who each try to throw a ball through a net on a high metal ring.",
    zhDefinition: "n. 篮球",
    example: "He's the captain of the school basketball team.",
    category: "考研高频"
  },
  {
    word: "bat",
    phonetic: "[bæt]",
    enDefinition: "A specially shaped piece of wood used for hitting the ball in many games.",
    zhDefinition: "n. 球棒；蝙蝠",
    example: "He's very good with a baseball bat.",
    category: "考研高频"
  },
  {
    word: "batch",
    phonetic: "[bætʃ]",
    enDefinition: "A group of things that are dealt with at the same time or considered to be similar.",
    zhDefinition: "n. 一批，一束",
    example: "I've just baked a fresh batch of cookies.",
    category: "考研高频"
  },
  {
    word: "bathe",
    phonetic: "[beɪð]",
    enDefinition: "To wash someone in a container of water.",
    zhDefinition: "v. 洗澡；游泳",
    example: "I usually bathe before going to bed.",
    category: "考研高频"
  },
  {
    word: "bathroom",
    phonetic: "['bɑːθruːm]",
    enDefinition: "A room with a bath and/or shower and often a toilet.",
    zhDefinition: "n. 浴室，盥洗室",
    example: "Is there a mirror in the bathroom?",
    category: "考研高频"
  },
  {
    word: "battery",
    phonetic: "['bætəri]",
    enDefinition: "A device that produces electricity to provide power for radios, cars, etc.",
    zhDefinition: "n. 电池；一套",
    example: "My phone battery is nearly dead.",
    category: "考研高频"
  },
  {
    word: "battle",
    phonetic: "['bætl]",
    enDefinition: "A fight between armed forces.",
    zhDefinition: "n. 战斗，战役 v. 斗争",
    example: "The battle lasted for several days.",
    category: "考研高频"
  },
  {
    word: "bay",
    phonetic: "[beɪ]",
    enDefinition: "A part of the coast where the land curves in so that the sea is surrounded by land on three sides.",
    zhDefinition: "n. 海湾",
    example: "The hotel overlooks the bay.",
    category: "考研高频"
  },
  {
    word: "beach",
    phonetic: "[biːtʃ]",
    enDefinition: "An area of sand or small stones near the sea or another area of water.",
    zhDefinition: "n. 海滩，沙滩",
    example: "We spent the whole day on the beach.",
    category: "考研高频"
  },
  {
    word: "beam",
    phonetic: "[biːm]",
    enDefinition: "A line of light shining from something.",
    zhDefinition: "n. 束，光束；梁 v. 露齿而笑",
    example: "A laser beam can cut through steel.",
    category: "考研高频"
  },
  {
    word: "bean",
    phonetic: "[biːn]",
    enDefinition: "A seed of some climbing plants, used as food.",
    zhDefinition: "n. 豆，豆荚",
    example: "I'll have a coffee bean. / Green beans are very healthy.",
    category: "考研高频"
  },
  {
    word: "bear",
    phonetic: "[beə(r)]",
    enDefinition: "To carry something; to accept, tolerate, or endure something, especially something unpleasant.",
    zhDefinition: "v. 忍受；承担；生育 n. 熊",
    example: "I can't bear the noise. / She bore three children.",
    category: "考研高频"
  },
  {
    word: "beard",
    phonetic: "[bɪəd]",
    enDefinition: "The hair that some men allow to grow on the lower part of their face.",
    zhDefinition: "n. 胡须",
    example: "He has a thick black beard.",
    category: "考研高频"
  },
  {
    word: "bearing",
    phonetic: "['beərɪŋ]",
    enDefinition: "Someone's way of moving and behaving.",
    zhDefinition: "n. 举止；关系；方位",
    example: "She has a very dignified bearing.",
    category: "考研高频"
  },
  {
    word: "beast",
    phonetic: "[biːst]",
    enDefinition: "An animal, especially a large or wild one.",
    zhDefinition: "n. 野兽，兽",
    example: "The lion is known as the king of beasts.",
    category: "考研高频"
  },
  {
    word: "beat",
    phonetic: "[biːt]",
    enDefinition: "To defeat someone in a game, fight, or competition.",
    zhDefinition: "v. 打败；敲打；跳动 n. 节拍",
    example: "We beat them 3-0 in the final. / My heart beat fast.",
    category: "考研高频"
  },
  {
    word: "beautiful",
    phonetic: "['bjuːtɪfl]",
    enDefinition: "Very attractive.",
    zhDefinition: "adj. 美丽的，漂亮的",
    example: "It's a beautiful day.",
    category: "考研高频"
  },
  {
    word: "beauty",
    phonetic: "['bjuːti]",
    enDefinition: "The quality that people, places, or things have that makes them very attractive to look at.",
    zhDefinition: "n. 美，美丽；美人",
    example: "She has both beauty and brains.",
    category: "考研高频"
  },
  {
    word: "beckon",
    phonetic: "['bekən]",
    enDefinition: "To move your hand or head in a way that tells someone to come nearer.",
    zhDefinition: "v. 招手示意；引诱",
    example: "The waiter beckoned us to our table.",
    category: "考研高频"
  },
  {
    word: "become",
    phonetic: "[bɪ'kʌm]",
    enDefinition: "To start to be.",
    zhDefinition: "v. 变成，成为",
    example: "He wants to become a pilot.",
    category: "考研高频"
  },
  {
    word: "beef",
    phonetic: "[biːf]",
    enDefinition: "The meat from an adult cow, eaten as food.",
    zhDefinition: "n. 牛肉",
    example: "We had roast beef for dinner.",
    category: "考研高频"
  },
  {
    word: "beer",
    phonetic: "[bɪə(r)]",
    enDefinition: "An alcoholic drink made from grain and hops.",
    zhDefinition: "n. 啤酒",
    example: "Would you like a glass of beer?",
    category: "考研高频"
  },
  {
    word: "beg",
    phonetic: "[beɡ]",
    enDefinition: "To ask someone for food or money, because you do not have any.",
    zhDefinition: "v. 乞讨；请求，恳求",
    example: "He begged her for forgiveness.",
    category: "考研高频"
  },
  {
    word: "beggar",
    phonetic: "['beɡə(r)]",
    enDefinition: "A person, sometimes one with a disability, who lives by asking people for money or food.",
    zhDefinition: "n. 乞丐",
    example: "There was a beggar sitting on the street corner.",
    category: "考研高频"
  },
  {
    word: "begin",
    phonetic: "[bɪ'ɡɪn]",
    enDefinition: "To start to happen or exist.",
    zhDefinition: "v. 开始",
    example: "The movie begins at eight o'clock.",
    category: "考研高频"
  },
  {
    word: "beginning",
    phonetic: "[bɪ'ɡɪnɪŋ]",
    enDefinition: "The first part of something or the start of something.",
    zhDefinition: "n. 开始，开端；起源",
    example: "It was the beginning of a new era.",
    category: "考研高频"
  },
  {
    word: "behalf",
    phonetic: "[bɪ'hɑːf]",
    enDefinition: "On behalf of someone: representing someone else.",
    zhDefinition: "n. 利益；代表",
    example: "On behalf of the company, I'd like to thank you.",
    category: "考研高频"
  },
  {
    word: "behave",
    phonetic: "[bɪ'heɪv]",
    enDefinition: "To act in a particular way.",
    zhDefinition: "v. 表现；举止端正",
    example: "The children behaved very well today.",
    category: "考研高频"
  },
  {
    word: "behavior",
    phonetic: "[bɪ'heɪvjə(r)]",
    enDefinition: "The way that someone or something behaves in a particular situation.",
    zhDefinition: "n. 行为，举止",
    example: "His behavior was very strange.",
    category: "考研高频"
  },
  {
    word: "behind",
    phonetic: "[bɪ'haɪnd]",
    enDefinition: "At the back of someone or something.",
    zhDefinition: "prep./adv. 在…后面；落后于",
    example: "The sun disappeared behind the clouds.",
    category: "考研高频"
  },
  {
    word: "being",
    phonetic: "['biːɪŋ]",
    enDefinition: "A person or a creature.",
    zhDefinition: "n. 生物；人；存在",
    example: "A human being has complex emotions.",
    category: "考研高频"
  },
  {
    word: "belief",
    phonetic: "[bɪ'liːf]",
    enDefinition: "The feeling of being certain that something exists or is true.",
    zhDefinition: "n. 信任，信念；信仰",
    example: "It's my belief that we will succeed.",
    category: "考研高频"
  },
  {
    word: "believe",
    phonetic: "[bɪ'liːv]",
    enDefinition: "To think that something is true, correct, or real.",
    zhDefinition: "v. 相信，认为",
    example: "I believe everything he says.",
    category: "考研高频"
  },
  {
    word: "bell",
    phonetic: "[bel]",
    enDefinition: "A hollow metal object, shaped like a cup, that makes a ringing sound when hit.",
    zhDefinition: "n. 钟，铃",
    example: "The school bell rang.",
    category: "考研高频"
  },
  {
    word: "belly",
    phonetic: "['beli]",
    enDefinition: "The stomach or the front part of the body between the chest and the legs.",
    zhDefinition: "n. 肚子，腹部",
    example: "He has a big belly.",
    category: "考研高频"
  },
  {
    word: "belong",
    phonetic: "[bɪ'lɒŋ]",
    enDefinition: "To be in the right place or a member of a particular group.",
    zhDefinition: "v. 属于",
    example: "Does this book belong to you?",
    category: "考研高频"
  },
  {
    word: "beloved",
    phonetic: "[bɪ'lʌvɪd]",
    enDefinition: "Loved very much.",
    zhDefinition: "adj. 心爱的 n. 爱人",
    example: "He is mourning his beloved wife.",
    category: "考研高频"
  },
  {
    word: "below",
    phonetic: "[bɪ'ləʊ]",
    enDefinition: "In a lower position than someone or something else.",
    zhDefinition: "prep./adv. 在…下面",
    example: "The temperature is below zero.",
    category: "考研高频"
  },
  {
    word: "belt",
    phonetic: "[belt]",
    enDefinition: "A strip of leather or material worn around the waist to support clothes or for decoration.",
    zhDefinition: "n. 腰带；地带",
    example: "He tightened his belt.",
    category: "考研高频"
  },
  {
    word: "bench",
    phonetic: "[bentʃ]",
    enDefinition: "A long, usually wooden seat for two or more people.",
    zhDefinition: "n. 长凳；工作台",
    example: "We sat on a park bench.",
    category: "考研高频"
  },
  {
    word: "bend",
    phonetic: "[bend]",
    enDefinition: "To move your body or part of your body so that it is not straight.",
    zhDefinition: "v. 弯曲；屈服 n. 弯道",
    example: "Bend your knees when you lift heavy objects.",
    category: "考研高频"
  },
  {
    word: "beneath",
    phonetic: "[bɪ'niːθ]",
    enDefinition: "In or to a lower position than someone or something under surface of something.",
    zhDefinition: "prep./adv. 在…下面",
    example: "They found the treasure beneath the sand.",
    category: "考研高频"
  },
  {
    word: "beneficial",
    phonetic: "[ˌbenɪ'fɪʃl]",
    enDefinition: "Helpful, useful, or good.",
    zhDefinition: "adj. 有益的，有利的",
    example: "Regular exercise is beneficial to your health.",
    category: "考研高频"
  },
  {
    word: "benefit",
    phonetic: "['benɪfɪt]",
    enDefinition: "A helpful or good effect, or something intended to help.",
    zhDefinition: "n. 利益；津贴 v. 有益于",
    example: "The new system will benefit everyone.",
    category: "考研高频"
  },
  {
    word: "benevolent",
    phonetic: "[bə'nevələnt]",
    enDefinition: "Kind and helpful.",
    zhDefinition: "adj. 仁慈的，慈善的",
    example: "He was a benevolent old man.",
    category: "考研高频"
  },
  {
    word: "benign",
    phonetic: "[bɪ'naɪn]",
    enDefinition: "Pleasant and kind; not harmful or severe.",
    zhDefinition: "adj. 慈祥的；良性的",
    example: "His benign smile put me at ease.",
    category: "考研高频"
  }


];

module.exports = {
  wordList: wordList
};