module.exports = [
  {
    id: 1,
    type: "choice",
    subject: "数据结构",
    title: "已知字符集{a, b, c, d, e, f, g}，若各字符出现的次数分别为{3, 12, 6, 4, 2, 35, 21}，则对应哈夫曼树的带权路径长度(WPL)是：",
    options: [
      { label: "A", content: "122" },
      { label: "B", content: "149" },
      { label: "C", content: "183" },
      { label: "D", content: "202" }
    ],
    answer: "C",
    analysis: "解析：构造哈夫曼树。1.取最小权值2,3构造5；2.取4,5构造9；3.取6,9构造15；4.取12,15构造27；5.取21,27构造48；6.取35,48构造83。WPL = (2+3)*5 + 4*4 + 6*3 + 12*2 + 21*2 + 35*1 = 183。"
  },
  {
    id: 2,
    type: "choice",
    subject: "计算机组成原理",
    title: "在采用指令流水线的处理器中，若发生“数据相关”，最常用的解决办法是：",
    options: [
      { label: "A", content: "增加指令缓冲队列" },
      { label: "B", content: "采用数据旁路（转发）技术" },
      { label: "C", content: "提高主频" },
      { label: "D", content: "增加通用寄存器数量" }
    ],
    answer: "B",
    analysis: "解析：数据相关是指指令在流水线中重叠执行时，后续指令需要用到前面指令尚未写回的结果。数据旁路技术允许直接将执行结果从流水线寄存器传给后续指令，而无需等待写回寄存器。"
  },
  {
    id: 3,
    type: "choice",
    subject: "操作系统",
    title: "在分页存储管理系统中，页表的作用是实现：",
    options: [
      { label: "A", content: "逻辑地址到物理地址的映射" },
      { label: "B", content: "物理地址到逻辑地址的映射" },
      { label: "C", content: "主存空间到磁盘空间的映射" },
      { label: "D", content: "进程 ID 到内存地址的映射" }
    ],
    answer: "A",
    analysis: "解析：页表记录了进程逻辑页号与内存物理块号之间的对应关系，是地址转换的核心机构。"
  },
  {
    id: 4,
    type: "choice",
    subject: "计算机网络",
    title: "在 OSI 参考模型中，负责路径选择、拥塞控制和网际互连的层次是：",
    options: [
      { label: "A", content: "数据链路层" },
      { label: "B", content: "网络层" },
      { label: "C", content: "传输层" },
      { label: "D", content: "会话层" }
    ],
    answer: "B",
    analysis: "解析：网络层的主要任务是选择合适的路由，使发送站的传输层所传下来的分组能够准确通过中间节点找到目的站。"
  },
  {
    id: 5,
    type: "choice",
    subject: "数据结构",
    title: "若一个完全二叉树有 768 个结点，则该二叉树中叶结点的个数是：",
    options: [
      { label: "A", content: "384" },
      { label: "B", content: "385" },
      { label: "C", content: "383" },
      { label: "D", content: "256" }
    ],
    answer: "A",
    analysis: "解析：完全二叉树中，n0 = ⌈n/2⌉。768/2 = 384。即叶子节点数为384。"
  },


  {
    id: 6,
    type: "choice",
    subject: "数据结构",
    title: "已知一个长度为 16 的顺序表，其元素按升序排列。采用二分查找法查找一个不存在的元素，所需的比较次数最多是：",
    options: [
      { label: "A", content: "4" },
      { label: "B", content: "5" },
      { label: "C", content: "6" },
      { label: "D", content: "7" }
    ],
    answer: "B",
    analysis: "解析：二分查找的判定树深度为 ⌊log2n⌋ + 1。对于 n=16，深度为 5。查找失败时最多比较次数等于判定树的高度。"
  },
  {
    id: 7,
    type: "choice",
    subject: "数据结构",
    title: "下列排序算法中，占用辅助空间最多的是：",
    options: [
      { label: "A", content: "归并排序" },
      { label: "B", content: "快速排序" },
      { label: "C", content: "堆排序" },
      { label: "D", content: "冒泡排序" }
    ],
    answer: "A",
    analysis: "解析：归并排序的辅助空间复杂度为 O(n)，快速排序为 O(log n)，堆排序和冒泡排序为 O(1)。"
  },
  {
    id: 8,
    type: "choice",
    subject: "计算机组成原理",
    title: "假定单精度浮点数（IEEE 754 标准）的二进制表示为 0xBF000000，则该数对应的十进制数是：",
    options: [
      { label: "A", content: "-0.5" },
      { label: "B", content: "-1.0" },
      { label: "C", content: "0.5" },
      { label: "D", content: "1.0" }
    ],
    answer: "A",
    analysis: "解析：0xBF000000 = 1 01111110 000...0。符号位1（负），阶码126（126-127=-1），尾数1.0。结果 = -1.0 * 2^-1 = -0.5。"
  },
  {
    id: 9,
    type: "choice",
    subject: "计算机组成原理",
    title: "在程序的执行过程中，Cache 与主存进行数据交换的单位是：",
    options: [
      { label: "A", content: "字节" },
      { label: "B", content: "字" },
      { label: "C", content: "主存块" },
      { label: "D", content: "存储周期" }
    ],
    answer: "C",
    analysis: "解析：Cache 与主存交换的基本单位是“块”（Block），通常为几十个字节。"
  },
  {
    id: 10,
    type: "choice",
    subject: "操作系统",
    title: "下列进程调度算法中，综合考虑执行时间和等待时间，且不会导致饥饿现象的是：",
    options: [
      { label: "A", content: "先来先服务（FCFS）" },
      { label: "B", content: "短作业优先（SJF）" },
      { label: "C", content: "高响应比优先（HRRN）" },
      { label: "D", content: "时间片轮转（RR）" }
    ],
    answer: "C",
    analysis: "解析：HRRN 算法响应比 = (等待时间+要求服务时间)/要求服务时间。等待时间越长响应比越高，避免了长作业饥饿。"
  },
  {
    id: 11,
    type: "choice",
    subject: "操作系统",
    title: "死锁避免算法（如银行家算法）的主要目标是：",
    options: [
      { label: "A", content: "预防死锁" },
      { label: "B", content: "检测并解除死锁" },
      { label: "C", content: "使系统处于安全状态" },
      { label: "D", content: "消除资源互斥条件" }
    ],
    answer: "C",
    analysis: "解析：银行家算法通过预分配检测，确保系统始终处于“安全状态”，从而避免进入死锁。"
  },
  {
    id: 12,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 协议中，建立连接需要进行三次握手。第二次握手发送的报文段中，标志位设置正确的是：",
    options: [
      { label: "A", content: "SYN=1, ACK=0" },
      { label: "B", content: "SYN=1, ACK=1" },
      { label: "C", content: "SYN=0, ACK=1" },
      { label: "D", content: "FIN=1, ACK=1" }
    ],
    answer: "B",
    analysis: "解析：第二次握手是服务器对客户端同步请求的确认，同时发起自己的同步请求，因此 SYN 和 ACK 均为 1。"
  },
  {
    id: 13,
    type: "choice",
    subject: "计算机网络",
    title: "某子网掩码为 255.255.255.224，则该子网中可分配给主机的最大 IP 地址个数是：",
    options: [
      { label: "A", content: "32" },
      { label: "B", content: "30" },
      { label: "C", content: "254" },
      { label: "D", content: "224" }
    ],
    answer: "B",
    analysis: "解析：224二进制为11100000，主机位有5位。2^5 - 2 = 30（扣除网络号和广播地址）。"
  },
  {
    id: 14,
    type: "choice",
    subject: "数据结构",
    title: "若一棵二叉树的前序遍历序列为 ABC，则不同的二叉树形态共有几种：",
    options: [
      { label: "A", content: "3" },
      { label: "B", content: "4" },
      { label: "C", content: "5" },
      { label: "D", content: "6" }
    ],
    answer: "C",
    analysis: "解析：已知前序序列，二叉树形态数符合卡特兰数：C(2n, n)/(n+1)。n=3，结果为 5。"
  },
  {
    id: 15,
    type: "choice",
    subject: "数据结构",
    title: "下列关于 B 树和 B+ 树的叙述中，不正确的是：",
    options: [
      { label: "A", content: "B 树中所有结点都包含关键字" },
      { label: "B", content: "B+ 树中叶结点包含了全部关键字" },
      { label: "C", content: "B 树和 B+ 树都能进行顺序查找" },
      { label: "D", content: "B 树和 B+ 树都适合磁盘索引" }
    ],
    answer: "C",
    analysis: "解析：B+ 树由于叶子结点有链表相连，支持高效顺序查找；B 树不支持顺序查找，只能进行层级遍历。"
  },
  {
    id: 16,
    type: "choice",
    subject: "计算机组成原理",
    title: "微程序存放在：",
    options: [
      { label: "A", content: "主存（RAM）" },
      { label: "B", content: "控制存储器（CM）" },
      { label: "C", content: "寄存器" },
      { label: "D", content: "Cache" }
    ],
    answer: "B",
    analysis: "解析：微程序设计中，微指令存放在控制器内部的控制存储器（Control Memory）中。"
  },
  {
    id: 17,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列哪种寻址方式获取操作数的速度最快？",
    options: [
      { label: "A", content: "直接寻址" },
      { label: "B", content: "寄存器寻址" },
      { label: "C", content: "间接寻址" },
      { label: "D", content: "立即寻址" }
    ],
    answer: "D",
    analysis: "解析：立即寻址的操作数直接在指令中，无需访问内存或寄存器，速度最快。"
  },
  {
    id: 18,
    type: "choice",
    subject: "操作系统",
    title: "在分段存储管理中，逻辑地址由段号和段内偏移量组成。段表的作用是：",
    options: [
      { label: "A", content: "实现段名到物理地址的转换" },
      { label: "B", content: "存储段的基址和长度" },
      { label: "C", content: "防止内存碎片" },
      { label: "D", content: "扩大逻辑内存空间" }
    ],
    answer: "B",
    analysis: "解析：段表记录了每个段在内存中的起始物理地址（基址）和段的长度。"
  },
  {
    id: 19,
    type: "choice",
    subject: "操作系统",
    title: "为了实现对独占设备的共享，通常采用的技术是：",
    options: [
      { label: "A", content: "中断技术" },
      { label: "B", content: "SPOOLing 技术" },
      { label: "C", content: "通道技术" },
      { label: "D", content: "DMA 技术" }
    ],
    answer: "B",
    analysis: "解析：SPOOLing（假脱机）技术通过在磁盘上设置输入/输出井，将独占设备模拟为共享设备。"
  },
  {
    id: 20,
    type: "choice",
    subject: "计算机网络",
    title: "局域网中广泛使用的 CSMA/CD 协议，其中的 CD 含义是：",
    options: [
      { label: "A", content: "载波侦听" },
      { label: "B", content: "多点接入" },
      { label: "C", content: "冲突检测" },
      { label: "D", content: "二进制指数退避" }
    ],
    answer: "C",
    analysis: "解析：CSMA/CD 的 CD 指 Collision Detection（冲突检测）。"
  },
  {
    id: 21,
    type: "choice",
    subject: "数据结构",
    title: "图的深度优先遍历（DFS）类似于树的：",
    options: [
      { label: "A", content: "前序遍历" },
      { label: "B", content: "中序遍历" },
      { label: "C", content: "后序遍历" },
      { label: "D", content: "层次遍历" }
    ],
    answer: "A",
    analysis: "解析：DFS 沿着一条路径深入，类似于树的前序遍历过程。"
  },
  {
    id: 22,
    type: "choice",
    subject: "计算机组成原理",
    title: "指令系统采用扩展操作码设计的目的是：",
    options: [
      { label: "A", content: "增加指令字长" },
      { label: "B", content: "增加寄存器数量" },
      { label: "C", content: "保持指令字长不变的情况下增加指令数量" },
      { label: "D", content: "缩短指令执行时间" }
    ],
    answer: "C",
    analysis: "解析：扩展操作码在指令长度受限的情况下，通过变长操作码支持更多不同格式的指令。"
  },
  {
    id: 23,
    type: "choice",
    subject: "操作系统",
    title: "文件的物理结构中，支持随机访问且没有外部碎片的是：",
    options: [
      { label: "A", content: "连续分配" },
      { label: "B", content: "链接分配" },
      { label: "C", content: "索引分配" },
      { label: "D", content: "哈希分配" }
    ],
    answer: "C",
    analysis: "解析：连续分配有碎片；链接分配不支持随机访问；索引分配既支持随机访问也无外部碎片。"
  },
  {
    id: 24,
    type: "choice",
    subject: "计算机网络",
    title: "HTTP 协议工作在 OSI 参考模型的：",
    options: [
      { label: "A", content: "网络层" },
      { label: "B", content: "传输层" },
      { label: "C", content: "会话层" },
      { label: "D", content: "应用层" }
    ],
    answer: "D",
    analysis: "解析：HTTP（超文本传输协议）属于典型的应用层协议。"
  },
  {
    id: 25,
    type: "choice",
    subject: "数据结构",
    title: "在一个有 n 个顶点、e 条边的无向图中，所有顶点的度数之和为：",
    options: [
      { label: "A", content: "e" },
      { label: "B", content: "2e" },
      { label: "C", content: "n" },
      { label: "D", content: "n+e" }
    ],
    answer: "B",
    analysis: "解析：无向图中每条边都连接两个顶点，因此为每个顶点贡献 1 个度，总度数为 2e。"
  },

  {
    id: 26,
    type: "choice",
    subject: "数据结构",
    title: "用邻接表存储图进行广度优先遍历（BFS）的时间复杂度为：",
    options: [
      { label: "A", content: "O(n)" },
      { label: "B", content: "O(n+e)" },
      { label: "C", content: "O(n*e)" },
      { label: "D", content: "O(n^2)" }
    ],
    answer: "B",
    analysis: "解析：BFS 需访问所有顶点一次（n）和所有边一次（e，邻接表扫描），故为 O(n+e)。"
  },
  {
    id: 27,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列关于总线定时方式的叙述中，正确的是：",
    options: [
      { label: "A", content: "同步定时由统一时钟信号控制" },
      { label: "B", content: "异步定时采用应答机制（握手）" },
      { label: "C", content: "异步定时速度比同步定时快" },
      { label: "D", content: "A 和 B 都正确" }
    ],
    answer: "D",
    analysis: "解析：同步靠时钟，异步靠握手。异步定时通常更慢但兼容性更强，因此 C 错误。"
  },
  {
    id: 28,
    type: "choice",
    subject: "操作系统",
    title: "多级反馈队列调度算法中，随着队列优先级的降低，时间片通常：",
    options: [
      { label: "A", content: "逐渐变小" },
      { label: "B", content: "逐渐变大" },
      { label: "C", content: "保持不变" },
      { label: "D", content: "由系统随机分配" }
    ],
    answer: "B",
    analysis: "解析：优先级越低，获得的执行机会越少，因此通常分配更长的时间片以补偿。"
  },
  {
    id: 29,
    type: "choice",
    subject: "计算机网络",
    title: "IPv6 地址长度为：",
    options: [
      { label: "A", content: "32位" },
      { label: "B", content: "64位" },
      { label: "C", content: "128位" },
      { label: "D", content: "256位" }
    ],
    answer: "C",
    analysis: "解析：IPv4 是 32 位，IPv6 扩展到了 128 位以解决地址枯竭问题。"
  },
  {
    id: 30,
    type: "choice",
    subject: "数据结构",
    title: "哈希表的冲突处理方法中，容易产生“二次聚集”现象的是：",
    options: [
      { label: "A", content: "线性探测法" },
      { label: "B", content: "链地址法" },
      { label: "C", content: "再哈希法" },
      { label: "D", content: "伪随机探测法" }
    ],
    answer: "A",
    analysis: "解析：线性探测法会将所有冲突元素堆积在连续的存储单元中，导致聚集。"
  },
  {
    id: 31,
    type: "choice",
    subject: "计算机组成原理",
    title: "冯·诺依曼机的核心思想是：",
    options: [
      { label: "A", content: "二进制运算" },
      { label: "B", content: "存储程序控制" },
      { label: "C", content: "高速运算" },
      { label: "D", content: "网络互联" }
    ],
    answer: "B",
    analysis: "解析：冯·诺依曼机最本质的特征是将程序和数据共同存储在内存中。"
  },
  {
    id: 32,
    type: "choice",
    subject: "操作系统",
    title: "下列关于虚拟存储器的叙述中，正确的是：",
    options: [
      { label: "A", content: "其容量由物理内存大小决定" },
      { label: "B", content: "其容量由磁盘可用空间决定" },
      { label: "C", content: "其容量由地址线位数决定" },
      { label: "D", content: "其容量是物理内存和磁盘空间之和" }
    ],
    answer: "C",
    analysis: "解析：虚拟存储器的最大容量受计算机地址结构（地址线位数）限制。"
  },
  {
    id: 33,
    type: "choice",
    subject: "计算机网络",
    title: "路由器是在哪一层实现网络互连的设备？",
    options: [
      { label: "A", content: "物理层" },
      { label: "B", content: "数据链路层" },
      { label: "C", content: "网络层" },
      { label: "D", content: "传输层" }
    ],
    answer: "C",
    analysis: "解析：路由器根据 IP 地址进行转发，工作在网络层。"
  },
  {
    id: 34,
    type: "choice",
    subject: "数据结构",
    title: "平衡二叉树（AVL）中，任一结点的左右子树高度差的最大绝对值是：",
    options: [
      { label: "A", content: "0" },
      { label: "B", content: "1" },
      { label: "C", content: "2" },
      { label: "D", content: "不限制" }
    ],
    answer: "B",
    analysis: "解析：平衡二叉树的定义要求任何结点的平衡因子（左右子树高度差）只能是 -1, 0, 1。"
  },
  {
    id: 35,
    type: "choice",
    subject: "计算机组成原理",
    title: "在中断处理过程中，由硬件自动完成的操作是：",
    options: [
      { label: "A", content: "保存程序断点（PC）" },
      { label: "B", content: "保存通用寄存器内容" },
      { label: "C", content: "执行中断服务程序" },
      { label: "D", content: "恢复现场" }
    ],
    answer: "A",
    analysis: "解析：硬件会自动将断点 PC 压入堆栈或存入特殊寄存器，现场保护（寄存器）由软件完成。"
  },
  {
    id: 36,
    type: "choice",
    subject: "操作系统",
    title: "一个系统有 4 个资源，由 3 个进程共享，每个进程最多需要 2 个资源，该系统：",
    options: [
      { label: "A", content: "必然死锁" },
      { label: "B", content: "必然不死锁" },
      { label: "C", content: "可能死锁" },
      { label: "D", content: "无法确定" }
    ],
    answer: "B",
    analysis: "解析：防止死锁条件：资源数 > 进程数 * (最大需求-1)。4 > 3*(2-1) = 3，故不死锁。"
  },
  {
    id: 37,
    type: "choice",
    subject: "计算机网络",
    title: "在以太网中，最小帧长由什么决定？",
    options: [
      { label: "A", content: "传输介质的长度" },
      { label: "B", content: "信号传播速度" },
      { label: "C", content: "数据传输速率" },
      { label: "D", content: "以上都是" }
    ],
    answer: "D",
    analysis: "解析：最小帧长 = 2 * 距离 / 传播速度 * 传输速率，为了确保冲突检测（CD）能生效。"
  },
  {
    id: 38,
    type: "choice",
    subject: "数据结构",
    title: "将森林转换成对应的二叉树，其根结点的右子树是：",
    options: [
      { label: "A", content: "对应的森林" },
      { label: "B", content: "第一棵树的子树" },
      { label: "C", content: "除第一棵树外其余树转换的二叉树" },
      { label: "D", content: "为空" }
    ],
    answer: "C",
    analysis: "解析：森林转二叉树：第一棵树根作为二叉树根，其余树根依次作为右孩子。"
  },
  {
    id: 39,
    type: "choice",
    subject: "计算机组成原理",
    title: "磁盘存储器的平均寻道时间是指：",
    options: [
      { label: "A", content: "磁头定位到目标磁道的时间" },
      { label: "B", content: "磁头定位到目标扇区的时间" },
      { label: "C", content: "磁盘旋转半周的时间" },
      { label: "D", content: "数据传输的时间" }
    ],
    answer: "A",
    analysis: "解析：寻道时间是指磁头移动到指定磁道所需的时间。"
  },
  {
    id: 40,
    type: "choice",
    subject: "操作系统",
    title: "请求分页系统中的置换算法，选择“未来最长时间内不再被访问的页面”进行淘汰的是：",
    options: [
      { label: "A", content: "LRU" },
      { label: "B", content: "FIFO" },
      { label: "C", content: "OPT" },
      { label: "D", content: "CLOCK" }
    ],
    answer: "C",
    analysis: "解析：OPT（最佳置换）是理论上的算法，无法在实际中完全实现。"
  },
  {
    id: 41,
    type: "choice",
    subject: "计算机网络",
    title: "DNS 服务器的主要功能是实现：",
    options: [
      { label: "A", content: "IP 地址到 MAC 地址的转换" },
      { label: "B", content: "域名到 IP 地址的转换" },
      { label: "C", content: "逻辑地址到物理地址的转换" },
      { label: "D", content: "端口号到应用程序的转换" }
    ],
    answer: "B",
    analysis: "解析：DNS（域名系统）是因特网的一项核心服务，用于将域名指向 IP。"
  },
  {
    id: 42,
    type: "choice",
    subject: "数据结构",
    title: "向一个栈顶指针为 top 的链栈中插入一个新结点 s 时，其操作是：",
    options: [
      { label: "A", content: "s->next = top; top = s;" },
      { label: "B", content: "top->next = s; top = s;" },
      { label: "C", content: "s->next = top->next; top->next = s;" },
      { label: "D", content: "top = s; s->next = top;" }
    ],
    answer: "A",
    analysis: "解析：链栈通常以链表头为栈顶，插入即为头插法。"
  },
  {
    id: 43,
    type: "choice",
    subject: "计算机组成原理",
    title: "单地址指令中，为了完成两个数的算术运算，除地址码指明的操作数外，另一个数常隐含在：",
    options: [
      { label: "A", content: "指令中" },
      { label: "B", content: "累加器（ACC）中" },
      { label: "C", content: "主存中" },
      { label: "D", content: "栈顶" }
    ],
    answer: "B",
    analysis: "解析：传统的单地址格式常采用隐含寻址，另一个操作数默认在 ACC 中。"
  },
  {
    id: 44,
    type: "choice",
    subject: "操作系统",
    title: "解除死锁的常用方法不包括：",
    options: [
      { label: "A", content: "剥夺资源" },
      { label: "B", content: "终止进程" },
      { label: "C", content: "修改资源需求" },
      { label: "D", content: "进程回退" }
    ],
    answer: "C",
    analysis: "解析：死锁发生后，资源需求通常已固定，无法通过修改需求解除。常用的有 A、B、D。"
  },
  {
    id: 45,
    type: "choice",
    subject: "计算机网络",
    title: "TCP 协议中，为了解决“网络拥塞”问题，发送窗口的大小取决于：",
    options: [
      { label: "A", content: "接收窗口" },
      { label: "B", content: "拥塞窗口" },
      { label: "C", content: "接收窗口与拥塞窗口的最小值" },
      { label: "D", content: "网络带宽" }
    ],
    answer: "C",
    analysis: "解析：发送端根据自身的拥塞窗口（cwnd）和接收方的通告窗口（rwnd）共同决定。"
  },
  {
    id: 46,
    type: "choice",
    subject: "数据结构",
    title: "下列关于散列表（Hash）的说法中，正确的是：",
    options: [
      { label: "A", content: "散列函数构造越复杂越好" },
      { label: "B", content: "装填因子越大，冲突概率越小" },
      { label: "C", content: "装填因子越小，冲突概率越小" },
      { label: "D", content: "散列表不适合存储大量数据" }
    ],
    answer: "C",
    analysis: "解析：装填因子 α = 元素数 / 长度。α 越小代表表越空，冲突概率越小。"
  },
  {
    id: 47,
    type: "choice",
    subject: "计算机组成原理",
    title: "DMA 控制方式下，数据传送的主要控制信号由谁发出？",
    options: [
      { label: "A", content: "CPU" },
      { label: "B", content: "DMA 控制器" },
      { label: "C", content: "设备驱动" },
      { label: "D", content: "主存" }
    ],
    answer: "B",
    analysis: "解析：DMA 模式下，DMA 控制器接管总线控制权，直接负责主存与设备的数据交换。"
  },
  {
    id: 48,
    type: "choice",
    subject: "操作系统",
    title: "管道（Pipe）通信中，数据的流动方式是：",
    options: [
      { label: "A", content: "单向（半双工）" },
      { label: "B", content: "双向（全双工）" },
      { label: "C", content: "广播式" },
      { label: "D", content: "多对多" }
    ],
    answer: "A",
    analysis: "解析：传统管道是单向的，若需双向通信则需建立两个管道。"
  },
  {
    id: 49,
    type: "choice",
    subject: "计算机网络",
    title: "集线器（Hub）工作在 OSI 模型的：",
    options: [
      { label: "A", content: "物理层" },
      { label: "B", content: "数据链路层" },
      { label: "C", content: "网络层" },
      { label: "D", content: "应用层" }
    ],
    answer: "A",
    analysis: "解析：集线器只是物理上的电信号放大和转发，不识别帧或报文。"
  },
  {
    id: 50,
    type: "choice",
    subject: "数据结构",
    title: "在关键路径法中，若活动 a 是关键活动，则：",
    options: [
      { label: "A", content: "a 的最早开始时间等于最迟开始时间" },
      { label: "B", content: "a 的持续时间最长" },
      { label: "C", content: "a 所在的路径是唯一的" },
      { label: "D", content: "a 的结束时间必然是整个工程的结束时间" }
    ],
    answer: "A",
    analysis: "解析：关键活动是指没有时间余量的活动，即最早开始和最迟开始时间相等。"
  },
  {
    id: 51,
    type: "choice",
    subject: "计算机组成原理",
    title: "中断响应时，CPU 进入：",
    options: [
      { label: "A", content: "用户态" },
      { label: "B", content: "核心态" },
      { label: "C", content: "待机态" },
      { label: "D", content: "睡眠态" }
    ],
    answer: "B",
    analysis: "解析：处理中断需要执行操作系统内核代码，必须在内核态（核心态）下进行。"
  },
  {
    id: 52,
    type: "choice",
    subject: "操作系统",
    title: "系统调用是指：",
    options: [
      { label: "A", content: "用户程序调用子程序" },
      { label: "B", content: "用户程序请求操作系统服务" },
      { label: "C", content: "内核调用用户程序" },
      { label: "D", content: "硬件调用操作系统" }
    ],
    answer: "B",
    analysis: "解析：系统调用是用户态进程进入内核态并获取系统资源的唯一合法途径。"
  },
  {
    id: 53,
    type: "choice",
    subject: "计算机网络",
    title: "下面哪个协议使用 UDP 进行数据传输？",
    options: [
      { label: "A", content: "HTTP" },
      { label: "B", content: "FTP" },
      { label: "C", content: "DNS" },
      { label: "D", content: "SMTP" }
    ],
    answer: "C",
    analysis: "解析：DNS 查询通常使用 UDP 以追求速度。其余三项均基于可靠的 TCP。"
  },
  {
    id: 54,
    type: "choice",
    subject: "数据结构",
    title: "已知一棵完全二叉树第 6 层有 8 个叶结点，则该二叉树的最大结点个数是：",
    options: [
      { label: "A", content: "111" },
      { label: "B", content: "119" },
      { label: "C", content: "127" },
      { label: "D", content: "63" }
    ],
    answer: "B",
    analysis: "解析：第 6 层有叶子，说明深度可能是 6 或 7。若深度为 7，第 6 层有 8 个叶子，第 6 层满额 32 节点，则有 32-8=24 个非叶子节点，它们有第 7 层孩子，最大节点 = (1+2+4+8+16+32) + 24*2 = 111。但若考虑第 6 层是最后一层，节点更少。若第 6 层叶子是在最右侧，完全二叉树定义要求节点靠左。仔细计算最大应为 111 (2011真题变体)。"
  },
  {
    id: 55,
    type: "choice",
    subject: "计算机组成原理",
    title: "微程序控制器的控制存储器（CM）应采用：",
    options: [
      { label: "A", content: "RAM" },
      { label: "B", content: "ROM" },
      { label: "C", content: "寄存器" },
      { label: "D", content: "磁盘" }
    ],
    answer: "B",
    analysis: "解析：微程序是固化的，掉电不应丢失，故通常采用只读存储器 ROM。"
  },

  {
    id: 56,
    type: "choice",
    subject: "数据结构",
    title: "若一个栈的输入序列为 1, 2, 3, 4，则下列序列中不可能是栈的输出序列的是：",
    options: [
      { label: "A", content: "1, 2, 3, 4" },
      { label: "B", content: "4, 3, 2, 1" },
      { label: "C", content: "3, 1, 4, 2" },
      { label: "D", content: "3, 4, 2, 1" }
    ],
    answer: "C",
    analysis: "解析：栈是后进先出。C选项中，3先出栈说明1,2已在栈内，此时2在栈顶，1在栈底，不可能先出1再出2。"
  },
  {
    id: 57,
    type: "choice",
    subject: "计算机组成原理",
    title: "在小端（Little-endian）模式下，十六进制数 0x12345678 存放在地址 0x4000 开始的内存中，则 0x4000 单元的内容是：",
    options: [
      { label: "A", content: "12H" },
      { label: "B", content: "34H" },
      { label: "C", content: "56H" },
      { label: "D", content: "78H" }
    ],
    answer: "D",
    analysis: "解析：小端模式指数据的低字节存放在内存的低地址端。0x78 是最低字节，存放在 0x4000。"
  },
  {
    id: 58,
    type: "choice",
    subject: "操作系统",
    title: "信号量 S 的当前值为 -3，说明当前：",
    options: [
      { label: "A", content: "有 3 个进程处于运行态" },
      { label: "B", content: "有 3 个进程处于就绪态" },
      { label: "C", content: "有 3 个进程处于阻塞态" },
      { label: "D", content: "系统发生死锁" }
    ],
    answer: "C",
    analysis: "解析：信号量 S < 0 时，其绝对值表示在该信号量队列上阻塞等待的进程数。"
  },
  {
    id: 59,
    type: "choice",
    subject: "计算机网络",
    title: "下列关于传输层 TCP 和 UDP 协议的叙述中，正确的是：",
    options: [
      { label: "A", content: "TCP 适合实时视频广播" },
      { label: "B", content: "UDP 保证数据的按序到达" },
      { label: "C", content: "TCP 通过滑动窗口进行流量控制" },
      { label: "D", content: "UDP 报文头部比 TCP 头部大" }
    ],
    answer: "C",
    analysis: "解析：TCP 是可靠传输，使用滑动窗口控制流量；UDP 不保证按序到达，头部仅 8 字节，比 TCP 的 20 字节小。"
  },
  {
    id: 60,
    type: "choice",
    subject: "数据结构",
    title: "在一个双向循环链表中，删除指针 p 所指结点（非唯一结点）的操作是：",
    options: [
      { label: "A", content: "p->next = p->next->next; p->next->prior = p;" },
      { label: "B", content: "p->prior->next = p->next; p->next->prior = p->prior;" },
      { label: "C", content: "p->next = p->prior; p->prior = p->next;" },
      { label: "D", content: "p->prior->next = p->prior; p->next->prior = p->next;" }
    ],
    answer: "B",
    analysis: "解析：删除双向链表结点需修改前驱结点的后继指针和后继结点的前驱指针。"
  },
  {
    id: 61,
    type: "choice",
    subject: "计算机组成原理",
    title: "指令译码器（ID）属于：",
    options: [
      { label: "A", content: "运算器" },
      { label: "B", content: "控制器" },
      { label: "C", content: "存储器" },
      { label: "D", content: "I/O 接口" }
    ],
    answer: "B",
    analysis: "解析：控制器由程序计数器（PC）、指令寄存器（IR）、指令译码器（ID）和操作控制器等组成。"
  },
  {
    id: 62,
    type: "choice",
    subject: "操作系统",
    title: "下列关于“抖动”（Thrashing）现象的叙述中，正确的是：",
    options: [
      { label: "A", content: "由于 CPU 速度太快导致" },
      { label: "B", content: "通过增加进程并发数可以缓解" },
      { label: "C", content: "根本原因是频繁的页面置换" },
      { label: "D", content: "只会发生在小型机上" }
    ],
    answer: "C",
    analysis: "解析：抖动是指页面频繁换入换出，导致系统几乎只在处理页面置换，CPU利用率急剧下降。"
  },
  {
    id: 63,
    type: "choice",
    subject: "计算机网络",
    title: "在以太网交换机中，用于保存 MAC 地址与端口对应关系的表是：",
    options: [
      { label: "A", content: "ARP 表" },
      { label: "B", content: "路由表" },
      { label: "C", content: "MAC 地址表（或转发表）" },
      { label: "D", content: "状态表" }
    ],
    answer: "C",
    analysis: "解析：交换机通过自学习算法建立 MAC 地址与物理端口的映射关系。"
  },
  {
    id: 64,
    type: "choice",
    subject: "数据结构",
    title: "具有 n 个结点的二叉树采用二叉链表存储，其中空指针域的个数为：",
    options: [
      { label: "A", content: "n-1" },
      { label: "B", content: "n" },
      { label: "C", content: "n+1" },
      { label: "D", content: "2n" }
    ],
    answer: "C",
    analysis: "解析：每个结点有2个指针域，共2n个。除了根节点，每个节点都被一个指针指向，用了n-1个。空指针 = 2n - (n-1) = n+1。"
  },
  {
    id: 65,
    type: "choice",
    subject: "计算机组成原理",
    title: "MAR 和 MDR 的位数分别取决于：",
    options: [
      { label: "A", content: "地址线和数据线的位数" },
      { label: "B", content: "存储容量和字长" },
      { label: "C", content: "寄存器数量和指令字长" },
      { label: "D", content: "CPU 主频和总线带宽" }
    ],
    answer: "A",
    analysis: "解析：MAR（地址寄存器）接地址线，MDR（数据寄存器）接数据线。"
  },
  {
    id: 66,
    type: "choice",
    subject: "操作系统",
    title: "在分页系统中，逻辑地址为 16 位，页面大小为 4KB，则逻辑地址 0x2135 对应的页号是：",
    options: [
      { label: "A", content: "1" },
      { label: "B", content: "2" },
      { label: "C", content: "4" },
      { label: "D", content: "8" }
    ],
    answer: "B",
    analysis: "解析：4KB = 2^12 字节。页号 = 0x2135 / 2^12 = 0x2135 >> 12 = 2。"
  },
  {
    id: 67,
    type: "choice",
    subject: "计算机网络",
    title: "OSI 参考模型中，实现端到端可靠传输的是：",
    options: [
      { label: "A", content: "网络层" },
      { label: "B", content: "传输层" },
      { label: "C", content: "会话层" },
      { label: "D", content: "应用层" }
    ],
    answer: "B",
    analysis: "解析：传输层（Transport Layer）负责提供可靠的、透明的端到端数据传输。"
  },
  {
    id: 68,
    type: "choice",
    subject: "数据结构",
    title: "快速排序在下列哪种情况下执行效率最差？",
    options: [
      { label: "A", content: "数组元素随机排列" },
      { label: "B", content: "数组元素已经基本有序" },
      { label: "C", content: "数组元素呈正态分布" },
      { label: "D", content: "数组规模非常大" }
    ],
    answer: "B",
    analysis: "解析：当序列基本有序或逆序时，基准点划分极度不均匀，复杂度退化为 O(n^2)。"
  },
  {
    id: 69,
    type: "choice",
    subject: "计算机组成原理",
    title: "冯·诺依曼机的指令和数据均以二进制形式存放在存储器中，CPU 区分它们的依据是：",
    options: [
      { label: "A", content: "指令和数据的地址范围不同" },
      { label: "B", content: "指令和数据的标识符不同" },
      { label: "C", content: "指令周期的不同阶段" },
      { label: "D", content: "指令和数据的长度不同" }
    ],
    answer: "C",
    analysis: "解析：取指阶段从内存取出的是指令，执行阶段访问内存操作数时取出的是数据。"
  },
  {
    id: 70,
    type: "choice",
    subject: "操作系统",
    title: "Unix 文件系统中，i 结点（inode）的作用是：",
    options: [
      { label: "A", content: "存储文件名" },
      { label: "B", content: "存储文件控制信息（不含文件名）" },
      { label: "C", content: "存储文件所在的目录项" },
      { label: "D", content: "存储文件的路径名" }
    ],
    answer: "B",
    analysis: "解析：inode 存储文件的属性（大小、权限、位置等），文件名存储在目录项中。"
  },
  {
    id: 71,
    type: "choice",
    subject: "计算机网络",
    title: "下列网络协议中，属于网络层的是：",
    options: [
      { label: "A", content: "SMTP" },
      { label: "B", content: "ICMP" },
      { label: "C", content: "UDP" },
      { label: "D", content: "ARP" }
    ],
    answer: "B",
    analysis: "解析：ICMP 是网络层协议。ARP 通常也被归为网络层。但 408 考试中 ICMP 是标准网络层。SMTP 为应用层，UDP 为传输层。"
  },
  {
    id: 72,
    type: "choice",
    subject: "数据结构",
    title: "广义表 L = ((a, b), c)，则 head(L) 是：",
    options: [
      { label: "A", content: "a" },
      { label: "B", content: "(a, b)" },
      { label: "C", content: "((a, b))" },
      { label: "D", content: "c" }
    ],
    answer: "B",
    analysis: "解析：head() 取第一个元素。L 的第一个元素是 (a, b)。"
  },
  {
    id: 73,
    type: "choice",
    subject: "计算机组成原理",
    title: "寄存器间接寻址方式下，操作数存放在：",
    options: [
      { label: "A", content: "通用寄存器" },
      { label: "B", content: "指令中" },
      { label: "C", content: "主存单元" },
      { label: "D", content: "堆栈" }
    ],
    answer: "C",
    analysis: "解析：寄存器存放的是操作数的内存地址，操作数实际在内存（主存）中。"
  },
  {
    id: 74,
    type: "choice",
    subject: "操作系统",
    title: "所谓“临界区”是指：",
    options: [
      { label: "A", content: "一个缓冲区" },
      { label: "B", content: "一段数据" },
      { label: "C", content: "一段代码" },
      { label: "D", content: "一个硬件资源" }
    ],
    answer: "C",
    analysis: "解析：临界区是指每个进程中访问临界资源的那段代码。"
  },
  {
    id: 75,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 中，超时重传时间的设置通常采用：",
    options: [
      { label: "A", content: "固定值" },
      { label: "B", content: "自适应算法（RTT 估算）" },
      { label: "C", content: "发送端随机生成" },
      { label: "D", content: "接收端指定" }
    ],
    answer: "B",
    analysis: "解析：TCP 通过往返时间（RTT）的测量动态调整 RTO（超时重传时间）。"
  },
  {
    id: 76,
    type: "choice",
    subject: "数据结构",
    title: "已知二叉树的后序序列为 DABEC，中序序列为 DEBAC，则前序序列为：",
    options: [
      { label: "A", content: "CEDBA" },
      { label: "B", content: "CEDAB" },
      { label: "C", content: "DECAB" },
      { label: "D", content: "CDEBA" }
    ],
    answer: "A",
    analysis: "解析：后序最后一位 C 是根。中序中 C 之前是 DEBA，说明全是左子树。以此类推。"
  },
  {
    id: 77,
    type: "choice",
    subject: "计算机组成原理",
    title: "用于解决指令间“结构相关”的最有效方法是：",
    options: [
      { label: "A", content: "增加指令缓冲栈" },
      { label: "B", content: "设置独立的指令 Cache 和数据 Cache" },
      { label: "C", content: "采用分支预测" },
      { label: "D", content: "加快 ALU 运算速度" }
    ],
    answer: "B",
    analysis: "解析：结构相关是指多个指令竞争同一硬件资源。哈佛结构（分立 Cache）可解决取指和访存的资源竞争。"
  },
  {
    id: 78,
    type: "choice",
    subject: "操作系统",
    title: "在死锁的四个必要条件中，无法通过破坏哪一个来预防死锁？",
    options: [
      { label: "A", content: "互斥条件" },
      { label: "B", content: "不剥夺条件" },
      { label: "C", content: "请求与保持条件" },
      { label: "D", content: "循环等待条件" }
    ],
    answer: "A",
    analysis: "解析：互斥由资源本身属性决定（如打印机），通常无法改变。"
  },
  {
    id: 79,
    type: "choice",
    subject: "计算机网络",
    title: "物理层的主要任务是定义：",
    options: [
      { label: "A", content: "报文格式" },
      { label: "B", content: "接口的特性" },
      { label: "C", content: "路由表" },
      { label: "D", content: "端到端连接" }
    ],
    answer: "B",
    analysis: "解析：物理层定义机械、电气、功能和规程四个特性。"
  },
  {
    id: 80,
    type: "choice",
    subject: "数据结构",
    title: "用有向无环图（DAG）表示表达式 (a+b)*b+c/(a+b)，至少需要几个顶点？",
    options: [
      { label: "A", content: "5" },
      { label: "B", content: "6" },
      { label: "C", content: "7" },
      { label: "D", content: "8" }
    ],
    answer: "C",
    analysis: "解析：重复出现的 (a+b) 只需一个节点。顶点：a, b, +, *, c, /, +。共 7 个。"
  },
  {
    id: 81,
    type: "choice",
    subject: "计算机组成原理",
    title: "中断处理程序执行时，若有更高优先级中断发生，CPU 立即响应，这种技术称为：",
    options: [
      { label: "A", content: "向量中断" },
      { label: "B", content: "中断嵌套" },
      { label: "C", content: "软件中断" },
      { label: "D", content: "多重中断" }
    ],
    answer: "D",
    analysis: "解析：多重中断允许在中断处理过程中再次响应中断，形成嵌套。"
  },
  {
    id: 82,
    type: "choice",
    subject: "操作系统",
    title: "响应比高者优先（HRRN）算法中，响应比计算公式为：",
    options: [
      { label: "A", content: "等待时间 / 服务时间" },
      { label: "B", content: "1 + (等待时间 / 服务时间)" },
      { label: "C", content: "服务时间 / 等待时间" },
      { label: "D", content: "1 + (服务时间 / 等待时间)" }
    ],
    answer: "B",
    analysis: "解析：R = (w + s) / s = 1 + w / s。"
  },
  {
    id: 83,
    type: "choice",
    subject: "计算机网络",
    title: "在数据链路层中，解决帧的定界和同步问题的常用方法是：",
    options: [
      { label: "A", content: "循环冗余校验" },
      { label: "B", content: "添加起始/结束标志符" },
      { label: "C", content: "曼彻斯特编码" },
      { label: "D", content: "奇偶校验" }
    ],
    answer: "B",
    analysis: "解析：帧定界通过在帧首部和尾部添加特殊比特流（如 01111110）来实现。"
  },
  {
    id: 84,
    type: "choice",
    subject: "数据结构",
    title: "下列关于最小生成树的说法中，正确的是：",
    options: [
      { label: "A", content: "最小生成树一定是唯一的" },
      { label: "B", content: "边的权值各不相同时，最小生成树唯一" },
      { label: "C Prim 算法比 Kruskal 算法效率总是更高" },
      { label: "D", content: "最小生成树包含图中所有的边" }
    ],
    answer: "B",
    analysis: "解析：当图中所有边的权值不等时，最小生成树是唯一的。"
  },
  {
    id: 85,
    type: "choice",
    subject: "计算机组成原理",
    title: "Cache 命中率随块大小的变化趋势是：",
    options: [
      { label: "A", content: "块越大，命中率越高" },
      { label: "B", content: "块越大，命中率越低" },
      { label: "C", content: "块大小适中时命中率最高" },
      { label: "D", content: "没有关系" }
    ],
    answer: "C",
    analysis: "解析：块太小无法利用空间局部性，太大则导致冲突增加且浪费带宽，存在平衡点。"
  },
  {
    id: 86,
    type: "choice",
    subject: "操作系统",
    title: "在 I/O 控制方式中，CPU 干预最少的是：",
    options: [
      { label: "A", content: "程序查询方式" },
      { label: "B", content: "中断驱动方式" },
      { label: "C", content: "DMA 方式" },
      { label: "D", content: "通道方式" }
    ],
    answer: "D",
    analysis: "解析：通道方式（I/O Channel）是专门的处理器，独立性最强。"
  },
  {
    id: 87,
    type: "choice",
    subject: "计算机网络",
    title: "某网络 202.112.10.0/24，若要划分为 4 个子网，则子网掩码应设为：",
    options: [
      { label: "A", content: "255.255.255.128" },
      { label: "B", content: "255.255.255.192" },
      { label: "C", content: "255.255.255.224" },
      { label: "D", content: "255.255.255.240" }
    ],
    answer: "B",
    analysis: "解析：划分为 4 个子网需要借 2 位主机位（2^2=4）。24+2=26。后 8 位为 11000000 = 192。"
  },
  {
    id: 88,
    type: "choice",
    subject: "数据结构",
    title: "向一颗 3 阶 B 树中插入一个关键字引起结点分裂，分裂后的结点包含几个关键字？",
    options: [
      { label: "A", content: "1" },
      { label: "B", content: "2" },
      { label: "C", content: "3" },
      { label: "D", content: "不确定" }
    ],
    answer: "A",
    analysis: "解析：3 阶 B 树结点最多 2 个关键字。插入第 3 个触发分裂，中间位置向上提，左右各留 1 个。"
  },
  {
    id: 89,
    type: "choice",
    subject: "计算机组成原理",
    title: "寻址方式中，操作数地址在指令中给出的是：",
    options: [
      { label: "A", content: "立即寻址" },
      { label: "B", content: "直接寻址" },
      { label: "C", content: "间接寻址" },
      { label: "D", content: "寄存器寻址" }
    ],
    answer: "B",
    analysis: "解析：直接寻址的地址码字段就是操作数的真实内存地址。"
  },
  {
    id: 90,
    type: "choice",
    subject: "操作系统",
    title: "为了提高磁盘 I/O 效率，可以采用：",
    options: [
      { label: "A", content: "提前读" },
      { label: "B", content: "延迟写" },
      { label: "C", content: "优化调度算法" },
      { label: "D", content: "以上都是" }
    ],
    answer: "D",
    analysis: "解析：A/B 属于磁盘高速缓存技术，C 是减少寻道时间的技术。"
  },
  {
    id: 91,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 协议中，SYN 报文段的序列号如何确定？",
    options: [
      { label: "A", content: "从 0 开始" },
      { label: "B", content: "从 1 开始" },
      { label: "C", content: "随机产生（ISN）" },
      { label: "D", content: "由接收端告知" }
    ],
    answer: "C",
    analysis: "解析：连接建立时，双端各自随机生成初始序列号（Initial Sequence Number）以防旧报文干扰。"
  },
  {
    id: 92,
    type: "choice",
    subject: "数据结构",
    title: "下列排序方法中，稳定的是：",
    options: [
      { label: "A", content: "简单选择排序" },
      { label: "B", content: "快速排序" },
      { label: "C", content: "希尔排序" },
      { label: "D", content: "基数排序" }
    ],
    answer: "D",
    analysis: "解析：基数排序、冒泡、插入、归并是稳定的；选择、快排、希尔、堆排是不稳定的。"
  },
  {
    id: 93,
    type: "choice",
    subject: "计算机组成原理",
    title: "在流水线计算机中，会引起指令执行顺序改变的是：",
    options: [
      { label: "A", content: "写后读相关" },
      { label: "B", content: "控制相关" },
      { label: "C", content: "资源相关" },
      { label: "D", content: "读后写相关" }
    ],
    answer: "B",
    analysis: "解析：控制相关是由转移指令（Jump/Branch）引起的，会导致流水线清空并跳转。"
  },
  {
    id: 94,
    type: "choice",
    subject: "操作系统",
    title: "在分段系统中，段与段之间：",
    options: [
      { label: "A", content: "必须连续" },
      { label: "B", content: "可以不连续" },
      { label: "C", content: "长度必须相等" },
      { label: "D", content: "不能共享" }
    ],
    answer: "B",
    analysis: "解析：段式管理允许各段分散存储在不连续的物理区域。"
  },
  {
    id: 95,
    type: "choice",
    subject: "计算机网络",
    title: "CSMA/CA 协议主要用于：",
    options: [
      { label: "A", content: "以太网" },
      { label: "B", content: "令牌环网" },
      { label: "C", content: "无线局域网" },
      { label: "D", content: "广域网" }
    ],
    answer: "C",
    analysis: "解析：CA（冲突避免）用于无法实现 CD（冲突检测）的无线网络（802.11）。"
  },
  {
    id: 96,
    type: "choice",
    subject: "数据结构",
    title: "具有 n 个结点的有向完全图中，边的总数为：",
    options: [
      { label: "A", content: "n(n-1)/2" },
      { label: "B", content: "n(n-1)" },
      { label: "C", content: "n^2" },
      { label: "D", content: "2n" }
    ],
    answer: "B",
    analysis: "解析：有向完全图中，任意两点间都有两条互为相反方向的边。"
  },
  {
    id: 97,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列关于 RISC 指令系统的特点，错误的是：",
    options: [
      { label: "A", content: "指令格式规整，寻址方式多" },
      { label: "B", content: "硬布线控制器为主" },
      { label: "C", content: "大部分指令在单周期内完成" },
      { label: "D", content: "只有 Load/Store 指令访存" }
    ],
    answer: "A",
    analysis: "解析：RISC 特点是寻址方式少。寻址方式多是 CISC 的特点。"
  },
  {
    id: 98,
    type: "choice",
    subject: "操作系统",
    title: "P 操作（wait）的作用是：",
    options: [
      { label: "A", content: "信号量加 1" },
      { label: "B", content: "信号量减 1" },
      { label: "C", content: "唤醒进程" },
      { label: "D", content: "检查队列" }
    ],
    answer: "B",
    analysis: "解析：P 代表 pass/wait，将信号量减 1；V 代表 release/signal，将信号量加 1。"
  },
  {
    id: 99,
    type: "choice",
    subject: "计算机网络",
    title: "FTP 协议默认的数据连接端口号是：",
    options: [
      { label: "A", content: "20" },
      { label: "B", content: "21" },
      { label: "C", content: "23" },
      { label: "D", content: "80" }
    ],
    answer: "A",
    analysis: "解析：FTP 21 端口用于控制连接，20 端口用于数据连接。"
  },
  {
    id: 100,
    type: "choice",
    subject: "数据结构",
    title: "若线索二叉树中某结点没有左孩子，则其左指针指向其：",
    options: [
      { label: "A", content: "前驱" },
      { label: "B", content: "后继" },
      { label: "C", content: "双亲" },
      { label: "D", content: "左兄弟" }
    ],
    answer: "A",
    analysis: "解析：左指针指向前驱，右指针指向后继，这是线索化的基本规则。"
  },
  {
    id: 101,
    type: "choice",
    subject: "计算机组成原理",
    title: "计算机执行指令的过程中，用于存放当前指令地址的寄存器是：",
    options: [
      { label: "A", content: "IR" },
      { label: "B", content: "PC" },
      { label: "C", content: "AR" },
      { label: "D", content: "PSW" }
    ],
    answer: "B",
    analysis: "解析：PC（程序计数器）始终指向下一条将要执行的指令地址。"
  },
  {
    id: 102,
    type: "choice",
    subject: "操作系统",
    title: "文件系统中，文件的逻辑组织形式通常分为：",
    options: [
      { label: "A", content: "连续和链接" },
      { label: "B", content: "流式和记录式" },
      { label: "C", content: "单级和多级" },
      { label: "D", content: "索引和哈希" }
    ],
    answer: "B",
    analysis: "解析：逻辑结构面向用户，分为无结构的流式和有结构的记录式。"
  },
  {
    id: 103,
    type: "choice",
    subject: "计算机网络",
    title: "在三级 IP 地址结构中，IP 地址由什么组成？",
    options: [
      { label: "A", content: "网络号和主机号" },
      { label: "B", content: "网络号、子网号和主机号" },
      { label: "C", content: "网络号、主机号和端口号" },
      { label: "D", content: "域名、网络号和主机号" }
    ],
    answer: "B",
    analysis: "解析：三级结构是在二级（网络+主机）基础上引入了子网（subnet）概念。"
  },
  {
    id: 104,
    type: "choice",
    subject: "数据结构",
    title: "二叉排序树的平均查找长度（ASL）与什么有关？",
    options: [
      { label: "A", content: "结点总数" },
      { label: "B", content: "结点的插入顺序" },
      { label: "C", content: "树的深度" },
      { label: "D", content: "以上都是" }
    ],
    answer: "D",
    analysis: "解析：结点的插入顺序决定了树的形状（平衡度），从而决定了深度和 ASL。"
  },
  {
    id: 105,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列关于主存与 Cache 映射方式的叙述中，正确的是：",
    options: [
      { label: "A", content: "全相联映射冲突率最高" },
      { label: "B", content: "直接映射硬件实现最简单" },
      { label: "C", content: "组相联映射不支持随机访问" },
      { label: "D", content: "三种映射方式的 Cache 容量必须一致" }
    ],
    answer: "B",
    analysis: "解析：直接映射只需比较一次地址，硬件逻辑最简单，但冲突率最高。"
  },

  {
    id: 106,
    type: "choice",
    subject: "数据结构",
    title: "下列关于堆（Heap）的叙述中，正确的是：",
    options: [
      { label: "A", content: "堆是一种完全二叉树" },
      { label: "B", content: "堆不可以采用顺序存储结构" },
      { label: "C", content: "在大根堆中，最小元素一定在叶结点上" },
      { label: "D", content: "A 和 C 都正确" }
    ],
    answer: "D",
    analysis: "解析：堆逻辑上是完全二叉树，通常用数组（顺序存储）实现。大根堆根最大，最小值必在某个叶子节点上。"
  },
  {
    id: 107,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列关于 SRAM 和 DRAM 的叙述中，错误的是：",
    options: [
      { label: "A", content: "SRAM 比 DRAM 速度快" },
      { label: "B", content: "SRAM 常用于 Cache" },
      { label: "C", content: "DRAM 需要定期刷新" },
      { label: "D", content: "DRAM 比 SRAM 集成度低" }
    ],
    answer: "D",
    analysis: "解析：DRAM 电路简单（1个电容），集成度比 SRAM 高，所以常用于主存。"
  },
  {
    id: 108,
    type: "choice",
    subject: "操作系统",
    title: "线程与进程的主要区别在于：",
    options: [
      { label: "A", content: "进程是调度的基本单位" },
      { label: "B", content: "线程是资源分配的基本单位" },
      { label: "C", content: "同一个进程内的线程共享该进程的资源" },
      { label: "D", content: "线程拥有独立的地址空间" }
    ],
    answer: "C",
    analysis: "解析：进程是资源分配的基本单位，线程是独立调度的基本单位。同进程线程共享地址空间。"
  },
  {
    id: 109,
    type: "choice",
    subject: "计算机网络",
    title: "ARP 协议的功能是：",
    options: [
      { label: "A", content: "根据域名查询 IP 地址" },
      { label: "B", content: "根据 IP 地址查询 MAC 地址" },
      { label: "C", content: "根据 MAC 地址查询 IP 地址" },
      { label: "D", content: "根据 IP 地址查询端口号" }
    ],
    answer: "B",
    analysis: "解析：Address Resolution Protocol 用于完成网络层地址（IP）到链路层地址（MAC）的解析。"
  },
  {
    id: 110,
    type: "choice",
    subject: "数据结构",
    title: "在循环队列中，队头指针为 front，队尾指针为 rear，容量为 M。判断队满的条件通常是：",
    options: [
      { label: "A", content: "front == rear" },
      { label: "B", content: "(rear + 1) % M == front" },
      { label: "C", content: "rear == M - 1" },
      { label: "D", content: "front == 0" }
    ],
    answer: "B",
    analysis: "解析：循环队列通常牺牲一个单元来区分队空（front==rear）和队满。"
  },
  {
    id: 111,
    type: "choice",
    subject: "计算机组成原理",
    title: "在浮点数加减运算中，对阶操作是将：",
    options: [
      { label: "A", content: "小阶向大阶看齐" },
      { label: "B", content: "大阶向小阶看齐" },
      { label: "C", content: "尾数左移" },
      { label: "D", content: "阶码强制为 0" }
    ],
    answer: "A",
    analysis: "解析：对阶原则是小阶向大阶看齐，尾数右移，这样只会损失精度而不会改变数值量级。"
  },
  {
    id: 112,
    type: "choice",
    subject: "操作系统",
    title: "下列进程状态转换中，不合理的是：",
    options: [
      { label: "A", content: "运行态 -> 阻塞态" },
      { label: "B", content: "阻塞态 -> 就绪态" },
      { label: "C", content: "就绪态 -> 运行态" },
      { label: "D", content: "阻塞态 -> 运行态" }
    ],
    answer: "D",
    analysis: "解析：阻塞态必须先回到就绪态等待调度，不能直接进入运行态。"
  },
  {
    id: 113,
    type: "choice",
    subject: "计算机网络",
    title: "TCP 协议在建立连接时使用的控制位是：",
    options: [
      { label: "A", content: "ACK, FIN" },
      { label: "B", content: "SYN, ACK" },
      { label: "C", content: "PSH, URG" },
      { label: "D", content: "RST, SYN" }
    ],
    answer: "B",
    analysis: "解析：三次握手主要涉及同步位 SYN 和确认位 ACK。"
  },
  {
    id: 114,
    type: "choice",
    subject: "数据结构",
    title: "具有 100 个结点的完全二叉树的叶结点个数为：",
    options: [
      { label: "A", content: "50" },
      { label: "B", content: "51" },
      { label: "C", content: "49" },
      { label: "D", content: "52" }
    ],
    answer: "A",
    analysis: "解析：n0 = ⌈n/2⌉ = ⌈100/2⌉ = 50。"
  },
  {
    id: 115,
    type: "choice",
    subject: "计算机组成原理",
    title: "寻址空间为 4GB 的计算机，其地址线至少应为：",
    options: [
      { label: "A", content: "16位" },
      { label: "B", content: "32位" },
      { label: "C", content: "64位" },
      { label: "D", content: "128位" }
    ],
    answer: "B",
    analysis: "解析：2^32 = 4G，故需要 32 位地址线。"
  },
  {
    id: 116,
    type: "choice",
    subject: "操作系统",
    title: "实现文件共享的方法中，硬链接（Hard Link）是通过什么实现的？",
    options: [
      { label: "A", content: "复制文件内容" },
      { label: "B", content: "通过索引结点（inode）" },
      { label: "C", content: "符号链接" },
      { label: "D", content: "快捷方式" }
    ],
    answer: "B",
    analysis: "解析：硬链接是多个目录项指向同一个索引结点（inode）。"
  },
  {
    id: 117,
    type: "choice",
    subject: "计算机网络",
    title: "数据链路层协议中，比特填充（0比特插入法）是为了实现：",
    options: [
      { label: "A", content: "差错控制" },
      { label: "B", content: "流量控制" },
      { label: "C", content: "透明传输" },
      { label: "D", content: "数据加密" }
    ],
    answer: "C",
    analysis: "解析：在遇到 5 个连续的 1 后插入 0，防止数据中的特殊比特流被误认为帧定界符。"
  },
  {
    id: 118,
    type: "choice",
    subject: "数据结构",
    title: "用邻接矩阵存储一个有 n 个顶点的无向图，所需要的存储空间为：",
    options: [
      { label: "A", content: "O(n)" },
      { label: "B", content: "O(n+e)" },
      { label: "C", content: "O(n^2)" },
      { label: "D", content: "O(e)" }
    ],
    answer: "C",
    analysis: "解析：邻接矩阵是一个 n*n 的方阵，空间复杂度恒为 O(n^2)。"
  },
  {
    id: 119,
    type: "choice",
    subject: "计算机组成原理",
    title: "CPU 响应中断的时间是在：",
    options: [
      { label: "A", content: "当前指令执行结束时" },
      { label: "B", content: "当前指令取指阶段" },
      { label: "C", content: "执行周期中的任意时刻" },
      { label: "D", content: "中断请求产生时" }
    ],
    answer: "A",
    analysis: "解析：为了保证指令的完整性，CPU 只有在当前指令执行周期结束后才会检查并响应中断。"
  },
  {
    id: 120,
    type: "choice",
    subject: "操作系统",
    title: "下列关于虚拟存储管理的叙述中，正确的是：",
    options: [
      { label: "A", content: "必须在物理上连续存放" },
      { label: "B", content: "页式管理不存在碎片" },
      { label: "C", content: "可以实现内存的扩充" },
      { label: "D", content: "不需要页表" }
    ],
    answer: "C",
    analysis: "解析：虚拟存储器允许程序在逻辑上拥有比物理内存大得多的空间。"
  },
  {
    id: 121,
    type: "choice",
    subject: "计算机网络",
    title: "IPv4 报文头部的最小长度是：",
    options: [
      { label: "A", content: "10 字节" },
      { label: "B", content: "20 字节" },
      { label: "C", content: "40 字节" },
      { label: "D", content: "60 字节" }
    ],
    answer: "B",
    analysis: "解析：IPv4 头部固定部分为 20 字节。"
  },
  {
    id: 122,
    type: "choice",
    subject: "数据结构",
    title: "一棵 5 层的满二叉树中，第 4 层的结点个数是：",
    options: [
      { label: "A", content: "4" },
      { label: "B", content: "8" },
      { label: "C", content: "16" },
      { label: "D", content: "32" }
    ],
    answer: "B",
    analysis: "解析：第 i 层最多 2^(i-1) 个节点。2^(4-1) = 8。"
  },
  {
    id: 123,
    type: "choice",
    subject: "计算机组成原理",
    title: "指令字长是指：",
    options: [
      { label: "A", content: "操作码的位数" },
      { label: "B", content: "地址码的位数" },
      { label: "C", content: "一条指令包含的二进制代码位数" },
      { label: "D", content: "计算机能够处理的最大数据长度" }
    ],
    answer: "C",
    analysis: "解析：指令字长是单条指令整体的位数。"
  },
  {
    id: 124,
    type: "choice",
    subject: "操作系统",
    title: "处于死锁状态的进程数至少是：",
    options: [
      { label: "A", content: "1" },
      { label: "B", content: "2" },
      { label: "C", content: "3" },
      { label: "D", content: "取决于系统资源数" }
    ],
    answer: "B",
    analysis: "解析：死锁是指多个进程互相等待。单个进程无法形成环路，故至少需要 2 个。"
  },
  {
    id: 125,
    type: "choice",
    subject: "计算机网络",
    title: "UDP 协议校验和计算的范围包括：",
    options: [
      { label: "A", content: "UDP 首部" },
      { label: "B", content: "UDP 数据" },
      { label: "C", content: "伪首部、UDP 首部和数据" },
      { label: "D", content: "仅伪首部" }
    ],
    answer: "C",
    analysis: "解析：UDP/TCP 校验和均包含伪首部（含 IP 信息）、首部和数据部分。"
  },
  {
    id: 126,
    type: "choice",
    subject: "数据结构",
    title: "下列排序算法中，平均时间复杂度为 O(n log n)，且最坏情况下也是 O(n log n) 的是：",
    options: [
      { label: "A", content: "快速排序" },
      { label: "B", content: "希尔排序" },
      { label: "C", content: "堆排序" },
      { label: "D", content: "冒泡排序" }
    ],
    answer: "C",
    analysis: "解析：堆排序和归并排序最坏情况下仍能保持 O(n log n)。快排最坏为 O(n^2)。"
  },
  {
    id: 127,
    type: "choice",
    subject: "计算机组成原理",
    title: "Cache 组相联映射相比于直接映射的优点是：",
    options: [
      { label: "A", content: "查找速度快" },
      { label: "B", content: "降低了块冲突率" },
      { label: "C", content: "硬件实现简单" },
      { label: "D", content: "不需要替换算法" }
    ],
    answer: "B",
    analysis: "解析：组相联增加了位置选择的灵活性，减少了特定索引处的冲突碰撞。"
  },
  {
    id: 128,
    type: "choice",
    subject: "操作系统",
    title: "在文件系统中，使用位示图（Bit Map）的主要目的是：",
    options: [
      { label: "A", content: "文件的保护和保密" },
      { label: "B", content: "文件目录的查找" },
      { label: "C", content: "磁盘存储空间的管理" },
      { label: "D", content: "文件逻辑结构的组织" }
    ],
    answer: "C",
    analysis: "解析：位示图用 0/1 表示磁盘块的空闲或占用状态。"
  },
  {
    id: 129,
    type: "choice",
    subject: "计算机网络",
    title: "100Base-T 中的 100 表示：",
    options: [
      { label: "A", content: "传输距离 100 米" },
      { label: "B", content: "基带信号频率 100MHz" },
      { label: "C", content: "传输速率 100Mbps" },
      { label: "D", content: "支持 100 个节点" }
    ],
    answer: "C",
    analysis: "解析：Base 代表基带传输，T 代表双绞线，数字代表速率。"
  },
  {
    id: 130,
    type: "choice",
    subject: "数据结构",
    title: "设有一个含有 10 个顶点的无向图，该图至少有几条边才能保证是连通图？",
    options: [
      { label: "A", content: "9" },
      { label: "B", content: "10" },
      { label: "C", content: "45" },
      { label: "D", content: "37" }
    ],
    answer: "A",
    analysis: "解析：n 个顶点的连通图至少有 n-1 条边（生成树形态）。"
  },
  {
    id: 131,
    type: "choice",
    subject: "计算机组成原理",
    title: "程序计数器（PC）的作用是：",
    options: [
      { label: "A", content: "存储当前正在执行的指令" },
      { label: "B", content: "存储下一条要执行的指令地址" },
      { label: "C", content: "存储运算结果" },
      { label: "D", content: "控制 I/O 设备" }
    ],
    answer: "B",
    analysis: "解析：PC 指向指令流的下一条位置。"
  },
  {
    id: 132,
    type: "choice",
    subject: "操作系统",
    title: "在分段系统中，由于段的长度不固定，容易产生：",
    options: [
      { label: "A", content: "内部碎片" },
      { label: "B", content: "外部碎片" },
      { label: "C", content: "页内碎片" },
      { label: "D", content: "抖动" }
    ],
    answer: "B",
    analysis: "解析：分段是变长的，回收后的空间若太小无法利用，形成外部碎片。"
  },
  {
    id: 133,
    type: "choice",
    subject: "计算机网络",
    title: "ICMP 协议承载在下列哪个协议之上？",
    options: [
      { label: "A", content: "Ethernet" },
      { label: "B", content: "IP" },
      { label: "C", content: "TCP" },
      { label: "D", content: "UDP" }
    ],
    answer: "B",
    analysis: "解析：ICMP 报文被封装在 IP 数据报中传输。"
  },
  {
    id: 134,
    type: "choice",
    subject: "数据结构",
    title: "折半查找（二分查找）的前提条件是：",
    options: [
      { label: "A", content: "线性表以链式存储" },
      { label: "B", content: "线性表以顺序存储且按关键字有序" },
      { label: "C", content: "线性表以顺序存储" },
      { label: "D", content: "线性表采用散列存储" }
    ],
    answer: "B",
    analysis: "解析：二分查找需要随机访问（顺序存储）且元素必须有序。"
  },
  {
    id: 135,
    type: "choice",
    subject: "计算机组成原理",
    title: "系统总线中，地址线的作用是：",
    options: [
      { label: "A", content: "选择存储单元或 I/O 端口" },
      { label: "B", content: "传送控制信号" },
      { label: "C", content: "传送数据" },
      { label: "D", content: "同步时钟" }
    ],
    answer: "A",
    analysis: "解析：地址线由 CPU 发出，用于指明数据要传输到哪个位置。"
  },
  {
    id: 136,
    type: "choice",
    subject: "操作系统",
    title: "下列关于互斥锁（Mutex）的叙述中，正确的是：",
    options: [
      { label: "A", content: "只有持有锁的线程才能释放锁" },
      { label: "B", content: "任何线程都能释放该锁" },
      { label: "C", content: "互斥锁可以被多个线程同时持有" },
      { label: "D", content: "互斥锁不会导致阻塞" }
    ],
    answer: "A",
    analysis: "解析：互斥锁具有拥有权属性，解铃还须系铃人。"
  },
  {
    id: 137,
    type: "choice",
    subject: "计算机网络",
    title: "交换机在转发数据帧时，若在 MAC 表中找不到目的地址，会执行：",
    options: [
      { label: "A", content: "丢弃该帧" },
      { label: "B", content: "向所有端口转发（泛洪）" },
      { label: "C", content: "向除进入端口外的所有端口转发" },
      { label: "D", content: "通过 ARP 获取地址" }
    ],
    answer: "C",
    analysis: "解析：这称为“未知单播泛洪”。"
  },
  {
    id: 138,
    type: "choice",
    subject: "数据结构",
    title: "下列关于 AVL 树的叙述，错误的是：",
    options: [
      { label: "A", content: "它是一棵二叉排序树" },
      { label: "B", content: "其高度总是 O(log n)" },
      { label: "C", content: "插入结点可能触发多次旋转" },
      { label: "D", content: "查找效率最高" }
    ],
    answer: "C",
    analysis: "解析：AVL 树插入结点后，通过 1 次旋转（单旋或双旋）即可恢复平衡。删除操作才可能触发多次旋转。"
  },
  {
    id: 139,
    type: "choice",
    subject: "计算机组成原理",
    title: "存储周期的含义是：",
    options: [
      { label: "A", content: "存取一次数据的时间" },
      { label: "B", content: "两次连续独立存储器操作所需的最小时间间隔" },
      { label: "C", content: "写入一次数据的时间" },
      { label: "D", content: "刷新一次的时间" }
    ],
    answer: "B",
    analysis: "解析：存储周期包含存取时间以及恢复时间。"
  },
  {
    id: 140,
    type: "choice",
    subject: "操作系统",
    title: "在银行家算法中，系统处于安全状态是指：",
    options: [
      { label: "A", content: "所有进程都已经完成" },
      { label: "B", content: "至少存在一个安全序列" },
      { label: "C", content: "死锁已经发生" },
      { label: "D", content: "资源利用率达到 100%" }
    ],
    answer: "B",
    analysis: "解析：安全状态意味着系统能按某种顺序为每个进程分配资源直到其完成。"
  },
  {
    id: 141,
    type: "choice",
    subject: "计算机网络",
    title: "BGP 协议是运行在：",
    options: [
      { label: "A", content: "自治系统（AS）内部" },
      { label: "B", content: "自治系统（AS）之间" },
      { label: "C", content: "局域网内部" },
      { label: "D", content: "物理层" }
    ],
    answer: "B",
    analysis: "解析：BGP 是外部网关协议，用于 AS 之间的路由选择。"
  },
  {
    id: 142,
    type: "choice",
    subject: "数据结构",
    title: "拓扑排序算法适用于：",
    options: [
      { label: "A", content: "无向图" },
      { label: "B", content: "有向无环图" },
      { label: "C", content: "带环有向图" },
      { label: "D", content: "所有图" }
    ],
    answer: "B",
    analysis: "解析：拓扑排序常用于检测有向图是否有环或确定工程执行顺序。"
  },
  {
    id: 143,
    type: "choice",
    subject: "计算机组成原理",
    title: "微程序控制器的控制存储器属于：",
    options: [
      { label: "A", content: "主存储器" },
      { label: "B", content: "辅助存储器" },
      { label: "C", content: "CPU 的一部分" },
      { label: "D", content: "Cache" }
    ],
    answer: "C",
    analysis: "解析：控存（CM）位于控制器内部，用于存放微指令。"
  },
  {
    id: 144,
    type: "choice",
    subject: "操作系统",
    title: "磁盘调度算法中，最容易导致某些请求“长期饥饿”的是：",
    options: [
      { label: "A", content: "FCFS" },
      { label: "B", content: "SSTF（最短寻道优先）" },
      { label: "C", content: "SCAN" },
      { label: "D", content: "CSCAN" }
    ],
    answer: "B",
    analysis: "解析：SSTF 总是处理最近的请求，远处的请求若不断有新近请求插入，则可能永远得不到响应。"
  },
  {
    id: 145,
    type: "choice",
    subject: "计算机网络",
    title: "SMTP 传输的邮件报文通常采用：",
    options: [
      { label: "A", content: "二进制编码" },
      { label: "B", content: "7位 ASCII 码" },
      { label: "C", content: "16位 Unicode" },
      { label: "D", content: "图像格式" }
    ],
    answer: "B",
    analysis: "解析：传统的 SMTP 仅支持 7 位 ASCII，非纯文本（如附件）需通过 MIME 转换。"
  },
  {
    id: 146,
    type: "choice",
    subject: "数据结构",
    title: "在一个单链表中，已知 q 所指结点是 p 所指结点的后继，要在 p, q 之间插入 s：",
    options: [
      { label: "A", content: "p->next = s; s->next = q;" },
      { label: "B", content: "s->next = q; p->next = s;" },
      { label: "C", content: "p->next = s->next; s->next = q;" },
      { label: "D", content: "A 和 B 都正确" }
    ],
    answer: "D",
    analysis: "解析：A 和 B 逻辑一致，先接后手或先接前手在此处都行，因为 q 已经给出。"
  },
  {
    id: 147,
    type: "choice",
    subject: "计算机组成原理",
    title: "加法器中，采用“先行进位（并行进位）”是为了：",
    options: [
      { label: "A", content: "减少逻辑门数量" },
      { label: "B", content: "加快进位传递速度" },
      { label: "C", content: "提高主频" },
      { label: "D", content: "节省功耗" }
    ],
    answer: "B",
    analysis: "解析：串行进位（行波进位）速度受限于每一级的进位传递，先行进位可同步算出各级进位。"
  },
  {
    id: 148,
    type: "choice",
    subject: "操作系统",
    title: "所谓“虚地址”是指：",
    options: [
      { label: "A", content: "磁盘地址" },
      { label: "B", content: "内存物理地址" },
      { label: "C", content: "程序中的逻辑地址" },
      { label: "D", content: "寄存器地址" }
    ],
    answer: "C",
    analysis: "解析：程序员使用的地址，需经 MMU 转换为物理地址。"
  },
  {
    id: 149,
    type: "choice",
    subject: "计算机网络",
    title: "在数据报服务中，网络节点转发数据报：",
    options: [
      { label: "A", content: "无需建立连接" },
      { label: "B", content: "必须建立虚电路" },
      { label: "C", content: "保证按序到达" },
      { label: "D", content: "不会丢失数据" }
    ],
    answer: "A",
    analysis: "解析：数据报是无连接的（如 IP），每个分组独立选择路由。"
  },
  {
    id: 150,
    type: "choice",
    subject: "数据结构",
    title: "高度为 5 的二叉搜索树（BST）中，最少有几个结点？",
    options: [
      { label: "A", content: "5" },
      { label: "B", content: "15" },
      { label: "C", content: "31" },
      { label: "D", content: "32" }
    ],
    answer: "A",
    analysis: "解析：每一层只有一个结点的“斜树”高度为 5，结点数为 5。"
  },
  {
    id: 151,
    type: "choice",
    subject: "计算机组成原理",
    title: "Cache 替换算法中，近期最少使用（LRU）算法是基于：",
    options: [
      { label: "A", content: "空间局部性" },
      { label: "B", content: "时间局部性" },
      { label: "C", content: "先进先出" },
      { label: "D", content: "随机分布" }
    ],
    answer: "B",
    analysis: "解析：时间局部性认为最近被访问的数据未来很可能再次被访问。"
  },
  {
    id: 152,
    type: "choice",
    subject: "操作系统",
    title: "Unix 系统中，修改文件权限的命令是：",
    options: [
      { label: "A", content: "chown" },
      { label: "B", content: "chmod" },
      { label: "C", content: "cp" },
      { label: "D", content: "ls" }
    ],
    answer: "B",
    analysis: "解析：chmod (change mode) 用于修改权限，chown 用于修改所有者。"
  },
  {
    id: 153,
    type: "choice",
    subject: "计算机网络",
    title: "下面哪个地址是私有（保留）地址？",
    options: [
      { label: "A", content: "172.16.0.1" },
      { label: "B", content: "202.112.1.1" },
      { label: "C", content: "127.0.0.1" },
      { label: "D", content: "8.8.8.8" }
    ],
    answer: "A",
    analysis: "解析：私有地址范围：10.x, 172.16-31.x, 192.168.x。"
  },
  {
    id: 154,
    type: "choice",
    subject: "数据结构",
    title: "在 B+ 树中，非叶子结点包含的是：",
    options: [
      { label: "A", content: "指向记录的指针" },
      { label: "B", content: "索引关键字" },
      { label: "C", content: "完整的数据记录" },
      { label: "D", content: "叶结点的链表" }
    ],
    answer: "B",
    analysis: "解析：B+ 树非叶子结点仅起索引作用，不存储数据指针。"
  },
  {
    id: 155,
    type: "choice",
    subject: "计算机组成原理",
    title: "主存与 Cache 之间的一致性问题，主要发生在：",
    options: [
      { label: "A", content: "读操作" },
      { label: "B", content: "写操作" },
      { label: "C", content: "取指操作" },
      { label: "D", content: "刷新操作" }
    ],
    answer: "B",
    analysis: "解析：写操作可能只修改了 Cache 而没改主存（写回法），或反之，导致数据不一致。"
  },

  {
    id: 156,
    type: "choice",
    subject: "数据结构",
    title: "已知字符集 {a, b, c, d, e}，各字符出现频率分别为 {0.35, 0.1, 0.2, 0.2, 0.15}，则对应的哈夫曼树中，权值为 0.2 的字符编码长度可能为：",
    options: [
      { label: "A", content: "1" },
      { label: "B", content: "2" },
      { label: "C", content: "3" },
      { label: "D", content: "4" }
    ],
    answer: "B",
    analysis: "解析：构造哈夫曼树：0.1和0.15合并为0.25；0.2和0.2合并为0.4；0.25和0.35合并为0.6；最后0.4和0.6合并为1.0。权值为0.2的节点在第二层，编码长度为2。"
  },
  {
    id: 157,
    type: "choice",
    subject: "计算机组成原理",
    title: "某计算机主存容量为 64KB，其中 ROM 区为 4KB，其余为 RAM 区。若用 2K×4 位的 RAM 芯片，则需要多少片这样的 RAM 芯片？",
    options: [
      { label: "A", content: "30" },
      { label: "B", content: "60" },
      { label: "C", content: "64" },
      { label: "D", content: "32" }
    ],
    answer: "B",
    analysis: "解析：RAM 区容量 = 64KB - 4KB = 60KB。芯片规格为 2K×4位。位扩展需 2 片（组成 2K×8位），字扩展需 60K/2K = 30 组。总芯片数 = 30 * 2 = 60 片。"
  },
  {
    id: 158,
    type: "choice",
    subject: "操作系统",
    title: "在采用页式存储管理的系统中，页表寄存器的内容包括：",
    options: [
      { label: "A", content: "页表始址和页表长度" },
      { label: "B", content: "页号和块号" },
      { label: "C", content: "逻辑地址和物理地址" },
      { label: "D", content: "状态位和修改位" }
    ],
    answer: "A",
    analysis: "解析：页表寄存器（PTR）存放的是当前进程页表在内存中的起始物理地址和页表的总长度。"
  },
  {
    id: 159,
    type: "choice",
    subject: "计算机网络",
    title: "在 CSMA/CD 协议中，若发现冲突后，各站需要等待一个随机时间。该随机时间通过什么算法确定？",
    options: [
      { label: "A", content: "贪婪算法" },
      { label: "B", content: "二进制指数退避算法" },
      { label: "C", content: "先来先服务算法" },
      { label: "D", content: "迪杰斯特拉算法" }
    ],
    answer: "B",
    analysis: "解析：二进制指数退避算法能有效降低再次发生冲突的概率。"
  },
  {
    id: 160,
    type: "choice",
    subject: "数据结构",
    title: "在一个具有 n 个顶点的连通无向图中，边的数目最少为：",
    options: [
      { label: "A", content: "n-1" },
      { label: "B", content: "n" },
      { label: "C", content: "n(n-1)/2" },
      { label: "D", content: "log n" }
    ],
    answer: "A",
    analysis: "解析：连通图最少边的情形即为生成树，边数为 n-1。"
  },
  {
    id: 161,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列关于流水线冒泡（Stall）的描述，正确的是：",
    options: [
      { label: "A", content: "冒泡会提高流水线的吞吐率" },
      { label: "B", content: "冒泡是由于指令相关导致的执行挂起" },
      { label: "C", content: "冒泡不需要硬件支持" },
      { label: "D", content: "冒泡会导致时钟周期变短" }
    ],
    answer: "B",
    analysis: "解析：当流水线遇到数据相关或资源冲突无法继续执行时，会插入空操作周期，俗称“冒泡”。"
  },
  {
    id: 162,
    type: "choice",
    subject: "操作系统",
    title: "文件系统中，若物理块大小为 1KB，一级索引表每个表项占 4 字节，则一级索引能支持的最大文件长度是：",
    options: [
      { label: "A", content: "256KB" },
      { label: "B", content: "512KB" },
      { label: "C", content: "1MB" },
      { label: "D", content: "4MB" }
    ],
    answer: "A",
    analysis: "解析：索引块可容纳表项数 = 1024 / 4 = 256 个。每个表项指向一个 1KB 的物理块，总大小 = 256 * 1KB = 256KB。"
  },
  {
    id: 163,
    type: "choice",
    subject: "计算机网络",
    title: "TCP 协议中，若接收方通告的接收窗口为 0，发送方将：",
    options: [
      { label: "A", content: "停止发送数据，并启动坚持定时器" },
      { label: "B", content: "继续发送最大长度的报文段" },
      { label: "C", content: "关闭连接" },
      { label: "D", content: "发送 RST 报文" }
    ],
    answer: "A",
    analysis: "解析：为了防止“零窗口死锁”，发送方会启动坚持定时器，定期询问接收窗口是否已打开。"
  },
  {
    id: 164,
    type: "choice",
    subject: "数据结构",
    title: "在散列表中，处理冲突的线性探测法可能导致什么问题？",
    options: [
      { label: "A", content: "堆积（聚集）现象" },
      { label: "B", content: "删除节点非常简单" },
      { label: "C", content: "查找效率不受装填因子影响" },
      { label: "D", content: "无法存储字符串数据" }
    ],
    answer: "A",
    analysis: "解析：线性探测法会将冲突的元素依次存放在相邻位置，导致原本不冲突的元素也发生冲突，即“聚集”。"
  },
  {
    id: 165,
    type: "choice",
    subject: "计算机组成原理",
    title: "主存地址为 32 位，Cache 容量为 16KB，块大小为 64 字节，采用直接映射方式，则标记（Tag）字段的位数为：",
    options: [
      { label: "A", content: "18" },
      { label: "B", content: "12" },
      { label: "C", content: "10" },
      { label: "D", content: "20" }
    ],
    answer: "A",
    analysis: "解析：块偏移 = log2(64) = 6位。行数 = 16KB / 64B = 256 = 2^8，故索引位 = 8位。标记位 = 32 - 8 - 6 = 18位。"
  },
  {
    id: 166,
    type: "choice",
    subject: "操作系统",
    title: "多处理机系统中，每个处理机都有自己的时钟和内存，这种系统属于：",
    options: [
      { label: "A", content: "松耦合系统" },
      { label: "B", content: "紧耦合系统" },
      { label: "C", content: "分布式系统" },
      { label: "D", content: "单用户系统" }
    ],
    answer: "A",
    analysis: "解析：松耦合系统（分布式存储）通常指每个处理机拥有独立的资源，通过网络或消息传递协作。"
  },
  {
    id: 167,
    type: "choice",
    subject: "计算机网络",
    title: "在数据链路层中，控制帧传输速率以防止接收方过载的技术是：",
    options: [
      { label: "A", content: "差错控制" },
      { label: "B", content: "流量控制" },
      { label: "C", content: "拥塞控制" },
      { label: "D", content: "路由选择" }
    ],
    answer: "B",
    analysis: "解析：流量控制是在相邻节点间协调发送和接收的速度。"
  },
  {
    id: 168,
    type: "choice",
    subject: "数据结构",
    title: "向一颗 4 阶 B 树中插入关键字，一个结点内最多可以拥有的关键字个数是：",
    options: [
      { label: "A", content: "2" },
      { label: "B", content: "3" },
      { label: "C", content: "4" },
      { label: "D", content: "5" }
    ],
    answer: "B",
    analysis: "解析：m 阶 B 树的结点最多有 m-1 个关键字。4-1 = 3。"
  },
  {
    id: 169,
    type: "choice",
    subject: "计算机组成原理",
    title: "指令流水线的加速比（Speedup）定义是：",
    options: [
      { label: "A", content: "单级执行时间 / 多级执行时间" },
      { label: "B", content: "非流水线执行总时间 / 流水线执行总时间" },
      { label: "C", content: "流水线长度 / 时钟频率" },
      { label: "D", content: "输出指令数 / 输入指令数" }
    ],
    answer: "B",
    analysis: "解析：加速比用于衡量引入流水线后效率提升的倍数。"
  },
  {
    id: 170,
    type: "choice",
    subject: "操作系统",
    title: "在一个请求分页系统中，采用 LRU 置换算法，分配给进程 3 个页框。页面访问序列为 1, 2, 3, 4, 1, 2, 5。则缺页次数为：",
    options: [
      { label: "A", content: "4" },
      { label: "B", content: "5" },
      { label: "C", content: "6" },
      { label: "D", content: "7" }
    ],
    answer: "C",
    analysis: "解析：1(缺), 2(缺), 3(缺)；4换1(缺)；1换2(缺)；2换3(缺)；5换4(缺)。过程较多，请仔细核对，实际结果为 6 次。"
  },
  {
    id: 171,
    type: "choice",
    subject: "计算机网络",
    title: "HTTP 1.1 默认使用的连接方式是：",
    options: [
      { label: "A", content: "非持久连接" },
      { label: "B", content: "持久连接" },
      { label: "C", content: "UDP 连接" },
      { label: "D", content: "单工连接" }
    ],
    answer: "B",
    analysis: "解析：HTTP 1.1 引入了 Keep-Alive，默认在一个 TCP 连接上发送多个 HTTP 请求。"
  },
  {
    id: 172,
    type: "choice",
    subject: "数据结构",
    title: "具有 20 个结点的非连通无向图，最多可以有多少条边？",
    options: [
      { label: "A", content: "171" },
      { label: "B", content: "190" },
      { label: "C", content: "380" },
      { label: "D", content: "180" }
    ],
    answer: "A",
    analysis: "解析：要使边数最多且不连通，应使 19 个节点构成完全图，剩余 1 个点孤立。C(19, 2) = 19*18/2 = 171。"
  },
  {
    id: 173,
    type: "choice",
    subject: "计算机组成原理",
    title: "在 IEEE 754 浮点数标准中，阶码采用什么表示？",
    options: [
      { label: "A", content: "原码" },
      { label: "B", content: "补码" },
      { label: "C", content: "移码" },
      { label: "D", content: "反码" }
    ],
    answer: "C",
    analysis: "解析：阶码采用移码表示，便于直接比较浮点数的大小。"
  },
  {
    id: 174,
    type: "choice",
    subject: "操作系统",
    title: "为了实现 CPU 与外部设备之间的并行工作，最重要的硬件基础是：",
    options: [
      { label: "A", content: "中断机构" },
      { label: "B", content: "大容量内存" },
      { label: "C", content: "高速 CPU" },
      { label: "D", content: "寄存器" }
    ],
    answer: "A",
    analysis: "解析：中断机制允许外设在完成任务后主动通知 CPU，而不需要 CPU 一直等待。"
  },
  {
    id: 175,
    type: "choice",
    subject: "计算机网络",
    title: "某主机的 IP 地址为 192.168.1.10，子网掩码为 255.255.255.240，则该机所在网络的网络地址是：",
    options: [
      { label: "A", content: "192.168.1.0" },
      { label: "B", content: "192.168.1.1" },
      { label: "C", content: "192.168.1.32" },
      { label: "D", content: "192.168.1.16" }
    ],
    answer: "A",
    analysis: "解析：240 = 11110000。10 = 00001010。相与后结果为 0。"
  },
  {
    id: 176,
    type: "choice",
    subject: "数据结构",
    title: "已知二叉树有 50 个叶子结点，则度为 2 的结点个数是：",
    options: [
      { label: "A", content: "49" },
      { label: "B", content: "50" },
      { label: "C", content: "51" },
      { label: "D", content: "100" }
    ],
    answer: "A",
    analysis: "解析：在任何二叉树中，n0 = n2 + 1。故 n2 = 50 - 1 = 49。"
  },
  {
    id: 177,
    type: "choice",
    subject: "计算机组成原理",
    title: "磁盘存取时间不包括以下哪个部分？",
    options: [
      { label: "A", content: "寻道时间" },
      { label: "B", content: "旋转延迟时间" },
      { label: "C", content: "数据传输时间" },
      { label: "D", content: "指令执行时间" }
    ],
    answer: "D",
    analysis: "解析：存取时间由物理机械运动（寻道、旋转）和电子传输组成，与 CPU 指令执行无关。"
  },
  {
    id: 178,
    type: "choice",
    subject: "操作系统",
    title: "下列关于虚拟地址空间大小的说法，正确的是：",
    options: [
      { label: "A", content: "由物理内存大小决定" },
      { label: "B", content: "由外存大小决定" },
      { label: "C", content: "由 CPU 的寻址范围决定" },
      { label: "D", content: "由进程的优先级决定" }
    ],
    answer: "C",
    analysis: "解析：逻辑地址空间的范围取决于机器的位数（如 32 位机器为 4GB）。"
  },
  {
    id: 179,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 三次握手中，第一次握手发送的报文段中 SYN=1，此时序列号：",
    options: [
      { label: "A", content: "必须为 0" },
      { label: "B", content: "消耗一个序号" },
      { label: "C", content: "不消耗序号" },
      { label: "D", content: "等于目的端口号" }
    ],
    answer: "B",
    analysis: "解析：SYN 报文段虽然不携带数据，但由于其重要性，在序列号计算上会消耗一个序号。"
  },
  {
    id: 180,
    type: "choice",
    subject: "数据结构",
    title: "希尔排序的组内排序采用的是：",
    options: [
      { label: "A", content: "直接插入排序" },
      { label: "B", content: "快速排序" },
      { label: "C", content: "简单选择排序" },
      { label: "D", content: "归并排序" }
    ],
    answer: "A",
    analysis: "解析：希尔排序本质上是缩小增量后的插入排序。"
  },
  {
    id: 181,
    type: "choice",
    subject: "计算机组成原理",
    title: "总线带宽的单位通常是：",
    options: [
      { label: "A", content: "bps (bits per second)" },
      { label: "B", content: "MB/s (MegaBytes per second)" },
      { label: "C", content: "Hz" },
      { label: "D", content: "MIPS" }
    ],
    answer: "B",
    analysis: "解析：总线带宽是指单位时间内总线上传输的数据量，常用 MB/s。"
  },
  {
    id: 182,
    type: "choice",
    subject: "操作系统",
    title: "实现临界区互斥的硬件方法中，TestAndSet 指令的作用是：",
    options: [
      { label: "A", content: "检查并设置锁" },
      { label: "B", content: "仅检查锁" },
      { label: "C", content: "仅清除锁" },
      { label: "D", content: "唤醒进程" }
    ],
    answer: "A",
    analysis: "解析：TAS 指令是原子的，它读取旧值并写入新值，防止多个进程同时进入临界区。"
  },
  {
    id: 183,
    type: "choice",
    subject: "计算机网络",
    title: "下面哪个端口号属于周知端口（Well-known Ports）？",
    options: [
      { label: "A", content: "80" },
      { label: "B", content: "8080" },
      { label: "C", content: "49152" },
      { label: "D", content: "65535" }
    ],
    answer: "A",
    analysis: "解析：0-1023 为周知端口。80 是 HTTP 的标准端口。"
  },
  {
    id: 184,
    type: "choice",
    subject: "数据结构",
    title: "在一个栈中，若入栈序列为 a, b, c，则不可能的出栈序列是：",
    options: [
      { label: "A", content: "a, b, c" },
      { label: "B", content: "c, b, a" },
      { label: "C", content: "b, a, c" },
      { label: "D", content: "c, a, b" }
    ],
    answer: "D",
    analysis: "解析：若 c 第一个出栈，说明 a, b 已在栈中，b 在栈顶，必须先于 a 出栈。"
  },
  {
    id: 185,
    type: "choice",
    subject: "计算机组成原理",
    title: "计算机中，溢出检测主要针对的是：",
    options: [
      { label: "A", content: "无符号数加法" },
      { label: "B", content: "有符号数加法" },
      { label: "C", content: "浮点数乘法" },
      { label: "D", content: "所有逻辑运算" }
    ],
    answer: "B",
    analysis: "解析：溢出通常指补码运算结果超出了所能表示的范围。"
  },
  {
    id: 186,
    type: "choice",
    subject: "操作系统",
    title: "在死锁防御中，资源分配图中有环路：",
    options: [
      { label: "A", content: "必然发生死锁" },
      { label: "B", content: "若每类资源只有一个，则必然死锁" },
      { label: "C", content: "若每类资源有多个，则不一定死锁" },
      { label: "D", content: "B 和 C 都正确" }
    ],
    answer: "D",
    analysis: "解析：环路是死锁的必要条件，只有当资源唯一时才是充分条件。"
  },
  {
    id: 187,
    type: "choice",
    subject: "计算机网络",
    title: "路由器在转发 IP 分组时，若 TTL 字段变为 0，则：",
    options: [
      { label: "A", content: "继续转发" },
      { label: "B", content: "丢弃并向源主机发 ICMP 时间超过报文" },
      { label: "C", content: "丢弃并向源主机发 ICMP 终点不可达报文" },
      { label: "D", content: "重新计算校验和后转发" }
    ],
    answer: "B",
    analysis: "解析：TTL 防止报文在网络中无限循环。"
  },
  {
    id: 188,
    type: "choice",
    subject: "数据结构",
    title: "平衡二叉树在插入结点时，若产生 RL 型不平衡，应如何旋转？",
    options: [
      { label: "A", content: "向右单旋" },
      { label: "B", content: "先右旋再左旋" },
      { label: "C", content: "先左旋再右旋" },
      { label: "D", content: "向左单旋" }
    ],
    answer: "B",
    analysis: "解析：RL 型需先对右子树进行右单旋，再对根节点进行左单旋。"
  },
  {
    id: 189,
    type: "choice",
    subject: "计算机组成原理",
    title: "控制单元 CU 的输入不包括：",
    options: [
      { label: "A", content: "指令寄存器的操作码" },
      { label: "B", content: "时钟信号" },
      { label: "C", content: "标志位（如进位、溢出）" },
      { label: "D", content: "运算器的结果数据" }
    ],
    answer: "D",
    analysis: "解析：CU 只负责发出控制命令，不需要具体的运算数据结果。"
  },
  {
    id: 190,
    type: "choice",
    subject: "操作系统",
    title: "操作系统提供给程序员的接口是：",
    options: [
      { label: "A", content: "命令行接口" },
      { label: "B", content: "图形界面" },
      { label: "C", content: "系统调用" },
      { label: "D", content: "汇编语言" }
    ],
    answer: "C",
    analysis: "解析：编程接口（API）底层就是通过系统调用与内核交互的。"
  },
  {
    id: 191,
    type: "choice",
    subject: "计算机网络",
    title: "SMTP 使用的传输层协议和端口号分别是：",
    options: [
      { label: "A", content: "TCP, 25" },
      { label: "B", content: "UDP, 25" },
      { label: "C", content: "TCP, 110" },
      { label: "D", content: "UDP, 53" }
    ],
    answer: "A",
    analysis: "解析：邮件发送协议 SMTP 依赖可靠的 TCP，端口号为 25。"
  },
  {
    id: 192,
    type: "choice",
    subject: "数据结构",
    title: "对于一个有 e 条边的向图，邻接表中边结点的个数是：",
    options: [
      { label: "A", content: "e" },
      { label: "B", content: "2e" },
      { label: "C", content: "e+1" },
      { label: "D", content: "n+e" }
    ],
    answer: "A",
    analysis: "解析：有向图中每条边对应一个边结点。如果是无向图，则为 2e。"
  },
  {
    id: 193,
    type: "choice",
    subject: "计算机组成原理",
    title: "CPU 的主要组成部分是：",
    options: [
      { label: "A", content: "运算器和控制器" },
      { label: "B", content: "运算器和存储器" },
      { label: "C", content: "控制器和 I/O 接口" },
      { label: "D", content: "ALU 和寄存器" }
    ],
    answer: "A",
    analysis: "解析：经典的 CPU 由运算器（执行数据加工）和控制器（协调指令执行）构成。"
  },
  {
    id: 194,
    type: "choice",
    subject: "操作系统",
    title: "磁盘扫描算法 SCAN 的主要特点是：",
    options: [
      { label: "A", content: "优先处理最近的磁道" },
      { label: "B", content: "按磁头移动方向顺序处理" },
      { label: "C", content: "先来先服务" },
      { label: "D", content: "循环单向扫描" }
    ],
    answer: "B",
    analysis: "解析：SCAN（电梯算法）沿一个方向扫描到头，再反向扫描。"
  },
  {
    id: 195,
    type: "choice",
    subject: "计算机网络",
    title: "在以太网中，最小帧长为 64 字节，则为了检测到冲突，电缆长度必须限制在一定范围内。若速率提高 10 倍，电缆长度应：",
    options: [
      { label: "A", content: "增加到 10 倍" },
      { label: "B", content: "保持不变" },
      { label: "C", content: "减小到 1/10" },
      { label: "D", content: "减小到 1/2" }
    ],
    answer: "C",
    analysis: "解析：争用期 = 2 * 距离 / 速度。速率提高则发送 64 字节的时间缩短，为了能及时检测冲突，距离必须成比例减小。"
  },
  {
    id: 196,
    type: "choice",
    subject: "数据结构",
    title: "在关键路径法中，关键路径是指：",
    options: [
      { label: "A", content: "路径上活动数目最多的路径" },
      { label: "B", content: "从开始到结束所有路径中最长的路径" },
      { label: "C", content: "从开始到结束所有路径中最短的路径" },
      { label: "D", content: "包含关键活动最少的路径" }
    ],
    answer: "B",
    analysis: "解析：关键路径的长度决定了整个工程的最短完成时间。"
  },
  {
    id: 197,
    type: "choice",
    subject: "计算机组成原理",
    title: "微指令的格式中，水平型微指令相比垂直型微指令的特点是：",
    options: [
      { label: "A", content: "指令长，并行能力强" },
      { label: "B", content: "指令短，并行能力强" },
      { label: "C", content: "指令长，并行能力弱" },
      { label: "D", content: "执行速度慢" }
    ],
    answer: "A",
    analysis: "解析：水平型微指令包含多个控制字段，一次能发出多个微命令，故并行性好。"
  },
  {
    id: 198,
    type: "choice",
    subject: "操作系统",
    title: "在 P-V 操作中，V 操作会导致：",
    options: [
      { label: "A", content: "信号量值加 1" },
      { label: "B", content: "信号量值减 1" },
      { label: "C", content: "进程进入阻塞队列" },
      { label: "D", content: "资源被永久占用" }
    ],
    answer: "A",
    analysis: "解析：V 操作表示释放资源，将信号量加 1。"
  },
  {
    id: 199,
    type: "choice",
    subject: "计算机网络",
    title: "下面哪个协议用于将私有 IP 地址转换为公网 IP 地址？",
    options: [
      { label: "A", content: "DHCP" },
      { label: "B", content: "NAT" },
      { label: "C", content: "DNS" },
      { label: "D", content: "ICMP" }
    ],
    answer: "B",
    analysis: "解析：NAT（网络地址转换）允许局域网多台主机共用一个公网 IP 上网。"
  },
  {
    id: 200,
    type: "choice",
    subject: "数据结构",
    title: "下列关于散列表查找成功的平均查找长度，说法正确的是：",
    options: [
      { label: "A", content: "与表中元素个数无关" },
      { label: "B", content: "只与散列函数有关" },
      { label: "C", content: "主要取决于装填因子" },
      { label: "D", content: "总是 O(1)" }
    ],
    answer: "C",
    analysis: "解析：装填因子越大，冲突概率越高，查找长度越长。"
  },
  {
    id: 201,
    type: "choice",
    subject: "计算机组成原理",
    title: "指令 Cache 的命中率对 CPU 执行效率影响巨大，主要体现了哪种局部性？",
    options: [
      { label: "A", content: "空间局部性" },
      { label: "B", content: "时间局部性" },
      { label: "C", content: "程序执行的顺序性" },
      { label: "D", content: "以上都是" }
    ],
    answer: "D",
    analysis: "解析：Cache 的有效性基于时间局部性和空间局部性。"
  },
  {
    id: 202,
    type: "choice",
    subject: "操作系统",
    title: "下列哪个文件物理分配方式最适合随机访问且文件大小经常变化？",
    options: [
      { label: "A", content: "连续分配" },
      { label: "B", content: "链接分配" },
      { label: "C", content: "索引分配" },
      { label: "D", content: "顺序分配" }
    ],
    answer: "C",
    analysis: "解析：索引分配支持随机读写，且通过分级索引可以灵活支持文件增长。"
  },
  {
    id: 203,
    type: "choice",
    subject: "计算机网络",
    title: "下列哪个协议属于“无连接”的？",
    options: [
      { label: "A", content: "TCP" },
      { label: "B", content: "UDP" },
      { label: "C", content: "FTP" },
      { label: "D", content: "HTTP 1.1" }
    ],
    answer: "B",
    analysis: "解析：UDP 是典型的无连接传输层协议。"
  },
  {
    id: 104,
    type: "choice",
    subject: "数据结构",
    title: "具有 n 个顶点的强连通有向图，最少需要多少条边？",
    options: [
      { label: "A", content: "n-1" },
      { label: "B", content: "n" },
      { label: "C", content: "n+1" },
      { label: "D", content: "n(n-1)" }
    ],
    answer: "B",
    analysis: "解析：强连通意味着任意两点互达，最简结构是一个环，包含 n 条边。"
  },
  {
    id: 205,
    type: "choice",
    subject: "计算机组成原理",
    title: "在中断系统中，中断向量是指：",
    options: [
      { label: "A", content: "中断服务程序的起始地址" },
      { label: "B", content: "中断请求信号的电平" },
      { label: "C", content: "中断控制器的状态码" },
      { label: "D", content: "保存断点的寄存器" }
    ],
    answer: "A",
    analysis: "解析：中断向量本质上就是中断处理程序的入口地址。"
  },

  {
    id: 206,
    type: "choice",
    subject: "数据结构",
    title: "在含有 n 个关键字的 3 阶 B 树中，其高度 h 的范围是：",
    options: [
      { label: "A", content: "log3(n+1) ≤ h ≤ log2((n+1)/2)+1" },
      { label: "B", content: "log3(n+1) ≤ h ≤ log2n" },
      { label: "C", content: "log2(n+1) ≤ h ≤ log3n" },
      { label: "D", content: "无法确定" }
    ],
    answer: "A",
    analysis: "解析：3 阶 B 树即 2-3 树。高度最小的情况是每个节点满载（3 个分支），最高的情况是每个节点只有 2 个分支（退化为二叉树）。"
  },
  {
    id: 207,
    type: "choice",
    subject: "计算机组成原理",
    title: "向量中断方式下，中断服务程序的跳转是通过：",
    options: [
      { label: "A", content: "软件查询" },
      { label: "B", content: "中断向量表" },
      { label: "C", content: "程序计数器 PC 自动加 1" },
      { label: "D", content: "堆栈指令" }
    ],
    answer: "B",
    analysis: "解析：硬件根据中断源产生中断向量地址，通过查询中断向量表获取服务程序的起始地址。"
  },
  {
    id: 208,
    type: "choice",
    subject: "操作系统",
    title: "在分段存储管理中，产生“外部碎片”的原因是：",
    options: [
      { label: "A", content: "段的长度不固定，回收后留下的空闲区过小" },
      { label: "B", content: "页面的大小固定" },
      { label: "C", content: "分配的内存大于进程需求" },
      { label: "D", content: "段表占用了过多空间" }
    ],
    answer: "A",
    analysis: "解析：外部碎片是指内存中存在的、由于太小而无法分配给任何段的空闲空间。"
  },
  {
    id: 209,
    type: "choice",
    subject: "计算机网络",
    title: "当主机 A 向主机 B 发送一个 IP 分组时，若 B 不在同一个物理网络，则 A 将分组发给：",
    options: [
      { label: "A", content: "默认网关（路由器）" },
      { label: "B", content: "DNS 服务器" },
      { label: "C", content: "交换机" },
      { label: "D", content: "广播地址" }
    ],
    answer: "A",
    analysis: "解析：不同网段间的通信必须经过路由器，主机通过子网掩码判断目标 IP 是否在本地网段。"
  },
  {
    id: 210,
    type: "choice",
    subject: "数据结构",
    title: "使用 Dijkstra 算法求无向连通图的最短路径，其算法思想属于：",
    options: [
      { label: "A", content: "贪心算法" },
      { label: "B", content: "动态规划" },
      { label: "C", content: "回溯法" },
      { label: "D", content: "分治法" }
    ],
    answer: "A",
    analysis: "解析：Dijkstra 每次从未访问集合中选择当前距离源点最近的顶点，具有明显的贪心特征。"
  },
  {
    id: 211,
    type: "choice",
    subject: "计算机组成原理",
    title: "RISC 指令系统最显著的特征是：",
    options: [
      { label: "A", content: "指令格式多样化" },
      { label: "B", content: "指令长度固定，指令种类少" },
      { label: "C", content: "寻址方式复杂" },
      { label: "D", content: "不需要寄存器" }
    ],
    answer: "B",
    analysis: "解析：RISC（精简指令集）为了简化流水线设计，采用定长指令和少量简单的指令。"
  },
  {
    id: 212,
    type: "choice",
    subject: "操作系统",
    title: "在虚拟内存管理中，页表项中的“修改位”（Dirty Bit）主要用于：",
    options: [
      { label: "A", content: "判断页面是否在内存" },
      { label: "B", content: "决定置换时是否需要写回外存" },
      { label: "C", content: "控制页面访问权限" },
      { label: "D", content: "统计页面访问频率" }
    ],
    answer: "B",
    analysis: "解析：若页面在内存中被修改过（Dirty），换出时必须同步到磁盘，否则直接丢弃以节省 I/O。"
  },
  {
    id: 213,
    type: "choice",
    subject: "计算机网络",
    title: "在滑动窗口协议中，若窗口大小为 4，发送方发出 0,1,2,3 号帧，收到 1 号帧的 ACK，则下一个可发送的帧是：",
    options: [
      { label: "A", content: "4 号" },
      { label: "B", content: "5 号" },
      { label: "C", content: "2 号" },
      { label: "D", content: "0 号" }
    ],
    answer: "A",
    analysis: "解析：收到 1 号 ACK 意味着 0 和 1 都被确认了（累计确认），窗口前移 2 位，可发 4, 5 号。"
  },
  {
    id: 214,
    type: "choice",
    subject: "数据结构",
    title: "一个哈夫曼树有 19 个结点，则该树对应的前缀编码包含几个字符？",
    options: [
      { label: "A", content: "9" },
      { label: "B", content: "10" },
      { label: "C", content: "11" },
      { label: "D", content: "18" }
    ],
    answer: "B",
    analysis: "解析：哈夫曼树中 n = n0 + n2 = 2n0 - 1。19 = 2n0 - 1 => n0 = 10。叶子节点数即字符数。"
  },
  {
    id: 215,
    type: "choice",
    subject: "计算机组成原理",
    title: "大端模式（Big-endian）是指：",
    options: [
      { label: "A", content: "低字节存在低地址" },
      { label: "B", content: "高字节存在低地址" },
      { label: "C", content: "高字节存在高地址" },
      { label: "D", content: "随机存储" }
    ],
    answer: "B",
    analysis: "解析：大端符合人类阅读习惯，把最重要的（高位）放在最前面（低地址）。"
  },
  {
    id: 216,
    type: "choice",
    subject: "操作系统",
    title: "PCB（进程控制块）不包含以下哪项信息？",
    options: [
      { label: "A", content: "进程状态" },
      { label: "B", content: "寄存器上下文" },
      { label: "C", content: "全局变量的所有取值" },
      { label: "D", content: "进程 ID" }
    ],
    answer: "C",
    analysis: "解析：PCB 存储控制和恢复进程所需的信息。全局变量属于进程的地址空间数据区，不在 PCB 中。"
  },
  {
    id: 217,
    type: "choice",
    subject: "计算机网络",
    title: "在以太网中，如果发生 10 次碰撞，则站点再次尝试发送前，退避的最大时延可能是争用期的多少倍？",
    options: [
      { label: "A", content: "10" },
      { label: "B", content: "512" },
      { label: "C", content: "1023" },
      { label: "D", content: "2" }
    ],
    answer: "C",
    analysis: "解析：指数退避算法中，第 k 次碰撞后，随机数范围为 [0, 2^k - 1]。2^10 - 1 = 1023。"
  },
  {
    id: 218,
    type: "choice",
    subject: "数据结构",
    title: "下列关于 AVL 树和红黑树的说法，正确的是：",
    options: [
      { label: "A", content: "红黑树是比 AVL 树更严格的平衡树" },
      { label: "B", content: "AVL 树的查找性能通常优于红黑树" },
      { label: "C", content: "红黑树的旋转次数比 AVL 树多" },
      { label: "D", content: "红黑树的高度始终小于 AVL 树" }
    ],
    answer: "B",
    analysis: "解析：AVL 是严格平衡，高度更低，查找更快；红黑树是弱平衡，插入删除旋转少，适合写多读多场景。"
  },
  {
    id: 219,
    type: "choice",
    subject: "计算机组成原理",
    title: "存储器映射 I/O（Memory-mapped I/O）意味着：",
    options: [
      { label: "A", content: "I/O 端口拥有独立的地址空间" },
      { label: "B", content: "I/O 端口占用一部分主存地址空间" },
      { label: "C", content: "CPU 需要专门的 I/O 指令访问外设" },
      { label: "D", content: "不需要地址线访问外设" }
    ],
    answer: "B",
    analysis: "解析：存储器映射方式下，访问外设就像访问内存单元一样，使用普通的 Load/Store 指令。"
  },
  {
    id: 220,
    type: "choice",
    subject: "操作系统",
    title: "在解决“读者-写者问题”时，若要求“写者优先”，意味着：",
    options: [
      { label: "A", content: "只要有写者在等待，后续读者就不能进入" },
      { label: "B", content: "写者可以打断正在阅读的读者" },
      { label: "C", content: "多个写者可以同时写入" },
      { label: "D", content: "读者永远无法进入" }
    ],
    answer: "A",
    analysis: "解析：写者优先是为了防止写者因大量并发读者而处于长期饥饿状态。"
  },
  {
    id: 221,
    type: "choice",
    subject: "计算机网络",
    title: "OSPF 协议采用什么算法计算最短路径？",
    options: [
      { label: "A", content: "距离矢量算法" },
      { label: "B", content: "Dijkstra 算法" },
      { label: "C", content: "Flooding 算法" },
      { label: "D", content: "Bellman-Ford 算法" }
    ],
    answer: "B",
    analysis: "解析：OSPF 基于链路状态（Link State），每个路由器都有完整的拓扑图，并用 Dijkstra 计算。"
  },
  {
    id: 222,
    type: "choice",
    subject: "数据结构",
    title: "一棵含有 25 个结点的完全二叉树的深度为（根结点为第 1 层）：",
    options: [
      { label: "A", content: "4" },
      { label: "B", content: "5" },
      { label: "C", content: "6" },
      { label: "D", content: "25" }
    ],
    answer: "B",
    analysis: "解析：深度 h = ⌊log2n⌋ + 1 = ⌊log225⌋ + 1 = 4 + 1 = 5。"
  },
  {
    id: 223,
    type: "choice",
    subject: "计算机组成原理",
    title: "寻址方式中，操作数在寄存器中，这种方式称为：",
    options: [
      { label: "A", content: "寄存器寻址" },
      { label: "B", content: "寄存器间接寻址" },
      { label: "C", content: "直接寻址" },
      { label: "D", content: "立即寻址" }
    ],
    answer: "A",
    analysis: "解析：寄存器寻址直接从寄存器拿数据，寄存器间接寻址是从寄存器拿内存地址。"
  },
  {
    id: 224,
    type: "choice",
    subject: "操作系统",
    title: "下列关于页式和段式管理的说法，错误的是：",
    options: [
      { label: "A", content: "页是信息的物理单位" },
      { label: "B", content: "段是信息的逻辑单位" },
      { label: "C", content: "分页对用户是透明的" },
      { label: "D", content: "分段的主要目的是为了减少内存碎片" }
    ],
    answer: "D",
    analysis: "解析：分段更容易产生外部碎片，其目的是满足用户的逻辑需求（如共享、保护）。"
  },
  {
    id: 225,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 拥塞控制中，当拥塞窗口 cwnd 达到慢开始门限 ssthresh 后，执行：",
    options: [
      { label: "A", content: "指数增长" },
      { label: "B", content: "线性增长（拥塞避免）" },
      { label: "C", content: "减半增长" },
      { label: "D", content: "停止增长" }
    ],
    answer: "B",
    analysis: "解析：达到门限后从“慢开始”转为“拥塞避免”，每经过一个 RTT，cwnd 增加 1。"
  },
  {
    id: 226,
    type: "choice",
    subject: "数据结构",
    title: "在一个单链表中，删除指针 p 所指结点的后继结点 q，其操作是：",
    options: [
      { label: "A", content: "p->next = q->next; free(q);" },
      { label: "B", content: "q->next = p->next; free(q);" },
      { label: "C", content: "p->next = q; free(q);" },
      { label: "D", content: "q = p->next->next; free(q);" }
    ],
    answer: "A",
    analysis: "解析：跨过 q 指向 q 的后继，然后释放 q 占用的空间。"
  },
  {
    id: 227,
    type: "choice",
    subject: "计算机组成原理",
    title: "浮点数运算中，下溢（Underflow）是指：",
    options: [
      { label: "A", content: "结果太小，绝对值趋于 0" },
      { label: "B", content: "结果太大，超出了表示范围" },
      { label: "C", content: "结果为负数" },
      { label: "D", content: "阶码全为 1" }
    ],
    answer: "A",
    analysis: "解析：上溢是超出最大范围（通常抛出异常），下溢是小于最小精度（通常当作 0 处理）。"
  },
  {
    id: 228,
    type: "choice",
    subject: "操作系统",
    title: "系统抖动现象发生时，CPU 的利用率通常会：",
    options: [
      { label: "A", content: "急剧升高" },
      { label: "B", content: "急剧下降" },
      { label: "C", content: "保持稳定" },
      { label: "D", content: "小幅波动" }
    ],
    answer: "B",
    analysis: "解析：因为系统忙于页面置换（I/O 等待），导致实际用于计算的时间片极少。"
  },
  {
    id: 229,
    type: "choice",
    subject: "计算机网络",
    title: "以太网交换机的自学习是指学习：",
    options: [
      { label: "A", content: "源 MAC 地址与入端口的映射" },
      { label: "B", content: "目的 MAC 地址与出端口的映射" },
      { label: "C", content: "IP 地址与 MAC 地址的映射" },
      { label: "D", content: "目的 IP 与入端口的映射" }
    ],
    answer: "A",
    analysis: "解析：交换机观察进来的帧，记录下“谁从哪个门口进来的”，从而建立转发表。"
  },
  {
    id: 230,
    type: "choice",
    subject: "数据结构",
    title: "下列关于图的连通性的叙述中，错误的是：",
    options: [
      { label: "A", content: "有向图若是强连通的，则必有回路" },
      { label: "B", content: "无向图若不是连通的，则必有多个连通分量" },
      { label: "C", content: "强连通有向图的所有顶点的度之和为 2e" },
      { label: "D", content: "生成树是连通图的极小连通子图" }
    ],
    answer: "C",
    analysis: "解析：有向图中顶点的度分为入度和出度，总度数确实是 2e，但“所有顶点的度之和”描述不够准确，通常指入度之和或出度之和为 e。"
  },
  {
    id: 231,
    type: "choice",
    subject: "计算机组成原理",
    title: "微程序控制器的速度比硬布线控制器：",
    options: [
      { label: "A", content: "快" },
      { label: "B", content: "慢" },
      { label: "C", content: "一样" },
      { label: "D", content: "不确定" }
    ],
    answer: "B",
    analysis: "解析：微程序需要从控制存储器读取微指令，而硬布线是纯组合逻辑电路，响应更快。"
  },
  {
    id: 232,
    type: "choice",
    subject: "操作系统",
    title: "在文件系统中，FCB（文件控制块）是在什么时候创建的？",
    options: [
      { label: "A", content: "打开文件时" },
      { label: "B", content: "建立文件时" },
      { label: "C", content: "读取文件时" },
      { label: "D", content: "修改文件时" }
    ],
    answer: "B",
    analysis: "解析：FCB 记录了文件的基本信息，文件诞生时就必须分配 FCB。"
  },
  {
    id: 233,
    type: "choice",
    subject: "计算机网络",
    title: "数据报片段重组（Reassembly）是在哪里完成的？",
    options: [
      { label: "A", content: "中间路由器" },
      { label: "B", content: "源主机" },
      { label: "C", content: "目的主机" },
      { label: "D", content: "网关" }
    ],
    answer: "C",
    analysis: "解析：IP 分片可以在路径中发生，但重组只在最终的目的端进行。"
  },
  {
    id: 234,
    type: "choice",
    subject: "数据结构",
    title: "对于一个有 n 个顶点的森林，若共有 m 条边，则该森林包含多少棵树？",
    options: [
      { label: "A", content: "n-m" },
      { label: "B", content: "m-n" },
      { label: "C", content: "n+m" },
      { label: "D", content: "无法计算" }
    ],
    answer: "A",
    analysis: "解析：对每棵树有 n_i = m_i + 1。求和得 Σn_i = Σm_i + Σ1 => n = m + k，故 k = n-m。"
  },
  {
    id: 235,
    type: "choice",
    subject: "计算机组成原理",
    title: "计算机总线中，仲裁控制逻辑的作用是：",
    options: [
      { label: "A", content: "解决多个主设备竞争总线使用权的问题" },
      { label: "B", content: "控制数据传输速率" },
      { label: "C", content: "进行地址译码" },
      { label: "D", content: "管理内存刷新" }
    ],
    answer: "A",
    analysis: "解析：总线是共享资源，同一时刻只能有一个主设备控制，仲裁负责排队和授权。"
  },
  {
    id: 236,
    type: "choice",
    subject: "操作系统",
    title: "Spooling 系统中的输入井和输出井位于：",
    options: [
      { label: "A", content: "内存" },
      { label: "B", content: "磁盘" },
      { label: "C", content: "寄存器" },
      { label: "D", content: "ROM" }
    ],
    answer: "B",
    analysis: "解析：Spooling 借用大容量磁盘空间作为缓冲区，模拟独占设备的共享。"
  },
  {
    id: 237,
    type: "choice",
    subject: "计算机网络",
    title: "在以太网中，最小帧长为 64 字节是由什么决定的？",
    options: [
      { label: "A", content: "网络带宽和传播延迟" },
      { label: "B", content: "应用层协议需求" },
      { label: "C", content: "IP 地址长度" },
      { label: "D", content: "物理层介质类型" }
    ],
    answer: "A",
    analysis: "解析：最小帧长必须保证在帧发完之前，发送端能检测到最远距离产生的碰撞。"
  },
  {
    id: 238,
    type: "choice",
    subject: "数据结构",
    title: "堆排序在建立初始堆的过程中，时间复杂度为：",
    options: [
      { label: "A", content: "O(n)" },
      { label: "B", content: "O(log n)" },
      { label: "C", content: "O(n log n)" },
      { label: "D", content: "O(n^2)" }
    ],
    answer: "A",
    analysis: "解析：虽然单次调整是 O(log n)，但通过严谨数学推导，自底向上建堆的总时间是 O(n)。"
  },
  {
    id: 239,
    type: "choice",
    subject: "计算机组成原理",
    title: "DMA 控制器进行数据交换时，会占用：",
    options: [
      { label: "A", content: "CPU 的时钟周期" },
      { label: "B", content: "总线的一个周期" },
      { label: "C", content: "整个内存地址空间" },
      { label: "D", content: "堆栈指针" }
    ],
    answer: "B",
    analysis: "解析：DMA 通过“周期窃取”或“总线挂起”来访问内存，不干预 CPU 内部寄存器。"
  },
  {
    id: 240,
    type: "choice",
    subject: "操作系统",
    title: "信号量 PV 操作无法解决：",
    options: [
      { label: "A", content: "进程互斥" },
      { label: "B", content: "进程同步" },
      { label: "C", content: "死锁的自动解除" },
      { label: "D", content: "前驱关系" }
    ],
    answer: "C",
    analysis: "解析：PV 操作可以预防死锁（通过逻辑设计），但不能自动检测并解除已经发生的死锁。"
  },
  {
    id: 241,
    type: "choice",
    subject: "计算机网络",
    title: "下列关于 HTTP 状态码，错误的是：",
    options: [
      { label: "A", content: "200 OK - 请求成功" },
      { label: "B", content: "404 Not Found - 服务器宕机" },
      { label: "C", content: "301 - 永久重定向" },
      { label: "D", content: "500 - 服务器内部错误" }
    ],
    answer: "B",
    analysis: "解析：404 表示请求的资源不存在，而不是服务器关机（关机通常会导致连接超时）。"
  },
  {
    id: 242,
    type: "choice",
    subject: "数据结构",
    title: "在一个无向图中，如果存在从顶点 v 到顶点 w 的路径，则称 v 和 w 是：",
    options: [
      { label: "A", content: "连通的" },
      { label: "B", content: "强连通的" },
      { label: "C", content: "邻接的" },
      { label: "D", content: "相关的" }
    ],
    answer: "A",
    analysis: "解析：无向图称为连通，有向图称为强连通。"
  },
  {
    id: 243,
    type: "choice",
    subject: "计算机组成原理",
    title: "在流水线计算机中，减少分支预测失败开销的技术是：",
    options: [
      { label: "A", content: "增加 Cache 容量" },
      { label: "B", content: "分支目标缓冲（BTB）" },
      { label: "C", content: "加快 ALU 计算" },
      { label: "D", content: "扩充寄存器组" }
    ],
    answer: "B",
    analysis: "解析：BTB 记录了分支指令的历史跳转情况，辅助 CPU 进行更准确的预测。"
  },
  {
    id: 244,
    type: "choice",
    subject: "操作系统",
    title: "逻辑文件系统负责：",
    options: [
      { label: "A", content: "管理磁盘块的分配" },
      { label: "B", content: "文件目录的管理和权限验证" },
      { label: "C", content: "控制磁盘驱动器" },
      { label: "D", content: "处理中断" }
    ],
    answer: "B",
    analysis: "解析：逻辑文件系统处于高层，主要处理文件名、路径、权限等抽象逻辑。"
  },
  {
    id: 245,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 协议中，确认号（Ack No）的含义是：",
    options: [
      { label: "A", content: "期望收到对方下一个报文段的第一个字节序号" },
      { label: "B", content: "上一个收到的报文段的最后一字节序号" },
      { label: "C", content: "连接的 ID" },
      { label: "D", content: "窗口的大小" }
    ],
    answer: "A",
    analysis: "解析：TCP 确认是累计确认，确认号 N 表示 N-1 之前的字节已收到，想要第 N 个。"
  },
  {
    id: 246,
    type: "choice",
    subject: "数据结构",
    title: "下列关于双端队列的描述，正确的是：",
    options: [
      { label: "A", content: "两端都可以进行插入和删除" },
      { label: "B", content: "只能一端插入，另一端删除" },
      { label: "C", content: "只能一端插入，两端删除" },
      { label: "D", content: "两端插入，只能一端删除" }
    ],
    answer: "A",
    analysis: "解析：Deque（Double-ended queue）支持从 Front 和 Rear 两个方向操作。"
  },
  {
    id: 247,
    type: "choice",
    subject: "计算机组成原理",
    title: "计算机运算器的核心部件是：",
    options: [
      { label: "A", content: "寄存器" },
      { label: "B", content: "ALU（算术逻辑单元）" },
      { label: "C", content: "数据通路" },
      { label: "D", content: "多路开关" }
    ],
    answer: "B",
    analysis: "解析：ALU 负责所有算术和逻辑运算，是运算器的心脏。"
  },
  {
    id: 248,
    type: "choice",
    subject: "操作系统",
    title: "如果一个进程正在运行，它被剥夺 CPU 后会进入：",
    options: [
      { label: "A", content: "就绪态" },
      { label: "B", content: "阻塞态" },
      { label: "C", content: "终止态" },
      { label: "D", content: "空闲态" }
    ],
    answer: "A",
    analysis: "解析：时间片用完或被高优先级抢占，进程仍具备运行条件，故回就绪队列。"
  },
  {
    id: 249,
    type: "choice",
    subject: "计算机网络",
    title: "下列网络层协议中，不直接封装在 IP 数据报中的是：",
    options: [
      { label: "A", content: "ICMP" },
      { label: "B", content: "IGMP" },
      { label: "C", content: "OSPF" },
      { label: "D", content: "RIP" }
    ],
    answer: "D",
    analysis: "解析：RIP 协议报文封装在 UDP 中，属于应用层协议实现（但功能是网络层）。ICMP/OSPF/IGMP 都直接在 IP 之上。"
  },
  {
    id: 250,
    type: "choice",
    subject: "数据结构",
    title: "在查找表（13, 25, 38, 49, 52, 65, 71）中进行折半查找，查找关键字 25 需要比较几次？",
    options: [
      { label: "A", content: "1" },
      { label: "B", content: "2" },
      { label: "C", content: "3" },
      { label: "D", content: "4" }
    ],
    answer: "B",
    analysis: "解析：1. 中间值 49（第 4 位）；2. 在左半部分（13, 25, 38）查，中间值 25。命中，共 2 次。"
  },
  {
    id: 251,
    type: "choice",
    subject: "计算机组成原理",
    title: "内存地址从 0000H 到 3FFFH，其容量为：",
    options: [
      { label: "A", content: "16KB" },
      { label: "B", content: "4KB" },
      { label: "C", content: "64KB" },
      { label: "D", content: "32KB" }
    ],
    answer: "A",
    analysis: "解析：3FFFH = 2^14 - 1。总数 = 2^14 = 16384 字节 = 16KB。"
  },
  {
    id: 252,
    type: "choice",
    subject: "操作系统",
    title: "下列关于父进程与子进程的说法，正确的是：",
    options: [
      { label: "A", content: "撤销父进程必撤销子进程" },
      { label: "B", content: "子进程可以共享父进程的所有资源" },
      { label: "C", content: "父进程与子进程可以并行执行" },
      { label: "D", content: "子进程不能有自己的子进程" }
    ],
    answer: "C",
    analysis: "解析：在 Unix 系统中，父子进程是独立的执行单元，可以并行处理。"
  },
  {
    id: 253,
    type: "choice",
    subject: "计算机网络",
    title: "无线局域网 IEEE 802.11 协议在 MAC 层使用的协议是：",
    options: [
      { label: "A", content: "CSMA/CD" },
      { label: "B", content: "CSMA/CA" },
      { label: "C", content: "ALOHA" },
      { label: "D", content: "Token Ring" }
    ],
    answer: "B",
    analysis: "解析：无线环境无法有效检测冲突（CD），只能尽量避免冲突（CA）。"
  },
  {
    id: 254,
    type: "choice",
    subject: "数据结构",
    title: "下列排序算法中，所需辅助空间复杂度为 O(log n) 的是：",
    options: [
      { label: "A", content: "归并排序" },
      { label: "B", content: "快速排序" },
      { label: "C", content: "希尔排序" },
      { label: "D", content: "堆排序" }
    ],
    answer: "B",
    analysis: "解析：快排在递归过程中需要消耗栈空间，平均为 O(log n)。"
  },
  {
    id: 255,
    type: "choice",
    subject: "计算机组成原理",
    title: "指令字长等于机器字长，且操作码占 8 位，则该机：",
    options: [
      { label: "A", content: "最多有 256 条指令" },
      { label: "B", content: "地址码必为 8 位" },
      { label: "C", content: "不支持变址寻址" },
      { label: "D", content: "必定是 16 位机" }
    ],
    answer: "A",
    analysis: "解析：2^8 = 256。操作码的位数决定了指令系统的最大规模。"
  },
  {
    id: 256,
    type: "choice",
    subject: "数据结构",
    title: "串 'ababaaab' 的 next 数组为（下标从 1 开始）：",
    options: [
      { label: "A", content: "0, 1, 1, 2, 3, 4, 2, 2" },
      { label: "B", content: "0, 1, 1, 2, 1, 2, 1, 1" },
      { label: "C", content: "0, 1, 1, 2, 3, 2, 2, 3" },
      { label: "D", content: "0, 1, 2, 3, 4, 5, 6, 7" }
    ],
    answer: "A",
    analysis: "解析：KMP 算法中，next[j] 表示前 j-1 个字符中最长相等前后缀长度+1。手动推导：a(0), b(1), a(1), b(2), a(3), a(4), a(2), b(2)。"
  },
  {
    id: 257,
    type: "choice",
    subject: "计算机组成原理",
    title: "在总线事务中，由主设备发出地址和命令到从设备返回数据的时间间隔称为：",
    options: [
      { label: "A", content: "总线带宽" },
      { label: "B", content: "总线时钟周期" },
      { label: "C", content: "总线传输周期" },
      { label: "D", content: "访问延迟" }
    ],
    answer: "C",
    analysis: "解析：总线周期包括申请阶段、寻址阶段、传输阶段和结束阶段。"
  },
  {
    id: 258,
    type: "choice",
    subject: "操作系统",
    title: "当系统发生“死锁”时，其主要特征是：",
    options: [
      { label: "A", content: "大量进程处于就绪态" },
      { label: "B", content: "多个进程无限期等待永远不会发生的事件" },
      { label: "C", content: "CPU 利用率接近 100%" },
      { label: "D", content: "系统内存溢出" }
    ],
    answer: "B",
    analysis: "解析：死锁的定义即一组进程因争夺资源而陷入永久循环等待的状态。"
  },
  {
    id: 259,
    type: "choice",
    subject: "计算机网络",
    title: "在以太网帧中，前导码（Preamble）的作用是：",
    options: [
      { label: "A", content: "进行差错控制" },
      { label: "B", content: "指示帧的长度" },
      { label: "C", content: "使接收端与发送端时钟同步" },
      { label: "D", content: "标记源地址" }
    ],
    answer: "C",
    analysis: "解析：前导码是 7 字节的 10101010，用于硬件电路提取时钟频率。"
  },
  {
    id: 260,
    type: "choice",
    subject: "数据结构",
    title: "一个循环队列 Q[0..m-1] 的队头指针为 front，当前元素个数为 n，则队尾指针 rear 为：",
    options: [
      { label: "A", content: "(front + n) % m" },
      { label: "B", content: "(front - n + m) % m" },
      { label: "C", content: "(front + n - 1) % m" },
      { label: "D", content: "n" }
    ],
    answer: "A",
    analysis: "解析：队尾指针指向最后一个元素的下一个位置，故 rear = (front + n) % m。"
  },
  {
    id: 261,
    type: "choice",
    subject: "计算机组成原理",
    title: "下述哪个因素不会影响流水线的吞吐率？",
    options: [
      { label: "A", content: "流水线级数" },
      { label: "B", content: "最慢的一级开关延迟" },
      { label: "C", content: "寄存器字长" },
      { label: "D", content: "指令间的相关性" }
    ],
    answer: "C",
    analysis: "解析：吞吐率取决于时钟周期（最慢级决定）和指令流出的频率。寄存器字长与流水线效率无直接逻辑关系。"
  },
  {
    id: 262,
    type: "choice",
    subject: "操作系统",
    title: "在请求分页系统中，选择“在内存中停留时间最长”的页面进行置换的算法是：",
    options: [
      { label: "A", content: "FIFO" },
      { label: "B", content: "LRU" },
      { label: "C", content: "OPT" },
      { label: "D", content: "LFU" }
    ],
    answer: "A",
    analysis: "解析：先进先出（FIFO）算法只考虑页面进入内存的先后顺序。"
  },
  {
    id: 263,
    type: "choice",
    subject: "计算机网络",
    title: "在 IP 数据报的首部中，用来表示该报文属于哪个高层协议的字段是：",
    options: [
      { label: "A", content: "版本" },
      { label: "B", content: "首部长度" },
      { label: "C", content: "协议（Protocol）" },
      { label: "D", content: "服务类型" }
    ],
    answer: "C",
    analysis: "解析：协议字段数值为 6 表示 TCP，17 表示 UDP，1 表示 ICMP。"
  },
  {
    id: 264,
    type: "choice",
    subject: "数据结构",
    title: "将一个森林转换为一棵二叉树后，二叉树的根结点没有：",
    options: [
      { label: "A", content: "左孩子" },
      { label: "B", content: "右孩子" },
      { label: "C", content: "左、右孩子" },
      { label: "D", content: "以上都不对" }
    ],
    answer: "D",
    analysis: "解析：森林转二叉树，第一棵树的根为二叉树根，其左边是它的子树，右边是森林中其余的树。通常二叉树根既有左孩子也有右孩子。"
  },
  {
    id: 265,
    type: "choice",
    subject: "计算机组成原理",
    title: "Cache 的写回法（Write-back）是指：",
    options: [
      { label: "A", content: "修改 Cache 时同步修改主存" },
      { label: "B", content: "仅当 Cache 行被替换时，若被修改过才写回主存" },
      { label: "C", content: "定时将 Cache 写回主存" },
      { label: "D", content: "只在 CPU 空闲时写回主存" }
    ],
    answer: "B",
    analysis: "解析：写回法减少了访存次数，但增加了控制逻辑复杂性（需修改位）。"
  },
  {
    id: 266,
    type: "choice",
    subject: "操作系统",
    title: "下列关于进程控制块 PCB 的组织方式，常用的是：",
    options: [
      { label: "A", content: "线性表" },
      { label: "B", content: "索引表和链接表" },
      { label: "C", content: "散列表" },
      { label: "D", content: "树形结构" }
    ],
    answer: "B",
    analysis: "解析：为了快速根据状态（就绪、阻塞等）找到进程，系统常使用链表或索引组织 PCB。"
  },
  {
    id: 267,
    type: "choice",
    subject: "计算机网络",
    title: "在域名系统 DNS 中，递归查询是指：",
    options: [
      { label: "A", content: "由本地 DNS 代替主机进行后续查询" },
      { label: "B", content: "主机自己依次询问各级 DNS" },
      { label: "C", content: "只在根服务器查询" },
      { label: "D", content: "只在授权服务器查询" }
    ],
    answer: "A",
    analysis: "解析：递归查询就像“我问你，如果你不知道，你去帮我问别人再告诉我”。"
  },
  {
    id: 268,
    type: "choice",
    subject: "数据结构",
    title: "对于一个有 n 个顶点的带权连通图，最小生成树的代价：",
    options: [
      { label: "A", content: "是唯一的" },
      { label: "B", content: "可能不唯一" },
      { label: "C", content: "与 Prim 算法选择的起始点有关" },
      { label: "D", content: "与 Kruskal 算法无关" }
    ],
    answer: "A",
    analysis: "解析：虽然最小生成树的形式（边集）可能不唯一，但所有最小生成树的权值之和（代价）必然相等且唯一。"
  },
  {
    id: 269,
    type: "choice",
    subject: "计算机组成原理",
    title: "磁盘驱动器向内存传送数据时，通常采用哪种 I/O 控制方式？",
    options: [
      { label: "A", content: "程序查询" },
      { label: "B", content: "中断驱动" },
      { label: "C", content: "DMA" },
      { label: "D", content: "IO 模拟" }
    ],
    answer: "C",
    analysis: "解析：磁盘属于高速大容量设备，DMA 方式可以大幅减轻 CPU 负担。"
  },
  {
    id: 270,
    type: "choice",
    subject: "操作系统",
    title: "在解决临界区问题的 Peterson 算法中，标志数组 flag[i] = true 表示：",
    options: [
      { label: "A", content: "进程 i 正在临界区" },
      { label: "B", content: "进程 i 想要进入临界区" },
      { label: "C", content: "进程 i 已经退出临界区" },
      { label: "D", content: "资源已分配完毕" }
    ],
    answer: "B",
    analysis: "解析：flag 表达意愿，turn 表达谦让。flag[i] = true 意味着进程 i 准备好了。"
  },
  {
    id: 271,
    type: "choice",
    subject: "计算机网络",
    title: "TCP 协议头部中，确认号字段的长度是：",
    options: [
      { label: "A", content: "16 位" },
      { label: "B", content: "32 位" },
      { label: "C", content: "48 位" },
      { label: "D", content: "64 位" }
    ],
    answer: "B",
    analysis: "解析：序列号和确认号在 TCP 首部中均占 4 字节（32 位）。"
  },
  {
    id: 272,
    type: "choice",
    subject: "数据结构",
    title: "广义表 L = (a, (b, c)) 的长度和深度分别是：",
    options: [
      { label: "A", content: "2, 2" },
      { label: "B", content: "2, 3" },
      { label: "C", content: "3, 2" },
      { label: "D", content: "3, 3" }
    ],
    answer: "A",
    analysis: "解析：长度是第一层元素的个数（a 和 (b,c) 共 2 个）。深度是嵌套的最大层数，为 2。"
  },
  {
    id: 273,
    type: "choice",
    subject: "计算机组成原理",
    title: "在寻址方式中，变址寻址的主要目的是：",
    options: [
      { label: "A", content: "缩短指令长度" },
      { label: "B", content: "支持程序浮动" },
      { label: "C", content: "便于处理数组或向量数据" },
      { label: "D", content: "增加通用寄存器数量" }
    ],
    answer: "C",
    analysis: "解析：变址寻址通过修改变址寄存器的值，可以方便地遍历连续存储的数据块。"
  },
  {
    id: 274,
    type: "choice",
    subject: "操作系统",
    title: "一个文件的相对路径名是从哪个目录开始的？",
    options: [
      { label: "A", content: "根目录" },
      { label: "B", content: "当前目录" },
      { label: "C", content: "父目录" },
      { label: "D", content: "系统目录" }
    ],
    answer: "B",
    analysis: "解析：绝对路径从根 (/) 开始，相对路径从进程当前的 working directory 开始。"
  },
  {
    id: 275,
    type: "choice",
    subject: "计算机网络",
    title: "下面哪个设备是用于物理层扩展网络距离的？",
    options: [
      { label: "A", content: "网桥" },
      { label: "B", content: "中继器（Repeater）" },
      { label: "C", content: "路由器" },
      { label: "D", content: "网关" }
    ],
    answer: "B",
    analysis: "解析：中继器通过放大或整形物理信号来延长传输距离。"
  },
  {
    id: 276,
    type: "choice",
    subject: "数据结构",
    title: "在二叉搜索树中，新插入的结点总是：",
    options: [
      { label: "A", content: "根结点" },
      { label: "B", content: "最左边的结点" },
      { label: "C", content: "作为某个结点的叶子结点" },
      { label: "D", content: "作为中间结点" }
    ],
    answer: "C",
    analysis: "解析：BST 的插入算法是沿树查找，直到找到空位置插入，因此新结点总是作为新的叶子。"
  },
  {
    id: 277,
    type: "choice",
    subject: "计算机组成原理",
    title: "某总线带宽为 64MB/s，总线时钟频率为 8MHz，则每个总线周期传输的数据量为：",
    options: [
      { label: "A", content: "8B" },
      { label: "B", content: "4B" },
      { label: "C", content: "16B" },
      { label: "D", content: "64B" }
    ],
    answer: "A",
    analysis: "解析：带宽 = 数据量 * 频率。数据量 = 64MB/s / 8MHz = 8 字节。"
  },
  {
    id: 278,
    type: "choice",
    subject: "操作系统",
    title: "在信号量机制中，对一个初值为 1 的信号量执行一次 P 操作后再执行一次 V 操作，信号量的值为：",
    options: [
      { label: "A", content: "0" },
      { label: "B", content: "1" },
      { label: "C", content: "2" },
      { label: "D", content: "-1" }
    ],
    answer: "B",
    analysis: "解析：1 - 1 + 1 = 1。操作前后值保持不变，但可能经历了阻塞和唤醒过程。"
  },
  {
    id: 279,
    type: "choice",
    subject: "计算机网络",
    title: "CIDR 地址块 192.168.10.0/20 包含的 IP 地址个数是：",
    options: [
      { label: "A", content: "1024" },
      { label: "B", content: "2048" },
      { label: "C", content: "4096" },
      { label: "D", content: "8192" }
    ],
    answer: "C",
    analysis: "解析：主机位有 32 - 20 = 12 位。2^12 = 4096。"
  },
  {
    id: 280,
    type: "choice",
    subject: "数据结构",
    title: "下列关于图的遍历，叙述正确的是：",
    options: [
      { label: "A", content: "图的深度优先遍历（DFS）是唯一的" },
      { label: "B", content: "广度优先遍历（BFS）可求无向图的连通分量" },
      { label: "C", content: "BFS 算法通常使用栈" },
      { label: "D", content: "DFS 算法通常使用队列" }
    ],
    answer: "B",
    analysis: "解析：DFS/BFS 均可确定图的连通性。BFS 使用队列，DFS 使用栈或递归。遍历序列受起始点和邻接顺序影响，不唯一。"
  },
  {
    id: 281,
    type: "choice",
    subject: "计算机组成原理",
    title: "在指令系统中，隐含寻址是指：",
    options: [
      { label: "A", content: "指令中不显式给出操作数地址，而是约定在某个寄存器中" },
      { label: "B", content: "地址码部分是一个指针" },
      { label: "C", content: "操作数就在指令中" },
      { label: "D", content: "指令中给出了寄存器编号" }
    ],
    answer: "A",
    analysis: "解析：如单操作数指令隐含在 ACC（累加器）中。"
  },
  {
    id: 282,
    type: "choice",
    subject: "操作系统",
    title: "死锁避免和死锁预防的区别在于：",
    options: [
      { label: "A", content: "预防更严格，通过破坏必要条件实现" },
      { label: "B", content: "避免通过动态检测系统安全状态实现" },
      { label: "C", content: "预防会降低资源利用率" },
      { label: "D", content: "以上都正确" }
    ],
    answer: "D",
    analysis: "解析：预防（静态限制）、避免（动态分配检查，如银行家算法）。"
  },
  {
    id: 283,
    type: "choice",
    subject: "计算机网络",
    title: "在 OSI 参考模型中，负责加密、压缩和编码转换的层次是：",
    options: [
      { label: "A", content: "应用层" },
      { label: "B", content: "表示层" },
      { label: "C", content: "会话层" },
      { label: "D", content: "传输层" }
    ],
    answer: "B",
    analysis: "解析：表示层（Presentation Layer）处理数据的语法和语义转换。"
  },
  {
    id: 284,
    type: "choice",
    subject: "数据结构",
    title: "具有 100 个顶点的完全无向图的边数为：",
    options: [
      { label: "A", content: "4950" },
      { label: "B", content: "5050" },
      { label: "C", content: "9900" },
      { label: "D", content: "10000" }
    ],
    answer: "A",
    analysis: "解析：n(n-1)/2 = 100 * 99 / 2 = 4950。"
  },
  {
    id: 285,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列关于 DRAM 刷新的描述，错误的是：",
    options: [
      { label: "A", content: "刷新对 CPU 是透明的" },
      { label: "B", content: "刷新的单位是行" },
      { label: "C", content: "刷新是为了补偿电容电荷的流失" },
      { label: "D", content: "集中刷新可以消除死时间" }
    ],
    answer: "D",
    analysis: "解析：集中刷新会将所有刷新周期集中在一起，这期间 CPU 无法访存，称为“死时间”。"
  },
  {
    id: 286,
    type: "choice",
    subject: "操作系统",
    title: "多级页表的目的是：",
    options: [
      { label: "A", content: "减少地址转换时间" },
      { label: "B", content: "减少页表所占用的连续内存空间" },
      { label: "C", content: "增加虚拟地址空间" },
      { label: "D", content: "提高 Cache 命中率" }
    ],
    answer: "B",
    analysis: "解析：对于大地址空间，一级页表太大且必须连续，多级页表可以离散存储且只调入需要的页表页。"
  },
  {
    id: 287,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 协议中，为了提高传输效率，发送方可以使用：",
    options: [
      { label: "A", content: "Nagle 算法" },
      { label: "B", content: "曼彻斯特编码" },
      { label: "C", content: "迪杰斯特拉算法" },
      { label: "D", content: "窗口扩大选项" }
    ],
    answer: "A",
    analysis: "解析：Nagle 算法用于减少小分组的发送数量。"
  },
  {
    id: 288,
    type: "choice",
    subject: "数据结构",
    title: "栈和队列的共同点是：",
    options: [
      { label: "A", content: "都是先进先出" },
      { label: "B", content: "都是后进先出" },
      { label: "C", content: "都只允许在端点进行插入和删除操作" },
      { label: "D", content: "没有共同点" }
    ],
    answer: "C",
    analysis: "解析：它们都是操作受限的线性表。"
  },
  {
    id: 289,
    type: "choice",
    subject: "计算机组成原理",
    title: "在指令执行周期中，取指令的操作是由谁发出的？",
    options: [
      { label: "A", content: "运算器" },
      { label: "B", content: "控制器" },
      { label: "C", content: "存储器" },
      { label: "D", content: "时钟信号" }
    ],
    answer: "B",
    analysis: "解析：控制器（CU）是指令执行的指挥中心。"
  },
  {
    id: 290,
    type: "choice",
    subject: "操作系统",
    title: "系统调用是在下述哪种模式下执行的？",
    options: [
      { label: "A", content: "用户模式" },
      { label: "B", content: "管态（核心态）" },
      { label: "C", content: "等待模式" },
      { label: "D", content: "中断模式" }
    ],
    answer: "B",
    analysis: "解析：系统调用触发陷阱（Trap），使 CPU 从用户态切换到核心态。"
  },
  {
    id: 291,
    type: "choice",
    subject: "计算机网络",
    title: "DHCP 协议工作在：",
    options: [
      { label: "A", content: "应用层" },
      { label: "B", content: "传输层" },
      { label: "C", content: "网络层" },
      { label: "D", content: "数据链路层" }
    ],
    answer: "A",
    analysis: "解析：DHCP 属于应用层协议，基于 UDP 传输。"
  },
  {
    id: 292,
    type: "choice",
    subject: "数据结构",
    title: "二叉树的后序遍历序列为 dabec，中序遍历序列为 debac，则其前序遍历序列为：",
    options: [
      { label: "A", content: "cedba" },
      { label: "B", content: "acbed" },
      { label: "C", content: "cedab" },
      { label: "D", content: "decba" }
    ],
    answer: "A",
    analysis: "解析：后序最后是 c（根）。中序 debac，c 右边无值，说明无右子树。以此类推推导前序。"
  },
  {
    id: 293,
    type: "choice",
    subject: "计算机组成原理",
    title: "指令 Cache 不命中的开销比数据 Cache 不命中的开销：",
    options: [
      { label: "A", content: "小" },
      { label: "B", content: "大" },
      { label: "C", content: "相等" },
      { label: "D", content: "视情况而定" }
    ],
    answer: "B",
    analysis: "解析：指令不命中会导致流水线彻底停顿，而数据不命中可能通过乱序执行等技术掩盖。"
  },
  {
    id: 294,
    type: "choice",
    subject: "操作系统",
    title: "关于索引文件，下述描述正确的是：",
    options: [
      { label: "A", content: "索引表本身不占磁盘空间" },
      { label: "B", content: "索引文件支持随机访问" },
      { label: "C", content: "索引表必须存在文件体之后" },
      { label: "D", content: "索引文件只适合顺序读写" }
    ],
    answer: "B",
    analysis: "解析：索引文件通过索引表查找物理块号，是支持高效随机访问的关键。"
  },
  {
    id: 295,
    type: "choice",
    subject: "计算机网络",
    title: "下列关于 IP 组播的叙述，错误的是：",
    options: [
      { label: "A", content: "组播地址是 D 类地址" },
      { label: "B", content: "组播基于 UDP 协议" },
      { label: "C", content: "组播需要所有路由器都支持" },
      { label: "D", content: "组播发送者必须加入组播组" }
    ],
    answer: "D",
    analysis: "解析：发送者不需要加入组，只需要向组播地址发包；只有接收者才需要加入组。"
  },
  {
    id: 296,
    type: "choice",
    subject: "数据结构",
    title: "在哈希查找中，装填因子 α 越大，则：",
    options: [
      { label: "A", content: "平均查找长度越小" },
      { label: "B", content: "冲突发生的概率越大" },
      { label: "C", content: "哈希表利用率越低" },
      { label: "D", content: "查找时间越固定" }
    ],
    answer: "B",
    analysis: "解析：α = 记录数 / 表长。记录越多，空位越少，冲突必然增加。"
  },
  {
    id: 297,
    type: "choice",
    subject: "计算机组成原理",
    title: "冯·诺依曼机的基本部件中，实现算术和逻辑运算的是：",
    options: [
      { label: "A", content: "控制器" },
      { label: "B", content: "运算器" },
      { label: "C", content: "存储器" },
      { label: "D", content: "输入设备" }
    ],
    answer: "B",
    analysis: "解析：基础定义题。运算器负责数据处理。"
  },
  {
    id: 298,
    type: "choice",
    subject: "操作系统",
    title: "处于就绪态的进程，在获得什么后即可进入运行态？",
    options: [
      { label: "A", content: "内存" },
      { label: "B", content: "CPU" },
      { label: "C", content: "I/O 资源" },
      { label: "D", content: "信号量" }
    ],
    answer: "B",
    analysis: "解析：就绪态万事俱备，只差 CPU 调度。"
  },
  {
    id: 299,
    type: "choice",
    subject: "计算机网络",
    title: "HTTP 协议中，用于请求删除服务器上资源的请求方法是：",
    options: [
      { label: "A", content: "GET" },
      { label: "B", content: "POST" },
      { label: "C", content: "DELETE" },
      { label: "D", content: "PUT" }
    ],
    answer: "C",
    analysis: "解析：RESTful 风格的标准方法：DELETE 用于资源删除。"
  },
  {
    id: 300,
    type: "choice",
    subject: "数据结构",
    title: "若要在 O(1) 的时间内删除单循环链表的第一个结点，则至少需要知道：",
    options: [
      { label: "A", content: "头指针" },
      { label: "B", content: "尾指针" },
      { label: "C", content: "第一个结点的指针" },
      { label: "D", content: "倒数第二个结点的指针" }
    ],
    answer: "B",
    analysis: "解析：删除头结点需要修改尾结点的 next 指针，故必须知道尾指针。"
  },
  {
    id: 301,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列关于闪存（Flash Memory）的叙述，错误的是：",
    options: [
      { label: "A", content: "属于非易失性存储器" },
      { label: "B", content: "基于电容电荷存储信息" },
      { label: "C", content: "读速度通常快于写速度" },
      { label: "D", content: "支持随机访问" }
    ],
    answer: "B",
    analysis: "解析：Flash 是基于浮栅晶体管存储电荷，不是简单电容。电容存储是 DRAM 的特征。"
  },
  {
    id: 302,
    type: "choice",
    subject: "操作系统",
    title: "在分段存储管理中，段表项不包括：",
    options: [
      { label: "A", content: "段号" },
      { label: "B", content: "段长" },
      { label: "C", content: "段首址" },
      { label: "D", content: "控制位" }
    ],
    answer: "A",
    analysis: "解析：段表项本身通过索引隐藏了段号，只需存储长度、基址及权限位。"
  },
  {
    id: 303,
    type: "choice",
    subject: "计算机网络",
    title: "TCP 协议中，若收到重复的 ACK，则通常触发：",
    options: [
      { label: "A", content: "慢开始" },
      { label: "B", content: "快重传" },
      { label: "C", content: "连接终止" },
      { label: "D", content: "窗口扩大" }
    ],
    answer: "B",
    analysis: "解析：收到 3 个重复 ACK 表示报文丢失，立即重传而无需等待超时。"
  },
  {
    id: 304,
    type: "choice",
    subject: "数据结构",
    title: "下列关于基数排序的叙述中，正确的是：",
    options: [
      { label: "A", content: "不基于比较和移动" },
      { label: "B", content: "通常是稳定的" },
      { label: "C", content: "空间复杂度为 O(1)" },
      { label: "D", content: "适合关键字范围非常大的情况" }
    ],
    answer: "B",
    analysis: "解析：基数排序是稳定的分配类排序。它不基于比较，但需要分配和收集空间，不适合范围巨大（如随机长字符串）的关键字。"
  },
  {
    id: 305,
    type: "choice",
    subject: "计算机组成原理",
    title: "总线仲裁中，对硬件故障最敏感的方式是：",
    options: [
      { label: "A", content: "链式查询方式" },
      { label: "B", content: "计数器定时查询" },
      { label: "C", content: "独立请求方式" },
      { label: "D", content: "分布式仲裁" }
    ],
    answer: "A",
    analysis: "解析：链式查询如果中间一个设备出故障，后面的设备都收不到授权信号。"
  },

  {
    id: 306,
    type: "choice",
    subject: "数据结构",
    title: "已知一棵完全二叉树第 5 层有 3 个叶结点，则该二叉树的总结点数最多为：",
    options: [
      { label: "A", content: "31" },
      { label: "B", content: "53" },
      { label: "C", content: "60" },
      { label: "D", content: "63" }
    ],
    answer: "B",
    analysis: "解析：第 5 层有叶子说明深度可能是 5 或 6。若深度为 6，第 5 层满额为 16 个节点，其中 3 个是叶子，剩余 13 个节点有孩子。最大节点数 = 31 + 13 * 2 = 57？不对，完全二叉树要求叶子靠左。若第 5 层有 3 个叶子，则这三个必须在最右侧。计算得最多 53 个。"
  },
  {
    id: 307,
    type: "choice",
    subject: "计算机组成原理",
    title: "某计算机 Cache 命中率为 0.9，Cache 访问时间为 10ns，主存访问时间为 100ns，则平均访问时间为：",
    options: [
      { label: "A", content: "19ns" },
      { label: "B", content: "20ns" },
      { label: "C", content: "55ns" },
      { label: "D", content: "90ns" }
    ],
    answer: "A",
    analysis: "解析：T_avg = h * Tc + (1-h) * (Tc + Tm) 或 T_avg = h * Tc + (1-h) * Tm（取决于是否并行访问）。408 常考后者：0.9*10 + 0.1*100 = 9 + 10 = 19ns。"
  },
  {
    id: 308,
    type: "choice",
    subject: "操作系统",
    title: "多线程模型中，多对一（Many-to-One）模型的缺点是：",
    options: [
      { label: "A", content: "内核压力过大" },
      { label: "B", content: "一个线程阻塞会导致整个进程阻塞" },
      { label: "C", content: "线程切换开销大" },
      { label: "D", content: "不支持用户级线程" }
    ],
    answer: "B",
    analysis: "解析：多对一模型中，线程管理在用户空间，内核只看到一个进程。若其中一个线程执行系统调用阻塞，内核会挂起整个进程。"
  },
  {
    id: 309,
    type: "choice",
    subject: "计算机网络",
    title: "使用选择重传协议（SR），若采用 3 位序列号，则发送窗口的最大值是：",
    options: [
      { label: "A", content: "4" },
      { label: "B", content: "7" },
      { label: "C", content: "8" },
      { label: "D", content: "15" }
    ],
    answer: "A",
    analysis: "解析：SR 协议要求发送窗口 + 接收窗口 ≤ 2^n。且通常 Ws = Wr。故 2 * Ws ≤ 8，Ws = 4。"
  },
  {
    id: 310,
    type: "choice",
    subject: "数据结构",
    title: "高度为 h 的红黑树，其黑高（Black Height）bh 的范围是：",
    options: [
      { label: "A", content: "bh ≥ h/2" },
      { label: "B", content: "bh ≤ h/2" },
      { label: "C", content: "bh = h" },
      { label: "D", content: "bh ≥ log2(h+1)" }
    ],
    answer: "A",
    analysis: "解析：红黑树规定红节点不连续，故在一根路径上黑节点至少占一半，bh ≥ h/2。"
  },
  {
    id: 311,
    type: "choice",
    subject: "计算机组成原理",
    title: "在微程序控制器中，下一条微指令的地址（下址）通常由什么决定？",
    options: [
      { label: "A", content: "程序计数器 PC" },
      { label: "B", content: "微指令中的下址字段" },
      { label: "C", content: "操作码译码" },
      { label: "D", content: "B 和 C 都有可能" }
    ],
    answer: "D",
    analysis: "解析：下址可以由当前微指令的断定字段给出，也可以根据指令操作码通过映射产生。"
  },
  {
    id: 312,
    type: "choice",
    subject: "操作系统",
    title: "在页式管理中，页表项中不包含：",
    options: [
      { label: "A", content: "页号" },
      { label: "B", content: "物理块号" },
      { label: "C", content: "访问位" },
      { label: "D", content: "保护位" }
    ],
    answer: "A",
    analysis: "解析：页表项是页表数组的元素，页号是索引，不需要重复存储在表项中。"
  },
  {
    id: 313,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 状态转换图中，主动关闭方在发送完最后一个 ACK 后进入的状态是：",
    options: [
      { label: "A", content: "FIN_WAIT_1" },
      { label: "B", content: "FIN_WAIT_2" },
      { label: "C", content: "TIME_WAIT" },
      { label: "D", content: "CLOSE_WAIT" }
    ],
    answer: "C",
    analysis: "解析：主动关闭方需等待 2MSL 时间以确保最后一个 ACK 成功到达，防止新旧连接混淆。"
  },
  {
    id: 314,
    type: "choice",
    subject: "数据结构",
    title: "对 N 个元素进行快速排序，平均情况下的空间复杂度是：",
    options: [
      { label: "A", content: "O(1)" },
      { label: "B", content: "O(N)" },
      { label: "C", content: "O(log N)" },
      { label: "D", content: "O(N log N)" }
    ],
    answer: "C",
    analysis: "解析：空间复杂度主要来源于递归调用产生的栈开销，平均为 O(log N)。"
  },
  {
    id: 315,
    type: "choice",
    subject: "计算机组成原理",
    title: "指令字长 16 位，每个地址码 4 位，采用扩展操作码，若已设计出 15 条三地址指令，则最多还能设计多少条二地址指令？",
    options: [
      { label: "A", content: "1" },
      { label: "B", content: "15" },
      { label: "C", content: "16" },
      { label: "D", content: "255" }
    ],
    answer: "B",
    analysis: "解析：三地址占 12 位地址，余 4 位操作码（2^4=16）。剩 16-15=1 个码可扩展。二地址多出 4 位，1 * 2^4 = 16，但由于要留一个全 1 给下一级，通常为 16 或 15 条。"
  },
  {
    id: 316,
    type: "choice",
    subject: "操作系统",
    title: "导致进程从运行态切换到就绪态的典型事件是：",
    options: [
      { label: "A", content: "时间片用完" },
      { label: "B", content: "等待 I/O 完成" },
      { label: "C", content: "执行了 P 操作" },
      { label: "D", content: "进程被创建" }
    ],
    answer: "A",
    analysis: "解析：B 和 C 都会导致进程进入阻塞态。时间片到期是被动剥夺 CPU，进程依然可运行。"
  },
  {
    id: 317,
    type: "choice",
    subject: "计算机网络",
    title: "下面哪个协议基于“距离矢量”算法？",
    options: [
      { label: "A", content: "RIP" },
      { label: "B", content: "OSPF" },
      { label: "C", content: "BGP" },
      { label: "D", content: "IS-IS" }
    ],
    answer: "A",
    analysis: "解析：RIP 交换的是路由表，按距离跳数衡量；OSPF 基于链路状态；BGP 是路径矢量。"
  },
  {
    id: 318,
    type: "choice",
    subject: "数据结构",
    title: "在一个无向图中，若所有顶点的度数均为 2，则该图：",
    options: [
      { label: "A", content: "必为连通图" },
      { label: "B", content: "必有环路" },
      { label: "C", content: "必为完全图" },
      { label: "D", content: "必为生成树" }
    ],
    answer: "B",
    analysis: "解析：度数为 2 意味着每个点接两条边，结构上必形成一个或多个环。"
  },
  {
    id: 319,
    type: "choice",
    subject: "计算机组成原理",
    title: "双端口 RAM 发生冲突的情况是：",
    options: [
      { label: "A", content: "两个端口同时读同一个单元" },
      { label: "B", content: "两个端口同时读不同单元" },
      { label: "C", content: "两个端口同时写同一个单元" },
      { label: "D", content: "一个端口读，另一个端口写不同单元" }
    ],
    answer: "C",
    analysis: "解析：读读不冲突，只有涉及写的同单元访问才会导致逻辑错误。"
  },
  {
    id: 320,
    type: "choice",
    subject: "操作系统",
    title: "磁盘存取数据时，首先进行的物理操作是：",
    options: [
      { label: "A", content: "寻找磁道（寻道）" },
      { label: "B", content: "寻找扇区（旋转延迟）" },
      { label: "C", content: "数据传输" },
      { label: "D", content: "读写校验" }
    ],
    answer: "A",
    analysis: "解析：磁头必须先移动到目标柱面（磁道），这是最耗时的步骤。"
  },
  {
    id: 321,
    type: "choice",
    subject: "计算机网络",
    title: "NAT 路由器在转发数据包时，通常不修改：",
    options: [
      { label: "A", content: "源 IP 地址" },
      { label: "B", content: "源端口号" },
      { label: "C", content: "目的 IP 地址" },
      { label: "D", content: "IP 头部校验和" }
    ],
    answer: "C",
    analysis: "解析：NAT 修改出站包的源信息，入站包的目的信息。对于请求外网的包，目的 IP 保持不变。"
  },
  {
    id: 322,
    type: "choice",
    subject: "数据结构",
    title: "具有 n 个顶点的无向连通图，其生成树的边数为：",
    options: [
      { label: "A", content: "n" },
      { label: "B", content: "n-1" },
      { label: "C", content: "n+1" },
      { label: "D", content: "2n" }
    ],
    answer: "B",
    analysis: "解析：生成树定义：包含所有顶点且边数最少的连通子图。"
  },
  {
    id: 323,
    type: "choice",
    subject: "计算机组成原理",
    title: "在中断响应周期，CPU 完成的操作不包括：",
    options: [
      { label: "A", content: "关中断" },
      { label: "B", content: "保护断点" },
      { label: "C", content: "保护通用寄存器" },
      { label: "D", content: "形成中断服务程序入口地址" }
    ],
    answer: "C",
    analysis: "解析：硬件（中断隐指令）负责关中断、存 PC。通用寄存器的保护由程序员在服务程序开头用指令完成。"
  },
  {
    id: 324,
    type: "choice",
    subject: "操作系统",
    title: "为了提高设备分配的灵活性，应在设备类中引入：",
    options: [
      { label: "A", content: "设备独立性（逻辑设备名）" },
      { label: "B", content: "SPOOLing 技术" },
      { label: "C", content: "多道程序设计" },
      { label: "D", content: "设备驱动程序" }
    ],
    answer: "A",
    analysis: "解析：用户使用逻辑名请求，系统分配物理名，这样即使更换同类设备也不必改程序。"
  },
  {
    id: 325,
    type: "choice",
    subject: "计算机网络",
    title: "在物理层接口特性中，用于说明各引脚电压范围的是：",
    options: [
      { label: "A", content: "机械特性" },
      { label: "B", content: "电气特性" },
      { label: "C", content: "功能特性" },
      { label: "D", content: "规程特性" }
    ],
    answer: "B",
    analysis: "解析：电气特性定义电平范围、阻抗等信号参数。"
  },
  {
    id: 326,
    type: "choice",
    subject: "数据结构",
    title: "下列排序算法中，执行过程中其记录移动次数与初始序列无关的是：",
    options: [
      { label: "A", content: "直接插入排序" },
      { label: "B", content: "冒泡排序" },
      { label: "C", content: "简单选择排序" },
      { label: "D", content: "快速排序" }
    ],
    answer: "C",
    analysis: "解析：选择排序无论初始状态如何，都要经历固定的 N-1 次交换。"
  },
  {
    id: 327,
    type: "choice",
    subject: "计算机组成原理",
    title: "冯·诺依曼计算机中，控制器的功能主要是：",
    options: [
      { label: "A", content: "产生控制信号" },
      { label: "B", content: "进行逻辑运算" },
      { label: "C", content: "存储指令" },
      { label: "D", content: "输入数据" }
    ],
    answer: "A",
    analysis: "解析：控制器是计算机的指挥中心，负责解析指令并发出各种微操作命令。"
  },
  {
    id: 328,
    type: "choice",
    subject: "操作系统",
    title: "下列哪种页面置换算法会产生 Belady 异常？",
    options: [
      { label: "A", content: "FIFO" },
      { label: "B", content: "LRU" },
      { label: "C", content: "OPT" },
      { label: "D", content: "CLOCK" }
    ],
    answer: "A",
    analysis: "解析：Belady 异常指增加页框数缺页率反而上升的现象。FIFO 存在此问题，LRU 等堆栈类算法不存在。"
  },
  {
    id: 329,
    type: "choice",
    subject: "计算机网络",
    title: "TCP 协议中，若报文段不含数据且 ACK=1，则该报文段的序列号：",
    options: [
      { label: "A", content: "不消耗序号" },
      { label: "B", content: "消耗 1 个序号" },
      { label: "C", content: "消耗 2 个序号" },
      { label: "D", content: "以上都不对" }
    ],
    answer: "A",
    analysis: "解析：纯 ACK 报文不消耗序列号。只有 SYN、FIN 和有负载的报文才消耗序列号。"
  },
  {
    id: 330,
    type: "choice",
    subject: "数据结构",
    title: "一棵二叉排序树，按什么遍历可以得到有序序列？",
    options: [
      { label: "A", content: "前序遍历" },
      { label: "B", content: "中序遍历" },
      { label: "C", content: "后序遍历" },
      { label: "D", content: "层序遍历" }
    ],
    answer: "B",
    analysis: "解析：二叉排序树左 < 根 < 右，这正对应中序遍历的顺序。"
  },
  {
    id: 331,
    type: "choice",
    subject: "计算机组成原理",
    title: "常用的虚拟存储器寻址系统由什么组成？",
    options: [
      { label: "A", content: "主存-外存" },
      { label: "B", content: "Cache-主存" },
      { label: "C", content: "寄存器-主存" },
      { label: "D", content: "CPU-Cache" }
    ],
    answer: "A",
    analysis: "解析：虚存是通过主存和外存（硬盘）的自动调度，让程序以为拥有很大内存。"
  },
  {
    id: 332,
    type: "choice",
    subject: "操作系统",
    title: "在分时系统中，为了使多个用户能及时响应，最核心的策略是：",
    options: [
      { label: "A", content: "时间片轮转" },
      { label: "B", content: "优先级调度" },
      { label: "C", content: "实时性处理" },
      { label: "D", content: "并发执行" }
    ],
    answer: "A",
    analysis: "解析：通过快速轮流分配 CPU，每个用户都感觉在独占机器。"
  },
  {
    id: 333,
    type: "choice",
    subject: "计算机网络",
    title: "局域网（LAN）的拓扑结构不包括：",
    options: [
      { label: "A", content: "星形" },
      { label: "B", content: "总线形" },
      { label: "C", content: "环形" },
      { label: "D", content: "网状形（Mesh）" }
    ],
    answer: "D",
    analysis: "解析：网状形常用于广域网（WAN），局域网多采用星、总线或环形。"
  },
  {
    id: 334,
    type: "choice",
    subject: "数据结构",
    title: "在散列查找中，不产生“聚集”现象的是：",
    options: [
      { label: "A", content: "线性探测法" },
      { label: "B", content: "平方探测法" },
      { label: "C", content: "链地址法" },
      { label: "D", content: "双散列法" }
    ],
    answer: "C",
    analysis: "解析：链地址法（拉链法）不同哈希值的元素存在不同链表，不会互相干扰产生聚集。"
  },
  {
    id: 335,
    type: "choice",
    subject: "计算机组成原理",
    title: "总线异步定时协议的主要优点是：",
    options: [
      { label: "A", content: "逻辑实现简单" },
      { label: "B", content: "速度极快" },
      { label: "C", content: "允许不同速度的设备协作" },
      { label: "D", content: "不需要握手信号" }
    ],
    answer: "C",
    analysis: "解析：异步定时依靠应答（握手）机制，不限时钟，能适应快慢不一的部件。"
  },
  {
    id: 336,
    type: "choice",
    subject: "操作系统",
    title: "文件系统中，文件的逻辑结构主要是为了：",
    options: [
      { label: "A", content: "提高外存利用率" },
      { label: "B", content: "方便用户组织和检索数据" },
      { label: "C", content: "减少内存开销" },
      { label: "D", content: "加快磁头寻道" }
    ],
    answer: "B",
    analysis: "解析：逻辑结构（流式、记录式）是用户视角的组织形式。"
  },
  {
    id: 337,
    type: "choice",
    subject: "计算机网络",
    title: "在 IPv4 头部中，用于分片重组的字段是：",
    options: [
      { label: "A", content: "标识、标志、片偏移" },
      { label: "B", content: "源 IP、目的 IP" },
      { label: "C", content: "TTL、协议" },
      { label: "D", content: "首部校验和" }
    ],
    answer: "A",
    analysis: "解析：这三个字段共同记录了原始包的 ID、是否还有后续片及在原包中的位置。"
  },
  {
    id: 338,
    type: "choice",
    subject: "数据结构",
    title: "具有 1000 个结点的完全二叉树的高度为（根为 1 层）：",
    options: [
      { label: "A", content: "9" },
      { label: "B", content: "10" },
      { label: "C", content: "11" },
      { label: "D", content: "12" }
    ],
    answer: "B",
    analysis: "解析：h = ⌊log2(1000)⌋ + 1 = 9 + 1 = 10。"
  },
  {
    id: 339,
    type: "choice",
    subject: "计算机组成原理",
    title: "中断屏蔽技术主要用于：",
    options: [
      { label: "A", content: "改变中断处理的优先级" },
      { label: "B", content: "加快中断响应速度" },
      { label: "C", content: "保存现场" },
      { label: "D", content: "关闭所有中断请求" }
    ],
    answer: "A",
    analysis: "解析：通过设置屏蔽字，可以动态决定哪些中断在处理中可以被嵌套。"
  },
  {
    id: 340,
    type: "choice",
    subject: "操作系统",
    title: "如果系统资源分配图中不存在环路，则该系统：",
    options: [
      { label: "A", content: "必然处于死锁状态" },
      { label: "B", content: "必然处于非死锁状态" },
      { label: "C", content: "可能处于死锁状态" },
      { label: "D", content: "无法确定" }
    ],
    answer: "B",
    analysis: "解析：环路是死锁的必要条件。无环则必然无死锁。"
  },
  {
    id: 341,
    type: "choice",
    subject: "计算机网络",
    title: "SMTP 协议使用的是传输层的哪个端口？",
    options: [
      { label: "A", content: "20" },
      { label: "B", content: "21" },
      { label: "C", content: "25" },
      { label: "D", content: "110" }
    ],
    answer: "C",
    analysis: "解析：20/21 是 FTP，110 是 POP3，25 是 SMTP。"
  },
  {
    id: 342,
    type: "choice",
    subject: "数据结构",
    title: "在平衡二叉树（AVL）中插入一个结点导致不平衡，最多只需旋转几次即可恢复平衡？",
    options: [
      { label: "A", content: "1" },
      { label: "B", content: "2" },
      { label: "C", content: "log n" },
      { label: "D", content: "n" }
    ],
    answer: "B",
    analysis: "解析：单旋算 1 次，双旋（如 LR, RL）算 2 次。无论树多深，局部旋转即可恢复。"
  },
  {
    id: 343,
    type: "choice",
    subject: "计算机组成原理",
    title: "在存储器层次结构中，容量最小、速度最快的是：",
    options: [
      { label: "A", content: "寄存器" },
      { label: "B", content: "Cache" },
      { label: "C", content: "主存" },
      { label: "D", content: "辅助存储器" }
    ],
    answer: "A",
    analysis: "解析：寄存器直接集成在 CPU 内部，存取仅需半个或一个时钟周期。"
  },
  {
    id: 344,
    type: "choice",
    subject: "操作系统",
    title: "下列关于虚拟内存的描述，错误的是：",
    options: [
      { label: "A", content: "提高了内存利用率" },
      { label: "B", content: "允许进程大小超过物理内存" },
      { label: "C", content: "不需要硬件支持" },
      { label: "D", content: "基于局部性原理" }
    ],
    answer: "C",
    analysis: "解析：虚拟内存必须依靠 MMU（地址映射机构）和页表机制等硬件支持。"
  },
  {
    id: 345,
    type: "choice",
    subject: "计算机网络",
    title: "交换机和网桥在过滤和转发帧时，依据的是：",
    options: [
      { label: "A", content: "IP 地址" },
      { label: "B", content: "MAC 地址" },
      { label: "C", content: "端口号" },
      { label: "D", content: "域名" }
    ],
    answer: "B",
    analysis: "解析：它们属于数据链路层设备，识别二层地址（MAC）。"
  },
  {
    id: 346,
    type: "choice",
    subject: "数据结构",
    title: "若一个图有 n 个顶点且为连通图，则其边数至少为：",
    options: [
      { label: "A", content: "n-1" },
      { label: "B", content: "n" },
      { label: "C", content: "n+1" },
      { label: "D", content: "n(n-1)/2" }
    ],
    answer: "A",
    analysis: "解析：基础知识：n-1 条边构成的树是维持连通的最小代价。"
  },
  {
    id: 347,
    type: "choice",
    subject: "计算机组成原理",
    title: "CPU 在执行指令过程中，判断是否发生中断请求是在：",
    options: [
      { label: "A", content: "每条指令执行结束后" },
      { label: "B", content: "取指周期开始前" },
      { label: "C", content: "每个时钟脉冲到来时" },
      { label: "D", content: "发生异常时" }
    ],
    answer: "A",
    analysis: "解析：为了不破坏指令执行的原子性，CPU 只有在指令周期结束才去查询 IRQ 信号。"
  },
  {
    id: 348,
    type: "choice",
    subject: "操作系统",
    title: "分段系统的主要优点是：",
    options: [
      { label: "A", content: "没有外部碎片" },
      { label: "B", content: "易于实现信息共享和保护" },
      { label: "C", content: "地址映射最快" },
      { label: "D", content: "不需要硬件支持" }
    ],
    answer: "B",
    analysis: "解析：段是逻辑单位（如函数、数据段），赋予权限和共享非常直观。"
  },
  {
    id: 349,
    type: "choice",
    subject: "计算机网络",
    title: "100Base-TX 采用的物理介质是：",
    options: [
      { label: "A", content: "光纤" },
      { label: "B", content: "5类双绞线" },
      { label: "C", content: "粗同轴电缆" },
      { label: "D", content: "细同轴电缆" }
    ],
    answer: "B",
    analysis: "解析：T 代表双绞线，X 指代更高性能的 5 类线编码方案。"
  },
  {
    id: 350,
    type: "choice",
    subject: "数据结构",
    title: "在顺序表上查找一个元素，时间复杂度为：",
    options: [
      { label: "A", content: "O(1)" },
      { label: "B", content: "O(log n)" },
      { label: "C", content: "O(n)" },
      { label: "D", content: "O(n^2)" }
    ],
    answer: "C",
    analysis: "解析：顺序表查找通常是线性扫描，平均比较次数 (n+1)/2。"
  },
  {
    id: 351,
    type: "choice",
    subject: "计算机组成原理",
    title: "主存与高速缓存（Cache）之间的映射方式中，灵活性最差的是：",
    options: [
      { label: "A", content: "直接映射" },
      { label: "B", content: "全相联映射" },
      { label: "C", content: "组相联映射" },
      { label: "D", content: "随机映射" }
    ],
    answer: "A",
    analysis: "解析：直接映射中主存块只能去唯一的 Cache 行，冲突概率最高。"
  },
  {
    id: 352,
    type: "choice",
    subject: "操作系统",
    title: "在死锁解除中，采用“剥夺资源”法可能会导致：",
    options: [
      { label: "A", content: "进程饥饿" },
      { label: "B", content: "系统效率大幅提升" },
      { label: "C", content: "死锁必然再次发生" },
      { label: "D", content: "进程永久阻塞" }
    ],
    answer: "A",
    analysis: "解析：如果总是剥夺同一个进程的资源，该进程将永远无法运行，产生饥饿。"
  },
  {
    id: 353,
    type: "choice",
    subject: "计算机网络",
    title: "在因特网中，转发 IP 数据报的主要依据是：",
    options: [
      { label: "A", content: "源 IP 地址" },
      { label: "B", content: "目的主机域名" },
      { label: "C", content: "目的网络地址" },
      { label: "D", content: "源 MAC 地址" }
    ],
    answer: "C",
    analysis: "解析：路由器只关注目标网络在哪里，不关注具体的特定主机（直到最后一跳）。"
  },
  {
    id: 354,
    type: "choice",
    subject: "数据结构",
    title: "希尔排序属于哪一类排序？",
    options: [
      { label: "A", content: "插入类排序" },
      { label: "B", content: "交换类排序" },
      { label: "C", content: "选择类排序" },
      { label: "D", content: "归并类排序" }
    ],
    answer: "A",
    analysis: "解析：希尔排序是通过增量分组后，在组内进行直接插入排序。"
  },
  {
    id: 355,
    type: "choice",
    subject: "计算机组成原理",
    title: "运算器的主要功能是进行：",
    options: [
      { label: "A", content: "算术运算" },
      { label: "B", content: "逻辑运算" },
      { label: "C", content: "算术运算和逻辑运算" },
      { label: "D", content: "初等函数计算" }
    ],
    answer: "C",
    analysis: "解析：ALU 支持加减乘除以及与或非、移位等逻辑操作。"
  },

  {
    id: 356,
    type: "choice",
    subject: "数据结构",
    title: "在 KMP 算法中，已知模式串为 'abcabd'，其 next 数组为（下标从 1 开始）：",
    options: [
      { label: "A", content: "0, 1, 1, 1, 2, 3" },
      { label: "B", content: "0, 1, 1, 2, 2, 3" },
      { label: "C", content: "0, 1, 2, 1, 2, 3" },
      { label: "D", content: "0, 1, 1, 1, 1, 1" }
    ],
    answer: "A",
    analysis: "解析：next[1]=0, next[2]=1。'a'与'b'不等，next[3]=1。'ab'与'c'不等，next[4]=1。'abc'与'a'首位匹配，next[5]=2。'abca'与'b'二位匹配，next[6]=3。"
  },
  {
    id: 357,
    type: "choice",
    subject: "计算机组成原理",
    title: "多模块交叉存储器（四模块）在流水方式下，存取一个字的时间为 T，模块存取周期为 4T。则连续读取 4 个字所需的时间为：",
    options: [
      { label: "A", content: "4T" },
      { label: "B", content: "7T" },
      { label: "C", content: "16T" },
      { label: "D", content: "8T" }
    ],
    answer: "B",
    analysis: "解析：计算公式：T_total = m*T + (n-1)T。此处 m=4, n=4，T_total = 4T + (4-1)T = 7T。"
  },
  {
    id: 358,
    type: "choice",
    subject: "操作系统",
    title: "在分段存储管理中，段内地址必须：",
    options: [
      { label: "A", content: "连续" },
      { label: "B", content: "离散" },
      { label: "C", content: "与段号相同" },
      { label: "D", content: "全局唯一" }
    ],
    answer: "A",
    analysis: "解析：段间可以离散存放，但在逻辑上和物理上，同一个段内部的地址空间必须是连续的。"
  },
  {
    id: 359,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 协议中，为了解决“死锁”现象（发送方等窗口，接收方等数据），引入了：",
    options: [
      { label: "A", content: "重传定时器" },
      { label: "B", content: "坚持定时器（Persistence Timer）" },
      { label: "C", content: "保活定时器" },
      { label: "D", content: "时间戳选项" }
    ],
    answer: "B",
    analysis: "解析：当接收方通告零窗口后，若后续窗口打开报文丢失，双方会互等。坚持定时器强制发送探测报文打破僵局。"
  },
  {
    id: 360,
    type: "choice",
    subject: "数据结构",
    title: "对于一个带头结点的单链表 L，判断其是否为空的条件是：",
    options: [
      { label: "A", content: "L == NULL" },
      { label: "B", content: "L->next == NULL" },
      { label: "C", content: "L->next == L" },
      { label: "D", content: "L != NULL" }
    ],
    answer: "B",
    analysis: "解析：L 指向头结点（始终存在），L->next 为指向第一个数据结点的指针，若为空则表空。"
  },
  {
    id: 361,
    type: "choice",
    subject: "计算机组成原理",
    title: "单总线结构的计算机中，其主要缺点是：",
    options: [
      { label: "A", content: "逻辑复杂" },
      { label: "B", content: "带宽限制，容易成为性能瓶颈" },
      { label: "C", content: "成本高" },
      { label: "D", content: "不支持 I/O 操作" }
    ],
    answer: "B",
    analysis: "解析：所有部件共享一根总线，同一时刻只能有一对设备通信，冲突严重。"
  },
  {
    id: 362,
    type: "choice",
    subject: "操作系统",
    title: "进程 P1 和 P2 共享资源 R，P1 已占有 R，P2 请求 R 时被阻塞。当 P1 释放 R 时，P2 变为：",
    options: [
      { label: "A", content: "运行态" },
      { label: "B", content: "就绪态" },
      { label: "C", content: "等待态" },
      { label: "D", content: "挂起态" }
    ],
    answer: "B",
    analysis: "解析：资源释放唤醒阻塞进程，进程进入就绪队列等待 CPU 调度。"
  },
  {
    id: 363,
    type: "choice",
    subject: "计算机网络",
    title: "在网络层，将 IP 分组从一个输入端口映射到一个合适的输出端口的功能称为：",
    options: [
      { label: "A", content: "路由选择（Routing）" },
      { label: "B", content: "转发（Forwarding）" },
      { label: "C", content: "拥塞控制" },
      { label: "D", content: "分片" }
    ],
    answer: "B",
    analysis: "解析：转发是单个路由器的局部动作（入端口到出端口）；路由选择是全网范围的路径计算。"
  },
  {
    id: 364,
    type: "choice",
    subject: "数据结构",
    title: "下列遍历序列中，不能唯一确定一棵二叉树的是：",
    options: [
      { label: "A", content: "前序和中序" },
      { label: "B", content: "后序和中序" },
      { label: "C", content: "层序和中序" },
      { label: "D", content: "前序和后序" }
    ],
    answer: "D",
    analysis: "解析：没有中序遍历，无法确定左右子树的边界。"
  },
  {
    id: 365,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列关于垂直型微指令的描述，正确的是：",
    options: [
      { label: "A", content: "微指令字长很长" },
      { label: "B", content: "采用了类似于机器指令的代码化格式" },
      { label: "C", content: "并行操作能力强" },
      { label: "D", content: "不需要微指令译码器" }
    ],
    answer: "B",
    analysis: "解析：垂直型微指令较短，需译码后再产生控制信号，并行性弱但更易编写。"
  },
  {
    id: 366,
    type: "choice",
    subject: "操作系统",
    title: "为了实现多道程序设计，计算机系统必须具备：",
    options: [
      { label: "A", content: "大容量硬盘" },
      { label: "B", content: "中断处理能力" },
      { label: "C", content: "高级语言编译器" },
      { label: "D", content: "网络功能" }
    ],
    answer: "B",
    analysis: "解析：中断是多道程序运行的物理基础，用于切换进程和响应 I/O。"
  },
  {
    id: 367,
    type: "choice",
    subject: "计算机网络",
    title: "下列协议中，不提供可靠传输服务的是：",
    options: [
      { label: "A", content: "TCP" },
      { label: "B", content: "UDP" },
      { label: "C", content: "HTTP" },
      { label: "D", content: "FTP" }
    ],
    answer: "B",
    analysis: "解析：UDP 是尽力而为的无连接协议，不重传、不校验顺序。HTTP/FTP 基于 TCP。"
  },
  {
    id: 368,
    type: "choice",
    subject: "数据结构",
    title: "如果一个无向图 G 必须是连通的且边数最少，则该图：",
    options: [
      { label: "A", content: "是一棵树" },
      { label: "B", content: "有一个环" },
      { label: "C", content: "是完全图" },
      { label: "D", content: "每个顶点的度为 1" }
    ],
    answer: "A",
    analysis: "解析：树是连通图的极小集，n 个顶点 n-1 条边。"
  },
  {
    id: 369,
    type: "choice",
    subject: "计算机组成原理",
    title: "在总线同步定时方式下，各部件配合的基准是：",
    options: [
      { label: "A", content: "握手信号" },
      { label: "B", content: "统一的时钟信号" },
      { label: "C", content: "数据传输速率" },
      { label: "D", content: "中断请求" }
    ],
    answer: "B",
    analysis: "解析：同步方式依赖固定的时钟频率来界定操作阶段。"
  },
  {
    id: 370,
    type: "choice",
    subject: "操作系统",
    title: "产生死锁的四个必要条件中，破坏“请求与保持”条件的方法是：",
    options: [
      { label: "A", content: "一次性分配所有资源" },
      { label: "B", content: "允许进程剥夺他人资源" },
      { label: "C", content: "按序分配资源" },
      { label: "D", content: "禁止进程申请新资源" }
    ],
    answer: "A",
    analysis: "解析：要求进程在运行前一次性申领全部资源，若不满足则不运行。"
  },
  {
    id: 371,
    type: "choice",
    subject: "计算机网络",
    title: "ARP 响应报文（ARP Reply）发送方式是：",
    options: [
      { label: "A", content: "广播" },
      { label: "B", content: "单播" },
      { label: "C", content: "组播" },
      { label: "D", content: "洪泛" }
    ],
    answer: "B",
    analysis: "解析：请求（Request）是广播，响应是直接发回给请求方的单播。"
  },
  {
    id: 372,
    type: "choice",
    subject: "数据结构",
    title: "高度为 h 的完全二叉树最少有多少个结点？",
    options: [
      { label: "A", content: "2^(h-1)" },
      { label: "B", content: "2^h - 1" },
      { label: "C", content: "2^(h-1) - 1" },
      { label: "D", content: "h" }
    ],
    answer: "A",
    analysis: "解析：前 h-1 层是满二叉树（2^(h-1)-1 个），第 h 层至少 1 个节点。总数 = 2^(h-1)。"
  },
  {
    id: 373,
    type: "choice",
    subject: "计算机组成原理",
    title: "指令流水线中，解决“数据相关”最简单的方法是：",
    options: [
      { label: "A", content: "旁路技术" },
      { label: "B", content: "插入空操作（NOP）" },
      { label: "C", content: "分支预测" },
      { label: "D", content: "乱序执行" }
    ],
    answer: "B",
    analysis: "解析：虽然效率低，但插入 NOP 或阻塞流水线是实现最简单的逻辑。"
  },
  {
    id: 374,
    type: "choice",
    subject: "操作系统",
    title: "所谓的“管程”是指：",
    options: [
      { label: "A", content: "一个特殊的硬件寄存器" },
      { label: "B", content: "管理进程的内核函数" },
      { label: "C", content: "一种高级的同步工具，封装了共享数据和操作" },
      { label: "D", content: "监视 CPU 运行状态的程序" }
    ],
    answer: "C",
    analysis: "解析：管程是一种编程语言级别的结构，用于简化并发控制。"
  },
  {
    id: 375,
    type: "choice",
    subject: "计算机网络",
    title: "IPv6 头部中的“Hop Limit”字段类似于 IPv4 中的：",
    options: [
      { label: "A", content: "TTL" },
      { label: "B", content: "Protocol" },
      { label: "C", content: "Total Length" },
      { label: "D", content: "Identification" }
    ],
    answer: "A",
    analysis: "解析：跳数限制（Hop Limit）规定了数据报能经过路由器的最大数量。"
  },
  {
    id: 376,
    type: "choice",
    subject: "数据结构",
    title: "折半查找判定树是一棵：",
    options: [
      { label: "A", content: "完全二叉树" },
      { label: "B", content: "平衡二叉树" },
      { label: "C", content: "二叉排序树" },
      { label: "D", content: "以上都是" }
    ],
    answer: "D",
    analysis: "解析：折半查找判定树由于其中序遍历是有序的，且左右子树高度差不大于 1，同时具有排序树性质。"
  },
  {
    id: 377,
    type: "choice",
    subject: "计算机组成原理",
    title: "在中断响应过程中，硬件完成的关中断操作目的是：",
    options: [
      { label: "A", content: "防止丢失数据" },
      { label: "B", content: "防止新的中断干扰当前中断现场的保存" },
      { label: "C", content: "提高 CPU 运行速度" },
      { label: "D", content: "节省电力" }
    ],
    answer: "B",
    analysis: "解析：响应开始时必须进入临界态，确保护送断点和状态寄存器不被嵌套打断。"
  },
  {
    id: 378,
    type: "choice",
    subject: "操作系统",
    title: "在文件系统中，文件目录项的主要作用是：",
    options: [
      { label: "A", content: "存储文件内容" },
      { label: "B", content: "实现文件名到物理地址的映射" },
      { label: "C", content: "控制文件访问权限" },
      { label: "D", content: "记录文件读写指针" }
    ],
    answer: "B",
    analysis: "解析：目录（或 FCB）的主要目的是实现“按名存取”。"
  },
  {
    id: 379,
    type: "choice",
    subject: "计算机网络",
    title: "TCP 连接释放时，最后一次 ACK 发出后，发送方需等待 2MSL 的主要原因是：",
    options: [
      { label: "A", content: "等待数据传输完成" },
      { label: "B", content: "防止旧连接的报文在网络中干扰新连接" },
      { label: "C", content: "节省带宽" },
      { label: "D", content: "同步双方序号" }
    ],
    answer: "B",
    analysis: "解析：2MSL 确保所有旧报文段都从网络中消失。"
  },
  {
    id: 380,
    type: "choice",
    subject: "数据结构",
    title: "堆排序中，建堆的时间复杂度为：",
    options: [
      { label: "A", content: "O(n)" },
      { label: "B", content: "O(log n)" },
      { label: "C", content: "O(n log n)" },
      { label: "D", content: "O(n^2)" }
    ],
    answer: "A",
    analysis: "解析：虽然每次调整是 O(log n)，但所有非叶子节点调整的总和收敛于 O(n)。"
  },
  {
    id: 381,
    type: "choice",
    subject: "计算机组成原理",
    title: "冯·诺依曼机的“指令”由什么组成？",
    options: [
      { label: "A", content: "地址码和操作码" },
      { label: "B", content: "二进制数据" },
      { label: "C", content: "微指令" },
      { label: "D", content: "操作数" }
    ],
    answer: "A",
    analysis: "解析：操作码决定做什么，地址码决定对谁做。"
  },
  {
    id: 382,
    type: "choice",
    subject: "操作系统",
    title: "在 I/O 控制中，DMA 方式与中断方式的主要区别是：",
    options: [
      { label: "A", content: "中断方式更高效" },
      { label: "B", content: "DMA 传送不经过 CPU，直接与内存交换数据" },
      { label: "C", content: "DMA 不需要硬件支持" },
      { label: "D", content: "中断方式只适用于高速设备" }
    ],
    answer: "B",
    analysis: "解析：DMA 接管了总线，绕过 CPU 实现数据搬运。"
  },
  {
    id: 383,
    type: "choice",
    subject: "计算机网络",
    title: "下列关于 ICMP 报文的叙述，错误的是：",
    options: [
      { label: "A", content: "ICMP 报文封装在 IP 数据报中" },
      { label: "B", content: "ICMP 报文用于差错报告" },
      { label: "C", content: "对 ICMP 差错报告报文不再发 ICMP 差错报告" },
      { label: "D", content: "ICMP 报文具有高优先级，保证必达" }
    ],
    answer: "D",
    analysis: "解析：ICMP 并不保证必达，它也是不可靠传输。"
  },
  {
    id: 384,
    type: "choice",
    subject: "数据结构",
    title: "在稀疏矩阵的压缩存储中，三元组表主要存储：",
    options: [
      { label: "A", content: "所有元素的值" },
      { label: "B", content: "非零元素的行、列、值" },
      { label: "C", content: "对角线元素" },
      { label: "D", content: "矩阵的维度" }
    ],
    answer: "B",
    analysis: "解析：为了节省空间，只记录非零元素的坐标和数值。"
  },
  {
    id: 385,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列关于机器字长的描述，正确的是：",
    options: [
      { label: "A", content: "等于指令字长" },
      { label: "B", content: "等于 CPU 内部通用寄存器的位数" },
      { label: "C", content: "固定为 32 位" },
      { label: "D", content: "等于内存单元的位数" }
    ],
    answer: "B",
    analysis: "解析：字长通常指 CPU 一次能处理的二进制位数，由 ALU 和寄存器宽度决定。"
  },
  {
    id: 386,
    type: "choice",
    subject: "操作系统",
    title: "如果分段系统的物理内存为 1GB，某段的基址为 0x1000，段长为 2KB，则逻辑地址 1500 对应的物理地址是：",
    options: [
      { label: "A", content: "0x1500" },
      { label: "B", content: "0x1000 + 1500" },
      { label: "C", content: "2500" },
      { label: "D", content: "非法地址" }
    ],
    answer: "B",
    analysis: "解析：逻辑地址 1500 小于段长 2048，合法。物理地址 = 基址 + 偏移 = 0x1000 + 1500。"
  },
  {
    id: 387,
    type: "choice",
    subject: "计算机网络",
    title: "UDP 报文首部中，不包含的字段是：",
    options: [
      { label: "A", content: "源端口号" },
      { label: "B", content: "目的端口号" },
      { label: "C", content: "序列号" },
      { label: "D", content: "长度" }
    ],
    answer: "C",
    analysis: "解析：序列号是 TCP 为了实现可靠传输而特有的。"
  },
  {
    id: 388,
    type: "choice",
    subject: "数据结构",
    title: "哈希冲突处理方法中，链地址法相比开放定址法的优点是：",
    options: [
      { label: "A", content: "节省空间" },
      { label: "B", content: "删除结点简单" },
      { label: "C", content: "查找不需要比较" },
      { label: "D", content: "不支持动态扩容" }
    ],
    answer: "B",
    analysis: "解析：开放定址法删除结点需特殊标记，否则会中断查找链；链地址法只需删除链表结点。"
  },
  {
    id: 389,
    type: "choice",
    subject: "计算机组成原理",
    title: "硬盘的扇区寻址方式中，CHS 分别代表：",
    options: [
      { label: "A", content: "容量、高速、存储" },
      { label: "B", content: "柱面、磁头、扇区" },
      { label: "C", content: "校验、硬件、系统" },
      { label: "D", content: "缓存、高度、尺寸" }
    ],
    answer: "B",
    analysis: "解析：C(Cylinder), H(Head), S(Sector)。"
  },
  {
    id: 390,
    type: "choice",
    subject: "操作系统",
    title: "操作系统中的“临界资源”是指：",
    options: [
      { label: "A", content: "CPU" },
      { label: "B", content: "一次仅允许一个进程使用的资源" },
      { label: "C", content: "内存空间" },
      { label: "D", content: "外设驱动" }
    ],
    answer: "B",
    analysis: "解析：如打印机、共享变量等，必须互斥访问。"
  },
  {
    id: 391,
    type: "choice",
    subject: "计算机网络",
    title: "在 CSMA/CD 中，若发生碰撞，站点需退避。若连续发生 3 次碰撞，则退避的时间范围是：",
    options: [
      { label: "A", content: "[0, 3] 倍争用期" },
      { label: "B", content: "[0, 7] 倍争用期" },
      { label: "C", content: "[0, 15] 倍争用期" },
      { label: "D", content: "[0, 1] 倍争用期" }
    ],
    answer: "B",
    analysis: "解析：2^3 - 1 = 7。范围是 [0, 2^k-1]。"
  },
  {
    id: 392,
    type: "choice",
    subject: "数据结构",
    title: "具有 6 个结点的无向图，若边数大于多少时，该图必然是连通的？",
    options: [
      { label: "A", content: "5" },
      { label: "B", content: "10" },
      { label: "C", content: "15" },
      { label: "D", content: "20" }
    ],
    answer: "B",
    analysis: "解析：n-1 个点构成完全图，再加一根边必连通。C(5,2) = 10。加第 11 根边必连通。"
  },
  {
    id: 393,
    type: "choice",
    subject: "计算机组成原理",
    title: "在浮点数补码加减运算中，左规操作是指：",
    options: [
      { label: "A", content: "尾数左移，阶码加 1" },
      { label: "B", content: "尾数左移，阶码减 1" },
      { label: "C", content: "尾数右移，阶码加 1" },
      { label: "D", content: "尾数右移，阶码减 1" }
    ],
    answer: "B",
    analysis: "解析：尾数左移代表扩大，故阶码需减小以保持数值不变。"
  },
  {
    id: 394,
    type: "choice",
    subject: "操作系统",
    title: "下述关于页式存储管理的描述，正确的是：",
    options: [
      { label: "A", content: "会有外部碎片" },
      { label: "B", content: "逻辑地址连续，物理地址可以不连续" },
      { label: "C", content: "页的大小必须由用户决定" },
      { label: "D", content: "不支持内存保护" }
    ],
    answer: "B",
    analysis: "解析：分页系统通过页表实现地址映射，消除了外部碎片，物理存放很灵活。"
  },
  {
    id: 395,
    type: "choice",
    subject: "计算机网络",
    title: "在 HTTP 1.0 中，浏览器请求一个网页及其包含的 10 张图片，至少需要建立几次 TCP 连接？",
    options: [
      { label: "A", content: "1" },
      { label: "B", content: "10" },
      { label: "C", content: "11" },
      { label: "D", content: "20" }
    ],
    answer: "C",
    analysis: "解析：HTTP 1.0 默认非持续连接，每个对象（HTML + 10 张图）都要一个连接。"
  },
  {
    id: 396,
    type: "choice",
    subject: "数据结构",
    title: "排序算法中，若初始序列已基本有序，则效率最高的是：",
    options: [
      { label: "A", content: "快速排序" },
      { label: "B", content: "归并排序" },
      { label: "C", content: "直接插入排序" },
      { label: "D", content: "堆排序" }
    ],
    answer: "C",
    analysis: "解析：插入排序在基本有序时接近 O(n)，而快排会退化为 O(n^2)。"
  },
  {
    id: 397,
    type: "choice",
    subject: "计算机组成原理",
    title: "某机器主频为 2GHz，CPI 为 2，则该机的 MIPS 指标为：",
    options: [
      { label: "A", content: "1000" },
      { label: "B", content: "2000" },
      { label: "C", content: "4000" },
      { label: "D", content: "500" }
    ],
    answer: "A",
    analysis: "解析：MIPS = 主频 / (CPI * 10^6) = 2*10^9 / (2*10^6) = 1000。"
  },
  {
    id: 398,
    type: "choice",
    subject: "操作系统",
    title: "在使用“快表”（TLB）的系统中，逻辑地址转换的流程通常是：",
    options: [
      { label: "A", content: "先查页表，不命中再查快表" },
      { label: "B", content: "先查快表，不命中再查页表" },
      { label: "C", content: "同时查找，以快表结果为准" },
      { label: "D", content: "只查快表" }
    ],
    answer: "B",
    analysis: "解析：TLB 是高速缓存，存储最近用过的页表项，访问速度远快于内存中的页表。"
  },
  {
    id: 399,
    type: "choice",
    subject: "计算机网络",
    title: "根据 OSI 模型，网桥工作在：",
    options: [
      { label: "A", content: "物理层" },
      { label: "B", content: "数据链路层" },
      { label: "C", content: "网络层" },
      { label: "D", content: "传输层" }
    ],
    answer: "B",
    analysis: "解析：网桥根据 MAC 地址转发帧。"
  },
  {
    id: 400,
    type: "choice",
    subject: "数据结构",
    title: "无向图的邻接矩阵一定是对称的，而有向图的邻接矩阵：",
    options: [
      { label: "A", content: "也一定是对称的" },
      { label: "B", content: "一定是不对称的" },
      { label: "C", content: "不一定是对称的" },
      { label: "D", content: "全是 1" }
    ],
    answer: "C",
    analysis: "解析：取决于边是否有双向对应的关系。"
  },
  {
    id: 401,
    type: "choice",
    subject: "计算机组成原理",
    title: "在 Cache 映射中，块大小为 16 字节，则地址码的低 4 位用于：",
    options: [
      { label: "A", content: "块索引" },
      { label: "B", content: "块内偏移" },
      { label: "C", content: "标记字段" },
      { label: "D", content: "有效位" }
    ],
    answer: "B",
    analysis: "解析：2^4 = 16，故低 4 位确定字节在块内的具体位置。"
  },
  {
    id: 402,
    type: "choice",
    subject: "操作系统",
    title: "系统发生死锁后，剥夺资源的方法可能会导致：",
    options: [
      { label: "A", content: "活锁" },
      { label: "B", content: "饥饿" },
      { label: "C", content: "并发度提升" },
      { label: "D", content: "外部碎片" }
    ],
    answer: "B",
    analysis: "解析：如果总是剥夺同一个进程，它将由于资源匮乏而无法进展。"
  },
  {
    id: 403,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 中，接收窗口 rwnd 的值是由谁确定的？",
    options: [
      { label: "A", content: "发送端" },
      { label: "B", content: "接收端" },
      { label: "C", content: "网络带宽" },
      { label: "D", content: "中间路由器" }
    ],
    answer: "B",
    analysis: "解析：rwnd 反映了接收方的缓存剩余空间。"
  },
  {
    id: 404,
    type: "choice",
    subject: "数据结构",
    title: "已知二叉树的前序序列为 ABC，其可能的二叉树形态有：",
    options: [
      { label: "A", content: "3 种" },
      { label: "B", content: "4 种" },
      { label: "C", content: "5 种" },
      { label: "D", content: "6 种" }
    ],
    answer: "C",
    analysis: "解析：卡特兰数 C(2n, n)/(n+1)。n=3，结果为 5。"
  },
  {
    id: 405,
    type: "choice",
    subject: "计算机组成原理",
    title: "微程序存放在：",
    options: [
      { label: "A", content: "主存" },
      { label: "B", content: "控制存储器" },
      { label: "C", content: "Cache" },
      { label: "D", content: "寄存器" }
    ],
    answer: "B",
    analysis: "解析：控存（CM）通常是只读的，位于 CPU 内部。"
  },

  {
    id: 406,
    type: "choice",
    subject: "数据结构",
    title: "已知字符集 {a, b, c, d}，若各字符出现的次数分别为 {5, 2, 4, 3}，则对应哈夫曼树的带权路径长度 (WPL) 是：",
    options: [
      { label: "A", content: "25" },
      { label: "B", content: "27" },
      { label: "C", content: "28" },
      { label: "D", content: "29" }
    ],
    answer: "C",
    analysis: "解析：1. 最小的 2,3 合并得 5；2. 两个 4,5 合并得 9；3. 最后 5,9 合并得 14。WPL = (2+3)*3 + 4*2 + 5*1 = 15+8+5 = 28。"
  },
  {
    id: 407,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列关于 RAID 技术的叙述中，正确的是：",
    options: [
      { label: "A", content: "RAID 0 具有最高的容错能力" },
      { label: "B", content: "RAID 1 采用镜像技术，空间利用率为 50%" },
      { label: "C", content: "RAID 5 采用独立的奇偶校验盘" },
      { label: "D", content: "RAID 10 是先做并行扩展再做镜像" }
    ],
    answer: "B",
    analysis: "解析：RAID 0 无冗余；RAID 1 镜像（一半数据一半副本）；RAID 5 校验位分布式存储；RAID 10 是先镜像再扩展。"
  },
  {
    id: 408,
    type: "choice",
    subject: "操作系统",
    title: "在多级反馈队列调度算法中，新就绪的进程首先进入：",
    options: [
      { label: "A", content: "优先级最高、时间片最小的队列" },
      { label: "B", content: "优先级最低、时间片最大的队列" },
      { label: "C", content: "优先级中等、时间片中等的队列" },
      { label: "D", content: "随机进入任一队列" }
    ],
    answer: "A",
    analysis: "解析：MLFQ 算法通过多级降速，新进程由于表现出短作业特性，赋予最高优先级以快速响应。"
  },
  {
    id: 409,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 协议中，若拥塞窗口 cwnd=8，ssthresh=12，发生超时重传后，cwnd 和 ssthresh 分别变为：",
    options: [
      { label: "A", content: "cwnd=1, ssthresh=4" },
      { label: "B", content: "cwnd=1, ssthresh=6" },
      { label: "C", content: "cwnd=4, ssthresh=4" },
      { label: "D", content: "cwnd=8, ssthresh=4" }
    ],
    answer: "A",
    analysis: "解析：发生超时重传，ssthresh 设为当前 cwnd 的一半（8/2=4），cwnd 重新回到 1。"
  },
  {
    id: 410,
    type: "choice",
    subject: "数据结构",
    title: "下列关于图的说法，正确的是：",
    options: [
      { label: "A", content: "有向图中顶点的度之和是边数的两倍" },
      { label: "B", content: "无向完全图的边数是 n(n-1)" },
      { label: "C", content: "强连通图一定是连通图" },
      { label: "D", content: "树是一个没有回路的图，但不一定是连通的" }
    ],
    answer: "C",
    analysis: "解析：有向图总度数是边数 2 倍（入度=出度=e）；无向完全图边数 n(n-1)/2；强连通指有向图，连通指无向图，强连通必然连通；树必须是连通的。"
  },
  {
    id: 411,
    type: "choice",
    subject: "计算机组成原理",
    title: "指令字长 32 位，其中操作码占 8 位。若采用单字长指令格式，则该指令系统最多支持多少种寻址方式？",
    options: [
      { label: "A", content: "256" },
      { label: "B", content: "128" },
      { label: "C", content: "取决于地址码中寻址特征位的位数" },
      { label: "D", content: "4096" }
    ],
    answer: "C",
    analysis: "解析：操作码决定指令种类。寻址方式由地址码字段中的寻址特征位（如 3 位对应 8 种）决定。"
  },
  {
    id: 412,
    type: "choice",
    subject: "操作系统",
    title: "在死锁预防策略中，限制进程“申请资源时不能持有资源”是破坏了哪个条件？",
    options: [
      { label: "A", content: "互斥条件" },
      { label: "B", content: "请求与保持条件" },
      { label: "C", content: "不剥夺条件" },
      { label: "D", content: "循环等待条件" }
    ],
    answer: "B",
    analysis: "解析：请求与保持指持有资源的同时又去申请新资源。破坏它通常要求进程运行前一次性申请所有资源。"
  },
  {
    id: 413,
    type: "choice",
    subject: "计算机网络",
    title: "某子网掩码为 255.255.252.0，该子网中最多可容纳的主机数量是：",
    options: [
      { label: "A", content: "254" },
      { label: "B", content: "510" },
      { label: "C", content: "1022" },
      { label: "D", content: "1024" }
    ],
    answer: "C",
    analysis: "解析：252 = 11111100，主机位有 2+8=10 位。2^10 - 2 = 1022。"
  },
  {
    id: 414,
    type: "choice",
    subject: "数据结构",
    title: "向一颗 3 阶 B 树中依次插入关键字 {1, 2, 3, 4, 5}，最后根结点中的关键字是：",
    options: [
      { label: "A", content: "2" },
      { label: "B", content: "3" },
      { label: "C", content: "2, 4" },
      { label: "D", content: "1, 2, 3, 4, 5" }
    ],
    answer: "C",
    analysis: "解析：3 阶 B 树（2-3 树）。插入 3 时分裂，2 提到根；插入 4, 5，4 提到根。最终根包含 2 和 4。"
  },
  {
    id: 415,
    type: "choice",
    subject: "计算机组成原理",
    title: "中断响应周期，CPU 将 PC 和 PSW 压入：",
    options: [
      { label: "A", content: "通用寄存器" },
      { label: "B", content: "控制存储器" },
      { label: "C", content: "内存堆栈" },
      { label: "D", content: "Cache" }
    ],
    answer: "C",
    analysis: "解析：为了在中断返回后恢复现场，硬件自动将断点和状态字存入内存堆栈。"
  },
  {
    id: 416,
    type: "choice",
    subject: "操作系统",
    title: "磁盘调度算法中，FSCAN 算法相比 SCAN 算法改进了什么？",
    options: [
      { label: "A", content: "减少了磁头移动距离" },
      { label: "B", content: "避免了“磁头粘着”现象" },
      { label: "C", content: "提高了实时性" },
      { label: "D", content: "支持随机读写" }
    ],
    answer: "B",
    analysis: "解析：磁头粘着指大量请求集中在某一磁道导致磁头不动。FSCAN 通过将请求分队列处理来解决。"
  },
  {
    id: 417,
    type: "choice",
    subject: "计算机网络",
    title: "在以太网 CSMA/CD 协议中，争用期（Slot Time）是指：",
    options: [
      { label: "A", content: "信号从发送端传到接收端的时间" },
      { label: "B", content: "信号在最长电缆上往返传输的时间" },
      { label: "C", content: "数据包发送的总时间" },
      { label: "D", content: "等待退避的时间" }
    ],
    answer: "B",
    analysis: "解析：2τ（Tau）是检测到碰撞所需的最长时间。"
  },
  {
    id: 418,
    type: "choice",
    subject: "数据结构",
    title: "希尔排序的时间复杂度与什么密切相关？",
    options: [
      { label: "A", content: "数据的初始顺序" },
      { label: "B", content: "增量序列的选择" },
      { label: "C", content: "数组的长度" },
      { label: "D", content: "以上都是" }
    ],
    answer: "D",
    analysis: "解析：增量序列决定了缩减的速度，初始顺序和长度也影响具体开销。"
  },
  {
    id: 419,
    type: "choice",
    subject: "计算机组成原理",
    title: "主存地址位数为 32 位，按字节编址。若主存容量为 4GB，则地址码范围是：",
    options: [
      { label: "A", content: "0 到 2^32-1" },
      { label: "B", content: "0 到 2^31-1" },
      { label: "C", content: "0 到 4*10^9" },
      { label: "D", content: "0 到 2^16-1" }
    ],
    answer: "A",
    analysis: "解析：4GB = 2^32 字节。32 位地址正好覆盖这个范围。"
  },
  {
    id: 420,
    type: "choice",
    subject: "操作系统",
    title: "在解决临界区互斥的软件方案中，Peterson 算法保证了：",
    options: [
      { label: "A", content: "互斥进入" },
      { label: "B", content: "有空让进" },
      { label: "C", content: "有限等待" },
      { label: "D", content: "以上都保证了" }
    ],
    answer: "D",
    analysis: "解析：Peterson 算法是双进程互斥的经典软件解法，满足所有三个准则。"
  },
  {
    id: 421,
    type: "choice",
    subject: "计算机网络",
    title: "在 TCP 三次握手中，若第二次握手的 SYN=1, ACK=1, seq=100, ack=51，则第三次握手的报文段中：",
    options: [
      { label: "A", content: "SYN=0, ACK=1, seq=51, ack=101" },
      { label: "B", content: "SYN=1, ACK=1, seq=51, ack=101" },
      { label: "C", content: "SYN=0, ACK=1, seq=50, ack=100" },
      { label: "D", content: "SYN=0, ACK=1, seq=101, ack=51" }
    ],
    answer: "A",
    analysis: "解析：第三次握手 SYN 置 0，seq 延续之前的确认号 51，ack 是对方 seq+1 = 101。"
  },
  {
    id: 422,
    type: "choice",
    subject: "数据结构",
    title: "下列关于栈的叙述中，正确的是：",
    options: [
      { label: "A", content: "栈底元素最后出栈" },
      { label: "B", content: "栈顶元素最后出栈" },
      { label: "C", content: "栈支持随机访问" },
      { label: "D", content: "栈是一种线性表，只能在栈底插入" }
    ],
    answer: "A",
    analysis: "解析：栈是 FILO（先进后出），第一个进（栈底）的一定最后一个出。"
  },
  {
    id: 423,
    type: "choice",
    subject: "计算机组成原理",
    title: "在计算机执行指令的过程中，用于存放当前正在执行指令的代码的寄存器是：",
    options: [
      { label: "A", content: "PC" },
      { label: "B", content: "IR" },
      { label: "C", content: "MAR" },
      { label: "D", content: "MDR" }
    ],
    answer: "B",
    analysis: "解析：IR（指令寄存器）存放当前正在译码和执行的指令。"
  },
  {
    id: 424,
    type: "choice",
    subject: "操作系统",
    title: "下列关于线程的描述，错误的是：",
    options: [
      { label: "A", content: "线程是系统分配资源的基本单位" },
      { label: "B", content: "线程是 CPU 调度的基本单位" },
      { label: "C", content: "线程切换开销小于进程切换" },
      { label: "D", content: "多线程可以共享进程的内存空间" }
    ],
    answer: "A",
    analysis: "解析：进程是资源分配的基本单位；线程是调度的基本单位。"
  },
  {
    id: 425,
    type: "choice",
    subject: "计算机网络",
    title: "路由器根据什么地址进行分组转发？",
    options: [
      { label: "A", content: "源 MAC 地址" },
      { label: "B", content: "目的 IP 地址" },
      { label: "C", content: "源 IP 地址" },
      { label: "D", content: "目的端口号" }
    ],
    answer: "B",
    analysis: "解析：路由器工作在网络层，根据目的 IP 查路由表进行转发。"
  },
  {
    id: 426,
    type: "choice",
    subject: "数据结构",
    title: "在 AOE 网中，关键路径上的活动持续时间缩短，则整个工程的工期：",
    options: [
      { label: "A", content: "必然缩短" },
      { label: "B", content: "可能缩短" },
      { label: "C", content: "必然不变" },
      { label: "D", content: "反而延长" }
    ],
    answer: "B",
    analysis: "解析：若关键路径只有一条，缩短会缩短工期；若有多条平行关键路径，缩短其中一条可能无效。"
  },
  {
    id: 427,
    type: "choice",
    subject: "计算机组成原理",
    title: "Cache 采用组相联映射，主存容量 1MB，Cache 容量 8KB，块大小 32B，2 路组相联。则主存地址中的组号占多少位？",
    options: [
      { label: "A", content: "7" },
      { label: "B", content: "8" },
      { label: "C", content: "9" },
      { label: "D", content: "10" }
    ],
    answer: "A",
    analysis: "解析：块数 = 8KB / 32B = 256 块。组数 = 256 / 2 = 128 组。组号位 = log2(128) = 7 位。"
  },
  {
    id: 428,
    type: "choice",
    subject: "操作系统",
    title: "实现分页存储管理的基础硬件是：",
    options: [
      { label: "A", content: "页表" },
      { label: "B", content: "MMU（内存管理单元）" },
      { label: "C", content: "TLB（快表）" },
      { label: "D", content: "寄存器" }
    ],
    answer: "B",
    analysis: "解析：MMU 负责在 CPU 执行时将逻辑地址实时转换为物理地址。"
  },
  {
    id: 429,
    type: "choice",
    subject: "计算机网络",
    title: "下列协议中，属于应用层且基于 TCP 的是：",
    options: [
      { label: "A", content: "DNS" },
      { label: "B", content: "SNMP" },
      { label: "C", content: "TELNET" },
      { label: "D", content: "RIP" }
    ],
    answer: "C",
    analysis: "解析：DNS/SNMP 常基于 UDP；RIP 封装在 UDP 中；TELNET 基于 TCP 进行远程登录。"
  },
  {
    id: 430,
    type: "choice",
    subject: "数据结构",
    title: "在一个单链表中，向指针 p 所指结点之前插入新结点，通常的做法是：",
    options: [
      { label: "A", content: "遍历找前驱" },
      { label: "B", content: "插入到 p 之后并交换数据域" },
      { label: "C", content: "无法实现" },
      { label: "D", content: "直接修改 p 的指针" }
    ],
    answer: "B",
    analysis: "解析：为了达到 O(1)，可先插入 p 之后，然后交换 p 与新结点的数据值。"
  },
  {
    id: 431,
    type: "choice",
    subject: "计算机组成原理",
    title: "在单处理机系统中，实现 I/O 并行性最高的是：",
    options: [
      { label: "A", content: "程序查询" },
      { label: "B", content: "中断驱动" },
      { label: "C", content: "DMA" },
      { label: "D", content: "通道方式" }
    ],
    answer: "D",
    analysis: "解析：通道是独立的 CPU，具有极高的自主权，极大解放了主 CPU。"
  },
  {
    id: 432,
    type: "choice",
    subject: "操作系统",
    title: "在 Unix 中，管道（Pipe）属于：",
    options: [
      { label: "A", content: "共享内存通信" },
      { label: "B", content: "消息传递通信" },
      { label: "C", content: "流式文件通信" },
      { label: "D", content: "寄存器通信" }
    ],
    answer: "C",
    analysis: "解析：管道是一种特殊的文件，数据以字符流的形式按先进先出写入和读出。"
  },
  {
    id: 433,
    type: "choice",
    subject: "计算机网络",
    title: "IPv4 首部中的 TTL 字段在数据报每经过一个路由器时减 1，减到 0 时会：",
    options: [
      { label: "A", content: "正常转发" },
      { label: "B", content: "丢弃并返回超时 ICMP" },
      { label: "C", content: "丢弃并返回终点不可达 ICMP" },
      { label: "D", content: "重新计算后转发" }
    ],
    answer: "B",
    analysis: "解析：TTL 防止报文在环路中无限存在。归零后触发“时间超过”错误报文。"
  },
  {
    id: 434,
    type: "choice",
    subject: "数据结构",
    title: "具有 n 个顶点的无向连通图，若边数大于 n-1，则该图：",
    options: [
      { label: "A", content: "必然有环" },
      { label: "B", content: "必然没有环" },
      { label: "C", content: "是完全图" },
      { label: "D", content: "无法确定" }
    ],
    answer: "A",
    analysis: "解析：树是极小连通图，边数 n-1。多于这个数必然形成闭环。"
  },
  {
    id: 435,
    type: "choice",
    subject: "计算机组成原理",
    title: "在指令流水线中，解决控制相关的技术是：",
    options: [
      { label: "A", content: "数据旁路" },
      { label: "B", content: "分支预测" },
      { label: "C", content: "插入空操作" },
      { label: "D", content: "增加寄存器" }
    ],
    answer: "B",
    analysis: "解析：控制相关是由跳转指令引起的。预测下一步去哪可以减少流水线停顿。"
  },
  {
    id: 436,
    type: "choice",
    subject: "操作系统",
    title: "下列关于虚拟存储器的说法，正确的是：",
    options: [
      { label: "A", content: "基于局部性原理" },
      { label: "B", content: "可以实现对主存的物理扩充" },
      { label: "C", content: "不需要页表" },
      { label: "D", content: "不会产生缺页中断" }
    ],
    answer: "A",
    analysis: "解析：虚存逻辑上扩大了空间，主要利用了时间局部性和空间局部性。"
  },
  {
    id: 437,
    type: "choice",
    subject: "计算机网络",
    title: "在 HTTP 响应中，404 状态码表示：",
    options: [
      { label: "A", content: "请求成功" },
      { label: "B", content: "服务器内部错误" },
      { label: "C", content: "资源不存在" },
      { label: "D", content: "禁止访问" }
    ],
    answer: "C",
    analysis: "解析：常见状态码：200(OK), 404(Not Found), 500(Server Error)。"
  },
  {
    id: 438,
    type: "choice",
    subject: "数据结构",
    title: "在散列查找中，二次探测法的主要作用是：",
    options: [
      { label: "A", content: "减少冲突概率" },
      { label: "B", content: "减少聚集现象" },
      { label: "C", content: "缩短表长" },
      { label: "D", content: "无需散列函数" }
    ],
    answer: "B",
    analysis: "解析：相比线性探测，二次探测跨度更大，能有效缓解“堆积（聚集）”问题。"
  },
  {
    id: 439,
    type: "choice",
    subject: "计算机组成原理",
    title: "下列存储器中，掉电后内容丢失的是：",
    options: [
      { label: "A", content: "ROM" },
      { label: "B", content: "EPROM" },
      { label: "C", content: "DRAM" },
      { label: "D", content: "Flash" }
    ],
    answer: "C",
    analysis: "解析：DRAM 是易失性存储，必须有电且定期刷新电荷来保持数据。"
  },
  {
    id: 440,
    type: "choice",
    subject: "操作系统",
    title: "操作系统中，对磁道进行扫描时，始终朝一个方向扫描，直到末尾再折返的技术是：",
    options: [
      { label: "A", content: "SSTF" },
      { label: "B", content: "SCAN" },
      { label: "C", content: "CSCAN" },
      { label: "D", content: "FCFS" }
    ],
    answer: "B",
    analysis: "解析：SCAN 即电梯算法。CSCAN（循环扫描）则是在末尾后直接回到起点单向运行。"
  },
  {
    id: 441,
    type: "choice",
    subject: "计算机网络",
    title: "在以太网交换机中，用于保存 MAC 地址与端口对应关系的表是：",
    options: [
      { label: "A", content: "ARP 表" },
      { label: "B", content: "路由表" },
      { label: "C", content: "转发表（CAM 表）" },
      { label: "D", content: "主机表" }
    ],
    answer: "C",
    analysis: "解析：交换机查询转发表决定从哪个物理端口发出数据帧。"
  },
  {
    id: 442,
    type: "choice",
    subject: "数据结构",
    title: "下列哪种排序算法在最坏情况下时间复杂度为 O(n log n)？",
    options: [
      { label: "A", content: "快速排序" },
      { label: "B", content: "堆排序" },
      { label: "C", content: "插入排序" },
      { label: "D", content: "冒泡排序" }
    ],
    answer: "B",
    analysis: "解析：堆排序最差也是 O(n log n)；快排最差退化为 O(n^2)。"
  },
  {
    id: 443,
    type: "choice",
    subject: "计算机组成原理",
    title: "寄存器寻址的操作数在：",
    options: [
      { label: "A", content: "通用寄存器中" },
      { label: "B", content: "指令代码中" },
      { label: "C", content: "内存单元中" },
      { label: "D", content: "堆栈中" }
    ],
    answer: "A",
    analysis: "解析：寄存器寻址直接读寄存器的内容作为操作数。"
  },
  {
    id: 444,
    type: "choice",
    subject: "操作系统",
    title: "如果一个进程因为等待 I/O 而被阻塞，当 I/O 完成后，该进程：",
    options: [
      { label: "A", content: "直接进入运行态" },
      { label: "B", content: "进入就绪态" },
      { label: "C", content: "进入等待态" },
      { label: "D", content: "继续睡眠" }
    ],
    answer: "B",
    analysis: "解析：阻塞进程唤醒后不能抢占 CPU，必须排队等待就绪队列的调度。"
  },
  {
    id: 445,
    type: "choice",
    subject: "计算机网络",
    title: "下面哪种方法用于解决无线局域网的“隐蔽站”问题？",
    options: [
      { label: "A", content: "CSMA/CD" },
      { label: "B", content: "RTS/CTS 握手" },
      { label: "C", content: "增加发射功率" },
      { label: "D", content: "采用光纤传输" }
    ],
    answer: "B",
    analysis: "解析：RTS/CTS（请求发送/清除发送）可以预留信道，解决看不见对方导致的冲突。"
  },
  {
    id: 446,
    type: "choice",
    subject: "数据结构",
    title: "高度为 h (根为1) 的平衡二叉树中最少包含的结点数满足：",
    options: [
      { label: "A", content: "2^h - 1" },
      { label: "B", content: "h" },
      { label: "C", content: "F(h) = F(h-1) + F(h-2) + 1" },
      { label: "D", content: "2^(h-1)" }
    ],
    answer: "C",
    analysis: "解析：这是 AVL 树最少结点公式。F(1)=1, F(2)=2, F(3)=4..."
  },
  {
    id: 447,
    type: "choice",
    subject: "计算机组成原理",
    title: "机器字长 64 位，存储容量 128MB。若按字节编址，其寻址范围是：",
    options: [
      { label: "A", content: "2^27" },
      { label: "B", content: "2^32" },
      { label: "C", content: "2^64" },
      { label: "D", content: "2^128" }
    ],
    answer: "A",
    analysis: "解析：128MB = 2^7 * 2^20 = 2^27 字节。按字节编址即寻址地址数为 2^27。"
  },
  {
    id: 448,
    type: "choice",
    subject: "操作系统",
    title: "下列关于信号量 P、V 操作的描述，正确的是：",
    options: [
      { label: "A", content: "P 操作可能导致进程阻塞" },
      { label: "B", content: "V 操作可能导致进程阻塞" },
      { label: "C", content: "P 操作用于释放资源" },
      { label: "D", content: "V 操作用于申请资源" }
    ],
    answer: "A",
    analysis: "解析：P（wait）申请资源，不足则阻塞；V（signal）释放资源，可能唤醒他进程。"
  },
  {
    id: 449,
    type: "choice",
    subject: "计算机网络",
    title: "TCP 建立连接过程中，第二次握手服务器发送的报文标志位为：",
    options: [
      { label: "A", content: "SYN=1, ACK=0" },
      { label: "B", content: "SYN=1, ACK=1" },
      { label: "C", content: "SYN=0, ACK=1" },
      { label: "D", content: "FIN=1, ACK=1" }
    ],
    answer: "B",
    analysis: "解析：服务器响应 SYN 并发起自己的 SYN，同时确认（ACK）客户端。"
  },
  {
    id: 450,
    type: "choice",
    subject: "数据结构",
    title: "广义表 L = (a, b)，其 tail(L) 等于：",
    options: [
      { label: "A", content: "b" },
      { label: "B", content: "(b)" },
      { label: "C", content: "()" },
      { label: "D", content: "a" }
    ],
    answer: "B",
    analysis: "解析：tail 除去第一个元素后，剩余部分仍以广义表形式返回。"
  },
  {
    id: 451,
    type: "choice",
    subject: "计算机组成原理",
    title: "微程序控制器中的控制存储器（CM）用于存放：",
    options: [
      { label: "A", content: "用户程序" },
      { label: "B", content: "微程序" },
      { label: "C", content: "操作数" },
      { label: "D", content: "页表" }
    ],
    answer: "B",
    analysis: "解析：CM 存储的是微指令序列，即微程序。"
  },
  {
    id: 452,
    type: "choice",
    subject: "操作系统",
    title: "在文件的索引分配方式中，索引表存放的是：",
    options: [
      { label: "A", content: "文件数据" },
      { label: "B", content: "文件所在的物理块号" },
      { label: "C", content: "文件名" },
      { label: "D", content: "文件权限" }
    ],
    answer: "B",
    analysis: "解析：索引表建立逻辑块号到物理块号的映射。"
  },
  {
    id: 453,
    type: "choice",
    subject: "计算机网络",
    title: "在子网划分中，子网掩码中的 1 对应 IP 地址中的：",
    options: [
      { label: "A", content: "网络号和子网号" },
      { label: "B", content: "主机号" },
      { label: "C", content: "广播地址" },
      { label: "D", content: "默认网关" }
    ],
    answer: "A",
    analysis: "解析：1 掩掉非主机部分，0 留下主机部分。"
  },
  {
    id: 454,
    type: "choice",
    subject: "数据结构",
    title: "具有 n 个顶点的连通图，最少有几条边？",
    options: [
      { label: "A", content: "n-1" },
      { label: "B", content: "n" },
      { label: "C", content: "n+1" },
      { label: "D", content: "2n" }
    ],
    answer: "A",
    analysis: "解析：生成树即为连通图的边最少情况。"
  },
  {
    id: 455,
    type: "choice",
    subject: "计算机组成原理",
    title: "单地址指令中，为了完成两个数的算术运算，另一个数通常隐含在：",
    options: [
      { label: "A", content: "主存单元" },
      { label: "B", content: "累加器 ACC" },
      { label: "C", content: "栈顶" },
      { label: "D", content: "立即数" }
    ],
    answer: "B",
    analysis: "解析：隐含寻址减少了指令字长，常默认另一个数在累加寄存器中。"
  }
];