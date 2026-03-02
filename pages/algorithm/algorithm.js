Page({
  data: {
    showPopup: false,
    currentAlgorithm: {},

    // 宇宙的尺寸：为了容纳四大星系，我把画布扩大到了极其宏大的尺寸
    canvasWidth: 3500,
    canvasHeight: 3200,

    lines: [], 

    // 🌟 核心知识库：浩瀚的算法节点数据
    nodes: [
      // --- 【起源节点】 ---
      { id: 'root', name: "算法本源", x: 300, y: 1600, type: "core", desc: "万物肇始，程序的灵魂", code: "/* \n * Welcome to the Algorithm Archive.\n * 算法的本质是时间和空间的魔法。\n */\nconsole.log('Archive Unlocked.');" },
      
      // =========================================================
      // 星系一：【数据结构】 (最上方分支)
      // =========================================================
      { id: 'ds', name: "数据结构", x: 800, y: 700, type: "main", desc: "数据的容器，空间的魔法", code: "// 包含并查集、树状数组、线段树、字典树等" },
      { id: 'ds_dsu', name: "并查集", x: 1400, y: 500, type: "leaf", desc: "朋友的朋友就是朋友", code: "int p[N];\n\n// 返回x的祖宗节点 + 路径压缩\nint find(int x) {\n    if (p[x] != x) p[x] = find(p[x]);\n    return p[x];\n}\n\n// 合并a和b所在的两个集合：\np[find(a)] = find(b);" },
      { id: 'ds_heap', name: "堆 (优先队列)", x: 1400, y: 900, type: "leaf", desc: "永远保持最值在顶端", code: "// C++ STL 优先队列用法\n#include <queue>\n\n// 大根堆 (默认)\npriority_queue<int> heap;\n\n// 小根堆\npriority_queue<int, vector<int>, greater<int>> min_heap;\n\nheap.push(x); // 插入\nheap.top();   // 取最值\nheap.pop();   // 弹出" },
      { id: 'ds_fenwick', name: "树状数组", x: 2000, y: 500, type: "hidden", desc: "极其精巧的单点修改与区间查询", code: "int tr[N];\n\nint lowbit(int x) {\n    return x & -x;\n}\n\n// 位置x加上c\nvoid add(int x, int c) {\n    for (int i = x; i <= n; i += lowbit(i)) tr[i] += c;\n}\n\n// 查询前缀和 1~x\nint sum(int x) {\n    int res = 0;\n    for (int i = x; i; i -= lowbit(i)) res += tr[i];\n    return res;\n}" },
      { id: 'ds_segtree', name: "线段树", x: 2000, y: 900, type: "hidden", desc: "万能的区间利器", code: "struct Node {\n    int l, r;\n    int sum;\n}tr[N * 4];\n\nvoid pushup(int u) {\n    tr[u].sum = tr[u << 1].sum + tr[u << 1 | 1].sum;\n}\n\nvoid build(int u, int l, int r) {\n    if (l == r) tr[u] = {l, r, w[r]};\n    else {\n        tr[u] = {l, r};\n        int mid = l + r >> 1;\n        build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);\n        pushup(u);\n    }\n}" },
      { id: 'ds_trie', name: "Trie 字典树", x: 2600, y: 700, type: "hidden", desc: "高效存储和查找字符串", code: "int son[N][26], cnt[N], idx;\n// 0号点既是根节点，又是空节点\n\nvoid insert(char *str) {\n    int p = 0;\n    for (int i = 0; str[i]; i ++ ) {\n        int u = str[i] - 'a';\n        if (!son[p][u]) son[p][u] = ++ idx;\n        p = son[p][u];\n    }\n    cnt[p] ++ ;\n}" },

      // =========================================================
      // 星系二：【基础筑基】 (中上方分支)
      // =========================================================
      { id: 'base', name: "基础筑基", x: 800, y: 1300, type: "main", desc: "夯实根基，方能筑起万丈高楼", code: "// 包含排序、二分、双指针等最基础的思想" },
      { id: 'b_qsort', name: "快速排序", x: 1400, y: 1100, type: "leaf", desc: "分治思想的极致，O(nlogn) 的艺术", code: "void quick_sort(int q[], int l, int r) {\n    if (l >= r) return;\n    int i = l - 1, j = r + 1, x = q[l + r >> 1];\n    while (i < j) {\n        do i ++ ; while (q[i] < x);\n        do j -- ; while (q[j] > x);\n        if (i < j) swap(q[i], q[j]);\n    }\n    quick_sort(q, l, j);\n    quick_sort(q, j + 1, r);\n}" },
      { id: 'b_msort', name: "归并排序", x: 1400, y: 1500, type: "leaf", desc: "稳如泰山的分治，常用于求逆序对", code: "void merge_sort(int q[], int l, int r) {\n    if (l >= r) return;\n    int mid = l + r >> 1;\n    merge_sort(q, l, mid);\n    merge_sort(q, mid + 1, r);\n    int k = 0, i = l, j = mid + 1;\n    while (i <= mid && j <= r)\n        if (q[i] <= q[j]) tmp[k++] = q[i++];\n        else tmp[k++] = q[j++];\n    while (i <= mid) tmp[k++] = q[i++];\n    while (j <= r) tmp[k++] = q[j++];\n    for (i = l, j = 0; i <= r; i++, j++) q[i] = tmp[j];\n}" },
      { id: 'b_bsearch', name: "二分查找", x: 2000, y: 1300, type: "hidden", desc: "寻找边界的艺术", code: "int bsearch_1(int l, int r) {\n    while (l < r) {\n        int mid = l + r >> 1;\n        if (check(mid)) r = mid;  \n        else l = mid + 1;\n    }\n    return l;\n}" },
      { id: 'b_2ptrs', name: "双指针", x: 2600, y: 1300, type: "hidden", desc: "化繁为简的游走，将O(n^2)优化到O(n)", code: "for (int i = 0, j = 0; i < n; i ++ ) {\n    while (j < i && check(i, j)) j ++ ;\n    // 具体问题的逻辑\n    res = max(res, i - j + 1);\n}" },

      // =========================================================
      // 星系三：【搜索与图论】 (中下方分支)
      // =========================================================
      { id: 'graph', name: "图与搜索", x: 800, y: 1900, type: "main", desc: "探索未知的迷宫与节点网络", code: "// 包含 DFS, BFS, 最短路, 最小生成树等" },
      { id: 'g_dfs', name: "DFS 深搜", x: 1400, y: 1700, type: "leaf", desc: "不撞南墙不回头", code: "int dfs(int u) {\n    st[u] = true; \n    for (int i = h[u]; i != -1; i = ne[i]) {\n        int j = e[i];\n        if (!st[j]) dfs(j);\n    }\n}" },
      { id: 'g_bfs', name: "BFS 广搜", x: 1400, y: 2100, type: "leaf", desc: "水波纹般的层层递进", code: "queue<int> q;\nst[1] = true; \nq.push(1);\nwhile (q.size()) {\n    int t = q.front();\n    q.pop();\n    for (int i = h[t]; i != -1; i = ne[i]) {\n        int j = e[i];\n        if (!st[j]) {\n            st[j] = true;\n            q.push(j);\n        }\n    }\n}" },
      { id: 'g_top', name: "拓扑排序", x: 2000, y: 1700, type: "hidden", desc: "梳理依赖关系，判定有向图的环", code: "bool topsort() {\n    int hh = 0, tt = -1;\n    for (int i = 1; i <= n; i ++ )\n        if (!d[i]) q[ ++ tt] = i;\n    while (hh <= tt) {\n        int t = q[hh ++ ];\n        for (int i = h[t]; i != -1; i = ne[i]) {\n            int j = e[i];\n            if (-- d[j] == 0) q[ ++ tt] = j;\n        }\n    }\n    return tt == n - 1;\n}" },
      { id: 'g_dijkstra', name: "Dijkstra 最短路", x: 2000, y: 2100, type: "hidden", desc: "单源最短路，贪心的艺术", code: "int dist[N];\nbool st[N];\n\nint dijkstra() {\n    memset(dist, 0x3f, sizeof dist);\n    dist[1] = 0;\n    priority_queue<PII, vector<PII>, greater<PII>> heap;\n    heap.push({0, 1});\n    while (heap.size()) {\n        auto t = heap.top();\n        heap.pop();\n        int ver = t.second, distance = t.first;\n        if (st[ver]) continue;\n        st[ver] = true;\n        for (int i = h[ver]; i != -1; i = ne[i]) {\n            int j = e[i];\n            if (dist[j] > distance + w[i]) {\n                dist[j] = distance + w[i];\n                heap.push({dist[j], j});\n            }\n        }\n    }\n    if (dist[n] == 0x3f3f3f3f) return -1;\n    return dist[n];\n}" },

      // =========================================================
      // 星系四：【动态规划】 (最下方分支)
      // =========================================================
      { id: 'dp', name: "动态规划", x: 800, y: 2500, type: "main", desc: "状态的转移，时空的折叠", code: "// DP：永远在思考状态表示与状态计算" },
      { id: 'dp_pack01', name: "01 背包", x: 1400, y: 2300, type: "leaf", desc: "取或不取，这是个问题", code: "// 一维空间优化版\nfor (int i = 1; i <= n; i ++ )\n    for (int j = m; j >= v[i]; j -- )\n        f[j] = max(f[j], f[j - v[i]] + w[i]);" },
      { id: 'dp_packfull', name: "完全背包", x: 1400, y: 2700, type: "leaf", desc: "无限物品的取舍", code: "// 与01背包唯一的区别在于 j 的遍历顺序\nfor (int i = 1; i <= n; i ++ )\n    for (int j = v[i]; j <= m; j ++ )\n        f[j] = max(f[j], f[j - v[i]] + w[i]);" },
      { id: 'dp_linear', name: "线性 DP", x: 2000, y: 2300, type: "hidden", desc: "最长上升子序列 (LIS)", code: "for (int i = 1; i <= n; i ++ ) {\n    f[i] = 1; // 只有a[i]一个数\n    for (int j = 1; j < i; j ++ )\n        if (a[j] < a[i])\n            f[i] = max(f[i], f[j] + 1);\n}" },
      { id: 'dp_interval', name: "区间 DP", x: 2000, y: 2700, type: "hidden", desc: "石子合并：从小区间推导大区间", code: "for (int len = 2; len <= n; len ++ ) {   // 区间长度\n    for (int i = 1; i + len - 1 <= n; i ++ ) { // 枚举起点\n        int j = i + len - 1;                 // 区间终点\n        f[i][j] = 1e8;\n        for (int k = i; k < j; k ++ )        // 枚举分界点\n            f[i][j] = min(f[i][j], f[i][k] + f[k + 1][j] + s[j] - s[i - 1]);\n    }\n}" },
      { id: 'dp_state', name: "状态压缩", x: 2600, y: 2500, type: "hidden", desc: "位运算与动态规划的华丽圆舞曲", code: "// 蒙德里安的梦想 / 最短Hamilton路径\nmemset(f, 0x3f, sizeof f);\nf[1][0] = 0;\nfor (int i = 0; i < 1 << n; i ++ )\n    for (int j = 0; j < n; j ++ )\n        if (i >> j & 1)\n            for (int k = 0; k < n; k ++ )\n                if (i >> k & 1)\n                    f[i][j] = min(f[i][j], f[i - (1 << j)][k] + weight[k][j]);" },


      // =========================================================
      // 星系五：【数论与数学】 (最高维度的真理，最上方分支)
      // 插入位置提示：请确保上一行末尾有一个英文逗号 ,
      // =========================================================
      { id: 'math', name: "数论与数学", x: 800, y: 200, type: "main", desc: "探究数字的奥秘，宇宙的绝对真理", code: "// 包含最大公约数、素数筛法、快速幂等" },
      { id: 'm_gcd', name: "欧几里得算法", x: 1400, y: 100, type: "leaf", desc: "辗转相除法，千古绝唱", code: "// 求最大公约数 (GCD)\nint gcd(int a, int b) {\n    return b ? gcd(b, a % b) : a;\n}\n\n// 最小公倍数 (LCM)\n// int lcm = a / gcd(a, b) * b;" },
      { id: 'm_prime', name: "线性筛素数", x: 1400, y: 300, type: "leaf", desc: "O(n) 时间内找出所有素数", code: "int primes[N], cnt;\nbool st[N];\n\nvoid get_primes(int n) {\n    for (int i = 2; i <= n; i ++ ) {\n        if (!st[i]) primes[cnt ++ ] = i;\n        for (int j = 0; primes[j] <= n / i; j ++ ) {\n            st[primes[j] * i] = true;\n            if (i % primes[j] == 0) break; // 核心：只被最小质因子筛掉\n        }\n    }\n}" },
      { id: 'm_qpow', name: "快速幂", x: 2000, y: 100, type: "hidden", desc: "O(log k) 瞬间算出 a^k mod p", code: "typedef long long LL;\n\nLL qmi(int a, int k, int p) {\n    LL res = 1;\n    while (k) {\n        if (k & 1) res = res * a % p;\n        k >>= 1;\n        a = (LL)a * a % p;\n    }\n    return res;\n}" },
      { id: 'm_inv', name: "乘法逆元", x: 2000, y: 300, type: "hidden", desc: "化除为乘的魔法", code: "// 费马小定理求逆元 (当p为质数时)\n// a / b ≡ a * x (mod p)\n// x = qmi(b, p - 2, p)\n\nLL inv(int b, int p) {\n    return qmi(b, p - 2, p);\n}" },
      { id: 'm_lucas', name: "卢卡斯定理", x: 2600, y: 200, type: "hidden", desc: "大组合数取模的终极武器", code: "LL C(int a, int b, int p) {\n    if (b > a) return 0;\n    LL res = 1;\n    for (int i = 1, j = a; i <= b; i ++, j -- ) {\n        res = res * j % p;\n        res = res * qmi(i, p - 2, p) % p;\n    }\n    return res;\n}\n\nLL lucas(LL a, LL b, int p) {\n    if (a < p && b < p) return C(a, b, p);\n    return C(a % p, b % p, p) * lucas(a / p, b / p, p) % p;\n}" },




      // =========================================================
      // 🌌 第一次扩充：丰富每个星系
      // =========================================================
      // --- 【数据结构】星系扩充：平衡与映射 ---
      { id: 'ds_rbtree', name: "红黑树 (概览)", x: 3200, y: 500, type: "hidden", desc: "自平衡二叉查找树，STL map/set 的基石", code: "// 红黑树五大特性（记忆口诀）：\n// 1. 节点是红色或黑色。\n// 2. 根节点是黑色。\n// 3. 所有叶子节点（NIL）是黑色。\n// 4. 每个红色节点的两个子节点都是黑色。（不能有连续红节点）\n// 5. 从任一节点到其每个叶子的所有路径都包含相同数目的黑色节点。\n//\n// 核心操作：左旋、右旋、变色。\n// 插入和删除后通过旋转和变色维持平衡，复杂度 O(log n)。\n// 实际编码中，我们通常使用现成实现（如 std::map）。" },
      { id: 'ds_hash', name: "哈希表", x: 3200, y: 900, type: "hidden", desc: "键值对的终极映射，期望 O(1) 的查询魔法", code: "// 1. 模拟散列表 - 拉链法\nconst int N = 100003; // 取大于数据范围的第一个质数，冲突最小\nint h[N], e[N], ne[N], idx;\n\n// 向哈希表中插入一个数\nvoid insert(int x) {\n    int k = (x % N + N) % N; // 让负数取模也为正\n    e[idx] = x, ne[idx] = h[k], h[k] = idx ++ ;\n}\n\n// 在哈希表中查询某个数是否存在\nbool find(int x) {\n    int k = (x % N + N) % N;\n    for (int i = h[k]; i != -1; i = ne[i])\n        if (e[i] == x) return true;\n    return false;\n}\n\n// 2. 开放寻址法（常用）\nconst int N = 200003, null = 0x3f3f3f3f; // 通常开2-3倍空间，同样取质数\nint h[N];\n\n// 如果x在哈希表中存在，返回x的位置；如果不存在，返回它应该存储的位置\nint find(int x) {\n    int k = (x % N + N) % N;\n    while (h[k] != null && h[k] != x) {\n        k ++ ;\n        if (k == N) k = 0; // 循环到开头\n    }\n    return k;\n}\n// 插入：h[find(x)] = x;\n// 查询：h[find(x)] == x ?" },

      // --- 【基础筑基】星系扩充：高精度 ---
      { id: 'b_bignum_add', name: "高精度加法", x: 3200, y: 1100, type: "hidden", desc: "用数组模拟超大整数的加法运算", code: "// C = A + B, A >= 0, B >= 0\nvector<int> add(vector<int> &A, vector<int> &B) {\n    if (A.size() < B.size()) return add(B, A);\n    vector<int> C;\n    int t = 0;\n    for (int i = 0; i < A.size(); i ++ ) {\n        t += A[i];\n        if (i < B.size()) t += B[i];\n        C.push_back(t % 10);\n        t /= 10;\n    }\n    if (t) C.push_back(t);\n    return C;\n}\n\n// 使用前，将字符串逆序存入vector<int>\n// vector<int> A, B;\n// for (int i = a.size() - 1; i >= 0; i -- ) A.push_back(a[i] - '0');\n// for (int i = b.size() - 1; i >= 0; i -- ) B.push_back(b[i] - '0');" },
      { id: 'b_bignum_mul', name: "高精度乘低精度", x: 3200, y: 1500, type: "hidden", desc: "大整数与普通整数的乘法", code: "// C = A * b, A >= 0, b >= 0\nvector<int> mul(vector<int> &A, int b) {\n    vector<int> C;\n    int t = 0;\n    for (int i = 0; i < A.size() || t; i ++ ) {\n        if (i < A.size()) t += A[i] * b;\n        C.push_back(t % 10);\n        t /= 10;\n    }\n    // 去除前导零\n    while (C.size() > 1 && C.back() == 0) C.pop_back();\n    return C;\n}" },

      // --- 【搜索与图论】星系扩充：最短路与生成树 ---
      { id: 'g_bellman_ford', name: "Bellman-Ford & SPFA", x: 2600, y: 1900, type: "hidden", desc: "处理负权边，检测负环", code: "// Bellman-Ford 算法 (支持负权边，限制边数k)\nint dist[N], backup[N]; // backup用于备份，防止串联更新\nstruct Edge { int a, b, w; } edges[M];\n\nint bellman_ford() {\n    memset(dist, 0x3f, sizeof dist);\n    dist[1] = 0;\n    for (int i = 0; i < k; i ++ ) { // 最多经过k条边\n        memcpy(backup, dist, sizeof dist); // 备份\n        for (int j = 0; j < m; j ++ ) {\n            int a = edges[j].a, b = edges[j].b, w = edges[j].w;\n            if (dist[b] > backup[a] + w) // 用备份的距离更新\n                dist[b] = backup[a] + w;\n        }\n    }\n    if (dist[n] > 0x3f3f3f3f / 2) return -1; // 因为负权边，可能略小于INF\n    return dist[n];\n}\n\n// SPFA 算法 (队列优化的Bellman-Ford，平均更快，但最坏仍是O(nm))\nint spfa() {\n    queue<int> q;\n    q.push(1);\n    st[1] = true; // st标记是否在队列中\n    while (q.size()) {\n        int t = q.front(); q.pop();\n        st[t] = false;\n        for (int i = h[t]; i != -1; i = ne[i]) {\n            int j = e[i];\n            if (dist[j] > dist[t] + w[i]) {\n                dist[j] = dist[t] + w[i];\n                if (!st[j]) { q.push(j); st[j] = true; }\n            }\n        }\n    }\n    return dist[n];\n}" },
      { id: 'g_kruskal', name: "Kruskal 算法", x: 2600, y: 2300, type: "hidden", desc: "贪心选择最短边，并查集判连通", code: "int p[N]; // 并查集\nstruct Edge { int a, b, w; } edges[M];\n\nbool cmp(Edge a, Edge b) { return a.w < b.w; }\n\nint find(int x) { /* 并查集find函数 */ }\n\nint kruskal() {\n    sort(edges, edges + m, cmp); // 边按权重排序\n    for (int i = 1; i <= n; i ++ ) p[i] = i; // 初始化并查集\n    int res = 0, cnt = 0; // res:最小生成树权重和，cnt:已加入边数\n    for (int i = 0; i < m; i ++ ) {\n        int a = edges[i].a, b = edges[i].b, w = edges[i].w;\n        a = find(a), b = find(b);\n        if (a != b) { // 不连通，则加入这条边\n            p[a] = b;\n            res += w;\n            cnt ++ ;\n        }\n    }\n    if (cnt < n - 1) return 0x3f3f3f3f; // 图不连通\n    return res;\n}" },

      // --- 【动态规划】星系扩充：树形与数位 ---
      { id: 'dp_tree', name: "树形 DP", x: 2600, y: 2100, type: "hidden", desc: "在树形结构上进行状态转移", code: "// 例题：没有上司的舞会 (树的最大权独立集)\nvoid dfs(int u) {\n    f[u][1] = happy[u]; // 选择u的初始收益\n    for (int i = h[u]; i != -1; i = ne[i]) { // 遍历子节点\n        int j = e[i];\n        dfs(j); // 递归处理子树\n        // 状态转移\n        f[u][0] += max(f[j][0], f[j][1]); // u不参加，下属可参加可不参加\n        f[u][1] += f[j][0];               // u参加，下属不能参加\n    }\n}\n\n// 核心：后序遍历，用子节点的状态更新父节点。" },
      { id: 'dp_digit', name: "数位 DP", x: 3200, y: 2500, type: "hidden", desc: "统计区间内满足数字特性的数的个数", code: "// 例题：计数问题，求 [a, b] 中数字 0∼9 出现的次数\n// 记忆化搜索模板（解决\"不超过N\"的问题）\nint dp(int pos, int cnt, int limit, int lead) {\n    // pos: 当前处理到第几位（从高位到低位）\n    // cnt: 当前状态（如已包含特定数字的个数、前几位数模...等）\n    // limit: 是否紧贴上界（如N=514, 前两位选了51，则第3位limit=1，只能选0~4）\n    // lead: 是否有前导零\n    if (!pos) return cnt == target_cnt; // 递归终点，返回是否满足条件\n    if (!limit && !lead && f[pos][cnt] != -1) return f[pos][cnt]; // 记忆化\n    int res = 0;\n    int up = limit ? num[pos] : 9; // 当前位能取的最大值\n    for (int i = 0; i <= up; i ++ ) {\n        // 根据题目要求更新状态...\n        res += dp(pos - 1, new_cnt, limit && i == up, lead && i == 0);\n    }\n    if (!limit && !lead) f[pos][cnt] = res; // 记忆化存储\n    return res;\n}\n// 初始化数字数组 num[], 然后调用 dp(len, 0, 1, 1)。" },

      // --- 【数论与数学】星系扩充：扩展欧几里得 ---
      { id: 'm_exgcd', name: "扩展欧几里得", x: 2600, y: 400, type: "hidden", desc: "求解 ax + by = gcd(a, b)，并求乘法逆元", code: "// 扩展欧几里得算法\n// 求出一组整数x, y，使得 ax + by = gcd(a, b)。\nint exgcd(int a, int b, int &x, int &y) {\n    if (!b) {\n        x = 1, y = 0;\n        return a;\n    }\n    int d = exgcd(b, a % b, y, x); // 注意x, y交换位置\n    y -= (a / b) * x;\n    return d;\n}\n\n// 应用1: 求解线性同余方程 ax ≡ b (mod m)\n// 即求 ax + my = b。有解条件：b % gcd(a, m) == 0\n// 先求 ax0 + my0 = d = gcd(a, m)\n// 则特解 x = x0 * b / d\n\n// 应用2: 求逆元 (当a与m互质时)\n// 解 ax ≡ 1 (mod m) -> ax + my = 1\n// 用exgcd(a, m, x, y)求出x即为a的逆元。" },


      // =========================================================
      // 🌌 第二次扩充：深化核心星系
      // =========================================================
      // --- 【数据结构】星系：进阶查找结构 ---
      { id: 'ds_skiplist', name: "跳表", x: 3500, y: 700, type: "hidden", desc: "基于并联链表实现的、概率平衡的O(log n)查询结构", code: "// 跳表示意图：多级索引，加速查找。\n// 核心操作：查找、插入、删除。\nstruct Node {\n    int val;\n    vector<Node*> next; // 每一层的下一个节点指针\n    Node(int _val, int level) : val(_val), next(level, nullptr) {}\n};\n\nclass Skiplist {\nprivate:\n    Node* head;\n    int maxLevel = 16; // 最大索引层数\n    double p = 0.5;    // 晋升概率\n    int randomLevel() {\n        int level = 1;\n        while ((rand() & 0xFFFF) < (p * 0xFFFF) && level < maxLevel) level++;\n        return level;\n    }\npublic:\n    Skiplist() { head = new Node(-1, maxLevel); }\n    \n    bool search(int target) {\n        Node* cur = head;\n        for (int i = maxLevel - 1; i >= 0; i--) {\n            while (cur->next[i] && cur->next[i]->val < target) cur = cur->next[i];\n        }\n        cur = cur->next[0];\n        return cur && cur->val == target;\n    }\n    \n    void add(int num) {\n        vector<Node*> update(maxLevel, head);\n        Node* cur = head;\n        for (int i = maxLevel - 1; i >= 0; i--) {\n            while (cur->next[i] && cur->next[i]->val < num) cur = cur->next[i];\n            update[i] = cur;\n        }\n        int level = randomLevel();\n        Node* newNode = new Node(num, level);\n        for (int i = 0; i < level; i++) {\n            newNode->next[i] = update[i]->next[i];\n            update[i]->next[i] = newNode;\n        }\n    }\n    \n    bool erase(int num) {\n        vector<Node*> update(maxLevel, nullptr);\n        Node* cur = head;\n        for (int i = maxLevel - 1; i >= 0; i--) {\n            while (cur->next[i] && cur->next[i]->val < num) cur = cur->next[i];\n            update[i] = cur;\n        }\n        cur = cur->next[0];\n        if (!cur || cur->val != num) return false;\n        for (int i = 0; i < cur->next.size(); i++) {\n            if (update[i]->next[i] != cur) break;\n            update[i]->next[i] = cur->next[i];\n        }\n        delete cur;\n        return true;\n    }\n};" },

      // --- 【基础筑基】星系：前缀和与差分 ---
      { id: 'b_prefix', name: "前缀和与差分", x: 3500, y: 1300, type: "hidden", desc: "区间求和的奥义与其逆运算", code: "// 一维前缀和 (下标从1开始)\n// S[i] = a[1] + a[2] + ... + a[i]\n// 求 a[l ~ r] 的和：S[r] - S[l - 1]\nS[0] = 0;\nfor (int i = 1; i <= n; i ++ ) S[i] = S[i - 1] + a[i];\n\n// 一维差分\n// 给区间[l, r]中的每个数加上c：B[l] += c, B[r + 1] -= c\n// 差分数组B是原数组A的逆：A[i] = B[1] + ... + B[i]\nvoid insert(int l, int r, int c) {\n    b[l] += c;\n    b[r + 1] -= c;\n}\n// 初始化：可视为在[i, i]区间插入a[i]\n// 最终通过求前缀和得到操作后的原数组\n\n// 二维前缀和\n// S[i][j] = 第i行j列格子左上部分所有元素的和\n// 以(x1, y1)为左上角，(x2, y2)为右下角的子矩阵和为：\n// S[x2][y2] - S[x1 - 1][y2] - S[x2][y1 - 1] + S[x1 - 1][y1 - 1]\nfor (int i = 1; i <= n; i ++ )\n    for (int j = 1; j <= m; j ++ )\n        S[i][j] = S[i - 1][j] + S[i][j - 1] - S[i - 1][j - 1] + a[i][j];\n\n// 二维差分（给子矩阵同时加c）\nvoid insert(int x1, int y1, int x2, int y2, int c) {\n    b[x1][y1] += c;\n    b[x2 + 1][y1] -= c;\n    b[x1][y2 + 1] -= c;\n    b[x2 + 1][y2 + 1] += c;\n}" },

      // --- 【搜索与图论】星系：最短路与生成树补充 ---
      { id: 'g_floyd', name: "Floyd 算法", x: 3200, y: 1900, type: "hidden", desc: "多源汇最短路，动态规划思想的直接体现", code: "// 初始化\nfor (int i = 1; i <= n; i ++ )\n    for (int j = 1; j <= n; j ++ )\n        if (i == j) d[i][j] = 0;\n        else d[i][j] = INF;\n\n// 算法结束后，d[a][b]表示a到b的最短距离\nvoid floyd() {\n    for (int k = 1; k <= n; k ++ )\n        for (int i = 1; i <= n; i ++ )\n            for (int j = 1; j <= n; j ++ )\n                d[i][j] = min(d[i][j], d[i][k] + d[k][j]);\n}\n\n// 原理：基于动态规划\n// d[k][i][j] 表示从i出发，只经过1~k这些中间点，到达j的最短距离。\n// 状态转移：d[k][i][j] = min(d[k-1][i][j], d[k-1][i][k] + d[k-1][k][j])\n// 第一维可以优化掉，成为常见的三重循环。" },
      { id: 'g_prim', name: "Prim 算法", x: 3200, y: 2300, type: "hidden", desc: "另一种最小生成树算法，类似Dijkstra，从点出发", code: "// 朴素版Prim (稠密图) O(n^2)\nint prim() {\n    memset(dist, 0x3f, sizeof dist);\n    int res = 0;\n    for (int i = 0; i < n; i ++ ) {\n        int t = -1;\n        for (int j = 1; j <= n; j ++ )\n            if (!st[j] && (t == -1 || dist[t] > dist[j]))\n                t = j;\n        if (i && dist[t] == INF) return INF; // 不连通\n        if (i) res += dist[t]; // 先累加，再更新，防止负自环\n        st[t] = true;\n        for (int j = 1; j <= n; j ++ ) dist[j] = min(dist[j], g[t][j]);\n    }\n    return res;\n}\n\n// 堆优化版Prim (稀疏图) O(m log n)，类似Dijkstra\nint prim_heap() {\n    memset(dist, 0x3f, sizeof dist);\n    dist[1] = 0;\n    priority_queue<PII, vector<PII>, greater<PII>> heap;\n    heap.push({0, 1}); // {距离, 节点}\n    int res = 0, cnt = 0; // cnt记录加入生成树的节点数\n    while (heap.size()) {\n        auto t = heap.top(); heap.pop();\n        int ver = t.second, distance = t.first;\n        if (st[ver]) continue;\n        st[ver] = true;\n        res += distance;\n        cnt ++ ;\n        for (int i = h[ver]; i != -1; i = ne[i]) {\n            int j = e[i];\n            if (dist[j] > w[i]) {\n                dist[j] = w[i];\n                heap.push({dist[j], j});\n            }\n        }\n    }\n    if (cnt < n) return INF; // 图不连通\n    return res;\n}" },

      // --- 【动态规划】星系：状态机模型 ---
      { id: 'dp_statemachine', name: "状态机 DP", x: 3500, y: 2100, type: "hidden", desc: "将过程抽象为状态和转移，解决复杂决策问题", code: "// 经典例题：股票买卖系列 (以买卖一次为例)\n// 状态表示：\n// f[i][0] 第i天结束时，未持有股票的最大利润。\n// f[i][1] 第i天结束时，持有股票的最大利润。\n// 状态转移：\n// f[i][0] = max(f[i-1][0], f[i-1][1] + prices[i-1]);\n//           (昨天也没持有， 昨天持有但今天卖出)\n// f[i][1] = max(f[i-1][1], -prices[i-1]);\n//           (昨天也持有，   昨天未持有但今天买入) 注意只能买一次，所以是 -price\n// 初始化：\n// f[0][0] = 0; // 第0天，未持有，利润0\n// f[0][1] = -INF; // 第0天不可能持有股票\nint maxProfit(vector<int>& prices) {\n    int n = prices.size();\n    vector<vector<int>> f(n + 1, vector<int>(2, 0));\n    f[0][0] = 0; f[0][1] = -1e9;\n    for (int i = 1; i <= n; i++) {\n        f[i][0] = max(f[i-1][0], f[i-1][1] + prices[i-1]);\n        f[i][1] = max(f[i-1][1], -prices[i-1]);\n    }\n    return f[n][0];\n}\n\n// 其他变种（交易多次、含冷冻期、含手续费）都是状态机模型的变体，状态设计和转移方程略有不同。" },

      // --- 【数论与数学】星系：欧拉函数 ---
      { id: 'm_euler', name: "欧拉函数", x: 3200, y: 400, type: "hidden", desc: "求小于n且与n互质的数的个数，φ(n)", code: "// 定义：φ(n) = 1~n中与n互质的数的个数。\n// 求单个数的欧拉函数 O(sqrt(n))\nint phi(int x) {\n    int res = x;\n    for (int i = 2; i <= x / i; i ++ )\n        if (x % i == 0) {\n            res = res / i * (i - 1); // 先除后乘防止溢出\n            while (x % i == 0) x /= i;\n        }\n    if (x > 1) res = res / x * (x - 1);\n    return res;\n}\n// 公式：若 N = p1^a1 * p2^a2 * ... * pk^ak\n// 则 φ(N) = N * (1 - 1/p1) * (1 - 1/p2) * ... * (1 - 1/pk)\n\n// 筛法求1~n中每个数的欧拉函数 O(n)\nint primes[N], cnt;\nint euler[N];\nbool st[N];\n\nvoid get_eulers(int n) {\n    euler[1] = 1;\n    for (int i = 2; i <= n; i ++ ) {\n        if (!st[i]) {\n            primes[cnt ++ ] = i;\n            euler[i] = i - 1; // 质数的欧拉函数为 i-1\n        }\n        for (int j = 0; primes[j] <= n / i; j ++ ) {\n            int t = primes[j] * i;\n            st[t] = true;\n            if (i % primes[j] == 0) {\n                euler[t] = euler[i] * primes[j]; // pj是i的质因子\n                break;\n            }\n            euler[t] = euler[i] * (primes[j] - 1); // pj不是i的质因子\n        }\n    }\n}\n// 欧拉定理：若a与n互质，则 a^φ(n) ≡ 1 (mod n)\n// 费马小定理是欧拉定理在n为质数时的特例。" },

      // =========================================================
      // 🌌 第三次扩充：字符串、图论与组合数学
      // =========================================================
      // --- 【字符串处理】核心算法：KMP ---
      { id: 'str_kmp', name: "KMP 算法", x: 3800, y: 700, type: "hidden", desc: "字符串匹配的经典算法，利用‘部分匹配表’避免主串指针回溯", code: "// KMP (Knuth-Morris-Pratt) 字符串匹配算法\n// 核心：求模式串P的 next 数组（前缀函数）\n// next[i] 表示子串 P[0...i] 中，最长的、相等的前缀与后缀的长度（不包括自身）\n//\n// 例如：模式串 P = \"ababc\"\n// next[0] = 0; (\"a\" 无前缀后缀)\n// next[1] = 0; (\"ab\" 前缀\"a\"，后缀\"b\"，不相等)\n// next[2] = 1; (\"aba\" 前缀\"a\"=后缀\"a\")\n// next[3] = 2; (\"abab\" 前缀\"ab\"=后缀\"ab\")\n// next[4] = 0; (\"ababc\" 无相等前后缀)\n\n// 求 next 数组的模板 (下标从1开始更常用)\nchar p[N]; // 模式串\nint ne[N]; // next数组，ne[1] = 0\nint n;     // 模式串长度\n\n// 求 next 数组的过程 (i从2开始，j从0开始)\nfor (int i = 2, j = 0; i <= n; i ++ ) {\n    while (j && p[i] != p[j + 1]) j = ne[j]; // 不断回退，直到匹配或j=0\n    if (p[i] == p[j + 1]) j ++ ; // 匹配成功，j前进\n    ne[i] = j; // 记录\n}\n\n// KMP 匹配过程 (s是主串，p是模式串)\nchar s[M], p[N];\nint n, m; // n = strlen(p+1), m = strlen(s+1)\n\n// 先求模式串p的next数组 ...\n\nfor (int i = 1, j = 0; i <= m; i ++ ) { // i从1开始，主串指针不回溯\n    while (j && s[i] != p[j + 1]) j = ne[j]; // 不匹配，模式串指针j回退\n    if (s[i] == p[j + 1]) j ++ ; // 匹配，j前进\n    if (j == n) { // 匹配成功\n        printf(\"%d \", i - n); // 输出在主串中的起始位置（从0开始计需 i-n+1）\n        j = ne[j]; // 继续寻找下一个匹配位置\n    }\n}\n\n// 时间复杂度：O(n+m)，空间复杂度：O(n)。" },

      // --- 【图论】高级算法：二分图最大匹配 ---
      { id: 'g_hungarian', name: "匈牙利算法", x: 3500, y: 2100, type: "hidden", desc: "求解二分图最大匹配的经典DFS算法（增广路算法）", code: "// 匈牙利算法 (邻接表存图，只存左边指向右边的边)\n// 二分图：顶点分为两个集合U和V，所有边连接U和V中的点。\n// 匹配：一组边的集合，其中任意两条边没有公共顶点。\n// 最大匹配：包含边数最多的匹配。\n\nint n1, n2;    // 左、右集合的点数\nint h[N], e[M], ne[M], idx; // 邻接表存边\nint match[N]; // match[j] = i，表示右边点j当前匹配的左点i (0表示未匹配)\nbool st[N];   // st[j] 在每一轮中，表示右边点j是否已被访问（防止重复搜索）\n\nvoid add(int a, int b) { e[idx] = b, ne[idx] = h[a], h[a] = idx ++ ; }\n\n// 为左部点x寻找增广路\nbool find(int x) {\n    for (int i = h[x]; i != -1; i = ne[i]) { // 遍历x能连接的所有右部点\n        int j = e[i];\n        if (!st[j]) { // 如果这一轮中j还没有被考虑过\n            st[j] = true;\n            // 如果j未匹配，或者可以为j的原配左点找到新的右点（即原配可以“让位”）\n            if (match[j] == 0 || find(match[j])) {\n                match[j] = x; // 将j匹配给x\n                return true;\n            }\n        }\n    }\n    return false; // x找不到增广路\n}\n\n// 主函数中求最大匹配数\nint res = 0;\nfor (int i = 1; i <= n1; i ++ ) { // 遍历所有左部点\n    memset(st, false, sizeof st); // 每一轮初始化st数组\n    if (find(i)) res ++ ; // 为左点i成功找到增广路，匹配数+1\n}\nprintf(\"%d\\n\", res);\n\n// 时间复杂度：O(n1 * m)，但实际运行很快。" },

      // --- 【组合数学】重要数列：卡特兰数 ---
      { id: 'm_catalan', name: "卡特兰数", x: 3500, y: 500, type: "hidden", desc: "组合数学中常见的数列，用于计数问题（如括号匹配、出栈序列、二叉树计数）", code: "// 卡特兰数 (Catalan Number) 递推公式\n// 定义: C0 = 1,  C(n) = C0*C(n-1) + C1*C(n-2) + ... + C(n-1)*C0\n// 常用计算公式:\n// 1. C(n) = C(2n, n) / (n + 1)   // 组合数公式\n// 2. C(n) = C(2n, n) - C(2n, n - 1) // 组合数差分公式\n// 3. 递推式: C(n) = C(n-1) * (4*n - 2) / (n + 1)\n\n// 前几项: 1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862 ...\n\n// 应用场景:\n// - n对括号的合法序列数\n// - n个节点的不同二叉搜索树个数\n// - 凸n+2边形的三角形划分方案数\n// - 栈的合法出栈序列数\n\n// 代码1：利用组合数公式计算卡特兰数 (需预处理阶乘和逆元)\nconst int MOD = 1e9 + 7;\nLL fac[N], infac[N];\n\nLL qmi(LL a, LL k) { /* 快速幂 */ }\n\n// 预处理阶乘和阶乘的逆元\nfac[0] = infac[0] = 1;\nfor (int i = 1; i < N; i ++ ) {\n    fac[i] = fac[i - 1] * i % MOD;\n    infac[i] = infac[i - 1] * qmi(i, MOD - 2) % MOD;\n}\n\nLL C(int a, int b) { // 组合数C(a, b)\n    if (a < b) return 0;\n    return fac[a] * infac[b] % MOD * infac[a - b] % MOD;\n}\n\nLL catalan(int n) {\n    // 公式 C(2n, n) / (n + 1)\n    return C(2 * n, n) * qmi(n + 1, MOD - 2) % MOD;\n}\n\n// 代码2：递推法计算卡特兰数 (适用于小n)\nLL cat[N];\ncat[0] = 1;\nfor (int i = 1; i <= n; i ++ ) {\n    cat[i] = 0;\n    for (int j = 0; j < i; j ++ )\n        cat[i] += cat[j] * cat[i - 1 - j];\n    // 如果取模，记得取模\n}\n// 或使用 cat[i] = cat[i-1] * (4*i - 2) / (i + 1);" },


      // =========================================================
      // 🌌 第四次扩充：进阶字符串、图论、DP优化与数论
      // =========================================================
      // --- 【字符串处理】进阶：AC自动机 ---
      { id: 'str_ac', name: "AC自动机", x: 4100, y: 700, type: "hidden", desc: "Trie树上的KMP，用于多模式串匹配", code: "// AC自动机 (Aho-Corasick automaton) = Trie + KMP next指针\n// 功能：在文本串S中同时查找多个模式串P1...Pk的出现位置\nconst int N = 100010; // 总字符数\nint tr[N][26], cnt[N], idx; // Trie树结构\nint ne[N]; // AC自动机的fail指针（类似KMP的next）\nchar str[N]; // 文本串\n\n// 1. 构建Trie树 (与普通Trie相同)\nvoid insert(char *s) {\n    int p = 0;\n    for (int i = 0; s[i]; i ++ ) {\n        int u = s[i] - 'a';\n        if (!tr[p][u]) tr[p][u] = ++ idx;\n        p = tr[p][u];\n    }\n    cnt[p] ++ ; // 在单词结尾节点做标记\n}\n\n// 2. 构建AC自动机的fail指针 (BFS层序遍历)\nvoid build() {\n    queue<int> q;\n    for (int u = 0; u < 26; u ++ ) // 初始化第一层\n        if (tr[0][u]) q.push(tr[0][u]);\n    while (q.size()) {\n        int t = q.front(); q.pop();\n        for (int u = 0; u < 26; u ++ ) {\n            int p = tr[t][u];\n            if (!p) tr[t][u] = tr[ne[t]][u]; // 路径压缩优化\n            else {\n                ne[p] = tr[ne[t]][u]; // 子节点的fail指针指向：父节点fail指针的对应孩子\n                q.push(p);\n            }\n        }\n    }\n}\n\n// 3. 匹配文本串\nint query(char *s) {\n    int res = 0;\n    for (int i = 0, j = 0; s[i]; i ++ ) {\n        int u = s[i] - 'a';\n        j = tr[j][u]; // 沿着Trie树（或压缩后的转移边）走\n        int p = j;\n        while (p) { // 沿着fail链向上跳，统计所有以当前字符结尾的模式串\n            res += cnt[p];\n            cnt[p] = 0; // 根据题目要求，可能需清空避免重复计数\n            p = ne[p];\n        }\n    }\n    return res;\n}\n// 应用：敏感词过滤、多关键词匹配等。" },
      // --- 【图论】强连通分量：Tarjan算法 ---
      { id: 'g_tarjan_scc', name: "Tarjan (强连通分量)", x: 3800, y: 1900, type: "hidden", desc: "基于DFS的算法，一次遍历求出有向图的所有强连通分量(SCC)", code: "// Tarjan算法求有向图强连通分量 (SCC)\n// 核心数组：\n// dfn[u]: 节点u的DFS序（时间戳）\n// low[u]: u或u的子树能够回溯到的最早的栈中节点的时间戳\n// stk: 栈，用于存储当前SCC的节点\n// in_stk[u]: 节点u是否在栈中\nint dfn[N], low[N], timestamp;\nint stk[N], top;\nbool in_stk[N];\nint id[N], scc_cnt; // id[u]: 节点u所属的SCC编号；scc_cnt: SCC计数器\nint sz[N]; // sz[i]: 编号为i的SCC包含的节点数\n\nvoid tarjan(int u) {\n    dfn[u] = low[u] = ++ timestamp;\n    stk[ ++ top] = u, in_stk[u] = true;\n    for (int i = h[u]; i != -1; i = ne[i]) {\n        int j = e[i];\n        if (!dfn[j]) { // j未访问\n            tarjan(j);\n            low[u] = min(low[u], low[j]);\n        } else if (in_stk[j]) { // j在栈中，说明是回边（横叉边不会在这里更新）\n            low[u] = min(low[u], dfn[j]);\n        }\n    }\n    // 如果u是某个SCC的根（dfn[u] == low[u]）\n    if (dfn[u] == low[u]) {\n        ++ scc_cnt;\n        int y;\n        do {\n            y = stk[top -- ];\n            in_stk[y] = false;\n            id[y] = scc_cnt;\n            sz[scc_cnt] ++ ;\n        } while (y != u); // 弹出直到u为止\n    }\n}\n\n// 主函数中遍历所有点（图可能不连通）\nfor (int i = 1; i <= n; i ++ )\n    if (!dfn[i])\n        tarjan(i);\n\n// 应用：\n// 1. 缩点：将每个SCC缩成一个新节点，构成DAG（有向无环图）。\n// 2. 求可达性、必经点等。\n// 注意：缩点后，节点编号的逆序（scc_cnt -> 1）即为拓扑序。" },
      // --- 【动态规划】优化：单调队列优化 ---
      { id: 'dp_monoqueue', name: "单调队列优化DP", x: 3800, y: 2500, type: "hidden", desc: "优化形如 f[i] = min/max{ f[j] + val(i, j) } 的DP，其中 j 在滑动窗口内", code: "// 经典模型：滑动窗口最值优化多重背包 (亦可用于其他区间最值问题)\n// 问题：有 N 种物品，容量为 V 的背包。第 i 种物品体积 v, 价值 w, 数量 s。\n// 朴素多重背包转移: f[j] = max( f[j], f[j - v] + w, f[j - 2*v] + 2*w, ... ) 复杂度 O(N*V*S)\n// 优化思路：将状态 j 按体积 v 的余数分组，每组内进行单调队列优化。\n//\n// 单调队列维护一个可能成为最优决策的候选集合，保证队列内下标和对应的价值单调。\n\nint f[N], g[N], q[N]; // f是dp数组，g是上一层的副本，q是单调队列（存下标）\n\n// 对于每种物品 i (体积v, 价值w, 数量s)\nfor (int j = 0; j <= m; j ++ ) g[j] = f[j]; // 备份上一层\nfor (int r = 0; r < v; r ++ ) { // 枚举余数 r = j % v\n    int hh = 0, tt = -1; // 队首、队尾\n    for (int k = 0; r + k * v <= m; k ++ ) { // 枚举组内第k个物品 (k = (j-r)/v)\n        int j = r + k * v; // 当前背包容量\n        // 维护队列头部，删除超出数量s的决策 (窗口左边界)\n        while (hh <= tt && k - q[hh] > s) hh ++ ; // 如果队首下标与k的距离超过s，出队\n        // 用队首（最优决策）更新 f[j]\n        if (hh <= tt) f[j] = max(f[j], g[q[hh]] + (k - q[hh]) * w);\n        // 维护队列尾部单调性，将当前决策 k 入队\n        while (hh <= tt && g[q[tt]] - q[tt] * w <= g[k] - k * w) tt -- ;\n        q[ ++ tt] = k;\n    }\n}\n// 复杂度优化为 O(N*V)\n//\n// 更通用的思考：将 f[j] = max{ f`[j - k*v] + k*w } 转化为在滑动窗口内求最大值的问题。\n// 单调队列维护的是关于 k 的线性函数 g(k) = f`[r + k*v] - k*w 的最大值。" },
      // --- 【数论】中国剩余定理 (CRT) ---
      { id: 'm_crt', name: "中国剩余定理", x: 3800, y: 400, type: "hidden", desc: "求解一元线性同余方程组，模数两两互质的情形", code: "// 中国剩余定理 (Chinese Remainder Theorem, CRT)\n// 问题：求解方程组\n// x ≡ a1 (mod m1)\n// x ≡ a2 (mod m2)\n// ...\n// x ≡ an (mod mn)\n// 其中 m1, m2, ..., mn 两两互质。\n\ntypedef long long LL;\n\n// 扩展欧几里得算法 (求逆元需要)\nLL exgcd(LL a, LL b, LL &x, LL &y) {\n    if (!b) { x = 1, y = 0; return a; }\n    LL d = exgcd(b, a % b, y, x);\n    y -= a / b * x;\n    return d;\n}\n\nLL CRT(LL a[], LL m[], int n) { // a是余数数组，m是模数数组，n是方程个数\n    LL M = 1; // 所有模数的乘积\n    for (int i = 0; i < n; i ++ ) M *= m[i];\n    LL res = 0;\n    for (int i = 0; i < n; i ++ ) {\n        LL Mi = M / m[i]; // 除了mi以外的模数乘积\n        LL ti, y;\n        // 求解 Mi * ti ≡ 1 (mod m[i])，即 Mi模m[i]的逆元 ti\n        exgcd(Mi, m[i], ti, y); // 因为Mi与mi互质，逆元存在\n        ti = (ti % m[i] + m[i]) % m[i]; // 确保逆元为正\n        res = (res + a[i] * Mi % M * ti % M) % M;\n    }\n    return (res % M + M) % M; // 最小非负整数解\n}\n// 示例：\n// 方程组：x ≡ 2(mod 3), x ≡ 3(mod 5), x ≡ 2(mod 7)\n// a[] = {2, 3, 2}, m[] = {3, 5, 7}\n// 调用 CRT(a, m, 3) 返回 23。\n//\n// 注意：模数必须两两互质。对于不互质的情况，需要使用扩展中国剩余定理 (ExCRT)。" },


      // =========================================================
      // 🌌 第五次扩充：网络流、数据结构扩展与DP高级优化
      // =========================================================
      // --- 【图论】网络流：最大流 Dinic 算法 ---
      {
        id: 'g_dinic',
        name: "Dinic 最大流",
        x: 4100,
        y: 1900,
        type: "hidden",
        desc: "网络流问题的核心算法，通过BFS分层与DFS多路增广高效求解最大流",
        code: "// Dinic 算法 (邻接表存边，包含反向边)\nconst int N = 10010, M = 200010; // 注意边数要开2倍（正向+反向）\nconst int INF = 1e9;\nint h[N], e[M], ne[M], f[M], idx; // f[] 存储边的容量\nint d[N], cur[N]; // d[]: BFS深度； cur[]: 当前弧优化\nint n, m, S, T; // 点数、边数、源点、汇点\n\nvoid add(int a, int b, int c) {\n    e[idx] = b, f[idx] = c, ne[idx] = h[a], h[a] = idx ++ ; // 正向边\n    e[idx] = a, f[idx] = 0, ne[idx] = h[b], h[b] = idx ++ ; // 反向边，初始容量0\n}\n\n// BFS 构建分层图，并判断是否存在增广路\nbool bfs() {\n    memset(d, -1, sizeof d);\n    queue<int> q;\n    q.push(S);\n    d[S] = 0;\n    cur[S] = h[S];\n    while (q.size()) {\n        int t = q.front(); q.pop();\n        for (int i = h[t]; ~i; i = ne[i]) {\n            int ver = e[i];\n            if (d[ver] == -1 && f[i]) { // 只考虑容量>0的边\n                d[ver] = d[t] + 1;\n                cur[ver] = h[ver];\n                if (ver == T) return true;\n                q.push(ver);\n            }\n        }\n    }\n    return false;\n}\n\n// DFS 寻找增广路，返回当前路径的流量\nint find(int u, int limit) {\n    if (u == T) return limit;\n    int flow = 0;\n    for (int i = cur[u]; ~i && flow < limit; i = ne[i]) {\n        cur[u] = i; // 当前弧优化，避免重复访问已经增广完的边\n        int ver = e[i];\n        if (d[ver] == d[u] + 1 && f[i]) {\n            int t = find(ver, min(f[i], limit - flow));\n            if (!t) d[ver] = -1; // 该点不可达，删除\n            f[i] -= t, f[i ^ 1] += t, flow += t; // 更新正向边和反向边\n        }\n    }\n    return flow;\n}\n\nint dinic() {\n    int r = 0, flow;\n    while (bfs()) // 每次BFS构建分层图\n        while (flow = find(S, INF)) // 一次BFS可以进行多路增广\n            r += flow;\n    return r;\n}\n// 时间复杂度：O(n²m)，但在实际图中远快于此上界，是求解最大流的高效算法。\n// 应用：二分图多重匹配、最小割、最大权闭合子图等问题的核心组件。"
      },
      // --- 【数据结构】树状数组扩展：区间修改与区间查询 ---
      {
        id: 'ds_fenwick_range',
        name: "树状数组 (区间修改+查询)",
        x: 3800,
        y: 900,
        type: "hidden",
        desc: "通过维护两个树状数组，实现O(log n)的区间加法和区间求和",
        code: "// 树状数组扩展：区间修改 + 区间查询\n// 问题：维护一个数组 a[1..n]，支持两种操作：\n// 1. 区间 [l, r] 每个数加上 d\n// 2. 查询区间 [l, r] 内所有数的和\n//\n// 推导：\n// 原数组 a[i]，差分数组 b[i] = a[i] - a[i-1] (a[0]=0)\n// 那么 a[i] = Σ_{j=1}^{i} b[j]\n// 前缀和 prefix_sum[x] = Σ_{i=1}^{x} a[i] = Σ_{i=1}^{x} Σ_{j=1}^{i} b[j]\n//                     = Σ_{j=1}^{x} (x - j + 1) * b[j]\n//                     = (x+1) * Σ_{j=1}^{x} b[j] - Σ_{j=1}^{x} j * b[j]\n// 因此，我们维护两个树状数组：\n// tr1 维护 b[i] 的前缀和，tr2 维护 i * b[i] 的前缀和。\n\nint n;\nLL tr1[N], tr2[N]; // 两个树状数组\nint a[N]; // 原数组\n\nint lowbit(int x) { return x & -x; }\n\nvoid add(LL tr[], int x, LL c) {\n    for (int i = x; i <= n; i += lowbit(i)) tr[i] += c;\n}\n\nLL sum(LL tr[], int x) {\n    LL res = 0;\n    for (int i = x; i; i -= lowbit(i)) res += tr[i];\n    return res;\n}\n\n// 区间 [l, r] 加上 d\nvoid range_add(int l, int r, int d) {\n    add(tr1, l, d), add(tr1, r + 1, -d);\n    add(tr2, l, l * d), add(tr2, r + 1, -(r + 1) * d);\n}\n\n// 查询前缀和 prefix_sum[x]\nLL prefix_sum(int x) {\n    return (x + 1) * sum(tr1, x) - sum(tr2, x);\n}\n\n// 查询区间和 [l, r]\nLL range_sum(int l, int r) {\n    return prefix_sum(r) - prefix_sum(l - 1);\n}\n\n// 初始化：\n// 读入初始数组 a[i]\n// for (int i = 1; i <= n; i ++ ) range_add(i, i, a[i]); // 等价于初始化差分数组\n// 或者直接构造差分数组：\n// for (int i = 1; i <= n; i ++ ) {\n//     int b = a[i] - a[i-1];\n//     add(tr1, i, b);\n//     add(tr2, i, i * b);\n// }"
      },
      // --- 【动态规划】优化：四边形不等式优化 ---
      {
        id: 'dp_quadrangle',
        name: "四边形不等式优化",
        x: 4100,
        y: 2500,
        type: "hidden",
        desc: "优化某些区间DP的决策点枚举，将O(n³)降至O(n²)，证明依赖于代价函数的四边形不等式性质",
        code: "// 四边形不等式优化 (以石子合并问题为例，求最小代价)\n// 原始DP: f[i][j] = min_{i≤k<j} { f[i][k] + f[k+1][j] + w(i,j) }\n// 满足以下条件时，可以用四边形不等式优化：\n// 1. 区间包含单调性：w(a,b) ≤ w(c,d) 当 [a,b] ⊆ [c,d]\n// 2. 四边形不等式：w(a,c) + w(b,d) ≤ w(a,d) + w(b,c) 当 a≤b≤c≤d\n// 若w满足上述条件，则f也满足四边形不等式，且决策点s[i][j]满足单调性：\n// s[i][j-1] ≤ s[i][j] ≤ s[i+1][j]\n// 从而可以将k的枚举范围从 [i, j-1] 缩小到 [s[i][j-1], s[i+1][j]]\n\nconst int N = 310;\nint n;\nint s[N], w[N][N]; // s:前缀和；w:区间合并代价\nint f[N][N], p[N][N]; // f:DP值；p:决策点记录\n\n// 初始化\nfor (int i = 1; i <= n; i ++ ) {\n    scanf(\"%d\", &s[i]);\n    s[i] += s[i - 1]; // 前缀和\n}\n// 计算代价函数 w[i][j] = s[j] - s[i-1] (石子合并的代价)\nfor (int i = 1; i <= n; i ++ )\n    for (int j = i; j <= n; j ++ )\n        w[i][j] = s[j] - s[i - 1];\n\n// 四边形不等式优化DP\nfor (int i = 1; i <= n; i ++ ) {\n    f[i][i] = 0;\n    p[i][i] = i; // 初始化决策点\n}\n\nfor (int len = 2; len <= n; len ++ ) { // 枚举区间长度\n    for (int i = 1; i + len - 1 <= n; i ++ ) { // 枚举左端点\n        int j = i + len - 1; // 右端点\n        f[i][j] = 1e9;\n        // 利用决策点的单调性，缩小枚举范围\n        for (int k = p[i][j - 1]; k <= p[i + 1][j]; k ++ ) {\n            int t = f[i][k] + f[k + 1][j] + w[i][j];\n            if (t < f[i][j]) {\n                f[i][j] = t;\n                p[i][j] = k; // 更新决策点\n            }\n        }\n    }\n}\nprintf(\"%d\\n\", f[1][n]);\n\n// 注意事项：\n// 1. 此优化适用于求最小值，对于最大值不一定成立。\n// 2. 需要先证明代价函数w满足四边形不等式。\n// 3. 该优化可以将时间复杂度从 O(n³) 降为 O(n²)。\n// 4. 并非所有区间DP都满足四边形不等式，需具体分析。"
      },

      
      // =========================================================
      // 🌌 第六次扩充：字符串哈希、计算几何、博弈论
      // =========================================================
      // --- 【字符串处理】快速匹配：字符串哈希 ---
      {
        id: 'str_hash',
        name: "字符串哈希",
        x: 4400,
        y: 700,
        type: "hidden",
        desc: "将字符串映射为整数，实现O(1)的任意子串比较，是字符串匹配的利器",
        code: "// 字符串前缀哈希法 (将字符串视为P进制数，对Q取模)\n// 注意：\n// 1. 不能将字符映射为0，否则会导致不同字符串有相同哈希值（如\"A\"和\"AA\"）\n// 2. 假定人品足够好，不存在冲突（通常取P=131或13331，Q=2^64，用unsigned long long自然溢出）\n\ntypedef unsigned long long ULL;\nconst int N = 100010, P = 131; // P通常取131或13331\nULL h[N], p[N]; // h[k]存储字符串前k个字母的哈希值，p[k]存储P^k\nchar str[N];\n\n// 初始化\nvoid init() {\n    p[0] = 1;\n    for (int i = 1; i <= n; i ++ ) {\n        h[i] = h[i - 1] * P + str[i]; // 计算前缀哈希值\n        p[i] = p[i - 1] * P; // 计算P的幂\n    }\n}\n\n// 计算子串str[l~r]的哈希值\nULL get(int l, int r) {\n    return h[r] - h[l - 1] * p[r - l + 1];\n}\n\n// 应用1：快速判断两个子串是否相等\n// if (get(l1, r1) == get(l2, r2)) 则子串相等\n\n// 应用2：配合二分求最长公共前缀（最长回文子串等）\n// 例如判断[l1, r1]和[l2, r2]的最长公共前缀长度，可以二分长度，用哈希判断\nint lcp(int l1, int l2, int len) {\n    int l = 0, r = len;\n    while (l < r) {\n        int mid = (l + r + 1) >> 1;\n        if (get(l1, l1 + mid - 1) == get(l2, l2 + mid - 1)) l = mid;\n        else r = mid - 1;\n    }\n    return l;\n}\n\n// 双哈希：当单哈希可能冲突时，可以用两个不同的P和Q计算两套哈希值，用pair存储\n// 更安全，但常数更大。通常竞赛中单哈希（自然溢出）即可。"
      },
      // --- 【计算几何】基础算法：凸包 ---
      {
        id: 'geo_convexhull',
        name: "凸包 (Andrew算法)",
        x: 4100,
        y: 1300,
        type: "hidden",
        desc: "求平面上点集的凸多边形外壳，Andrew算法先求下凸壳再求上凸壳",
        code: "// 二维凸包 (Andrew算法) O(n log n)\n// 步骤：\n// 1. 将所有点按x坐标排序，x相同按y排序\n// 2. 从左到右维护下凸壳\n// 3. 从右到左维护上凸壳\n// 4. 合并下凸壳和上凸壳（注意首尾重复点）\n\n#include <iostream>\n#include <algorithm>\n#include <cmath>\n#define x first\n#define y second\nusing namespace std;\ntypedef pair<double, double> PDD;\nconst int N = 10010;\n\nint n;\nPDD q[N];\nint stk[N]; // 栈，存储凸包中的点（下标）\nbool used[N]; // 标记点是否已在凸包中\n\n// 判断向量叉积 (ab × ac)\ndouble cross(PDD a, PDD b, PDD c) {\n    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);\n}\n\n// 计算两点间距离\ndouble dist(PDD a, PDD b) {\n    double dx = a.x - b.x;\n    double dy = a.y - b.y;\n    return sqrt(dx * dx + dy * dy);\n}\n\n// Andrew算法求凸包周长，返回凸包中的点数\ndouble andrew() {\n    sort(q, q + n);\n    int top = 0;\n    // 下凸壳\n    for (int i = 0; i < n; i ++ ) {\n        // 如果栈中至少有两个点，且当前点与栈顶两个点构成的向量不满足逆时针（叉积<=0），则弹出栈顶\n        while (top >= 2 && cross(q[stk[top - 2]], q[stk[top - 1]], q[i]) <= 0) {\n            used[stk[top - 1]] = false; // 注意：这里标记为未使用，因为上凸壳可能还会用到\n            top -- ;\n        }\n        stk[top ++ ] = i;\n        used[i] = true;\n    }\n    used[0] = false; // 第一个点在下凸壳和上凸壳都会用到，这里先标记为未使用，让上凸壳可以再用\n    // 上凸壳\n    for (int i = n - 1; i >= 0; i -- ) {\n        if (used[i]) continue; // 如果已经在凸壳中，跳过\n        while (top >= 2 && cross(q[stk[top - 2]], q[stk[top - 1]], q[i]) <= 0)\n            top -- ;\n        stk[top ++ ] = i;\n    }\n    // 此时栈中存储了凸包的所有点（逆时针顺序），但第一个点被存了两次（作为起点和终点）\n    // 计算凸包周长\n    double res = 0;\n    for (int i = 1; i < top; i ++ )\n        res += dist(q[stk[i - 1]], q[stk[i]]);\n    return res;\n}\n\n// 注意：如果题目要求输出凸包上的点，可以取stk[0]到stk[top-2]（去掉重复的终点）\n// 如果点共线，且希望保留共线的点，需要将叉积<=0改为<0（但这样求得的凸包可能不是严格凸的）"
      },
      // --- 【博弈论】基础：SG函数 ---
      {
        id: 'game_sg',
        name: "SG函数",
        x: 4400,
        y: 1900,
        type: "hidden",
        desc: "公平组合游戏的通用解法，将游戏状态映射为非负整数（SG值），通过异或运算判断胜负",
        code: "// SG函数 (Sprague-Grundy Function)\n// 公平组合游戏条件：\n// 1. 两名玩家轮流行动\n// 2. 游戏进程的任意时刻，可以执行的操作与轮到哪名玩家无关\n// 3. 不能行动的玩家判负\n//\n// 定义：\n// mex(S) = 不属于集合S的最小非负整数\n// SG(x) = mex{ SG(y) | y是x的后继状态 }\n// 终态（无法操作）的SG值为0\n//\n// 定理：\n// 1. 一个游戏的SG值等于其所有子游戏SG值的异或和\n// 2. SG(x) = 0 为必败态，否则为必胜态\n\n#include <iostream>\n#include <cstring>\n#include <unordered_set>\nusing namespace std;\nconst int N = 110, M = 10010;\n\nint n, m; // n堆石子，m种取法\nint s[N]; // 每次可以取的石子数的集合\nint f[M]; // 记忆化SG值，f[x]表示一堆有x个石子的SG值\n\n// 记忆化搜索求SG值\nint sg(int x) {\n    if (f[x] != -1) return f[x]; // 已计算过\n    unordered_set<int> S; // 存储所有后继状态的SG值\n    for (int i = 0; i < m; i ++ ) {\n        int take = s[i];\n        if (x >= take) S.insert(sg(x - take)); // 递归求后继状态SG值\n    }\n    // 求mex\n    for (int i = 0; ; i ++ )\n        if (!S.count(i)) {\n            f[x] = i;\n            break;\n        }\n    return f[x];\n}\n\nint main() {\n    cin >> m;\n    for (int i = 0; i < m; i ++ ) cin >> s[i];\n    cin >> n;\n    memset(f, -1, sizeof f);\n    int res = 0;\n    for (int i = 0; i < n; i ++ ) {\n        int x;\n        cin >> x;\n        res ^= sg(x); // 每堆石子的SG值异或和\n    }\n    if (res) puts(\"Yes\"); // 非零，先手必胜\n    else puts(\"No\");      // 零，先手必败\n    return 0;\n}\n\n// 应用：\n// 1. 经典Nim游戏：每堆石子的SG值就是石子数，因为SG(x)=x（可以证明）\n// 2. 台阶Nim、集合Nim、拆分Nim等变种\n// 3. 任何公平组合游戏都可以用SG函数分析"
      },



      // =========================================================
      // 🌌 第七次扩充：字符串高级、数据结构深化、动态规划精进
      // =========================================================
      // --- 【字符串处理】后缀数组（倍增法）---
      {
        id: 'str_sa',
        name: "后缀数组 (SA)",
        x: 4700,
        y: 700,
        type: "hidden",
        desc: "字符串所有后缀的排序数组，用于高效解决字符串匹配、最长公共前缀等问题",
        code: "// 后缀数组 (Suffix Array) - 倍增法 O(n log n)\n// sa[i]: 排名为i的后缀的起始下标\n// rk[i]: 起始下标为i的后缀的排名\n// height[i]: LCP(sa[i], sa[i-1])，即相邻排名的后缀的最长公共前缀\nconst int N = 1000010;\nchar s[N];\nint n, m; // n为字符串长度，m为字符集大小（用于基数排序）\nint sa[N], rk[N], height[N];\nint x[N], y[N], c[N]; // x第一关键字，y第二关键字，c基数排序桶\n\n// 获取字符的ASCII码，从1开始\nint get(char c) {\n    if (c >= 'a' && c <= 'z') return c - 'a' + 1;\n    if (c >= 'A' && c <= 'Z') return c - 'A' + 27;\n    return c - '0' + 53; // 根据需要调整\n}\n\n// 倍增法构建后缀数组\nvoid get_sa() {\n    // 第一轮排序：按单个字符排序\n    for (int i = 1; i <= n; i ++ ) c[x[i] = get(s[i])] ++ ;\n    for (int i = 2; i <= m; i ++ ) c[i] += c[i - 1];\n    for (int i = n; i; i -- ) sa[c[x[i]] -- ] = i;\n\n    for (int k = 1; k <= n; k <<= 1) { // k为当前倍增的跨度\n        // 按第二关键字排序\n        int num = 0;\n        for (int i = n - k + 1; i <= n; i ++ ) y[ ++ num] = i; // 没有第二关键字，排在最前\n        for (int i = 1; i <= n; i ++ )\n            if (sa[i] > k) y[ ++ num] = sa[i] - k;\n        // 按第一关键字排序\n        for (int i = 1; i <= m; i ++ ) c[i] = 0;\n        for (int i = 1; i <= n; i ++ ) c[x[i]] ++ ;\n        for (int i = 2; i <= m; i ++ ) c[i] += c[i - 1];\n        for (int i = n; i; i -- ) sa[c[x[y[i]]] -- ] = y[i];\n        // 更新排名数组x\n        swap(x, y);\n        x[sa[1]] = 1, num = 1;\n        for (int i = 2; i <= n; i ++ )\n            x[sa[i]] = (y[sa[i]] == y[sa[i - 1]] && y[sa[i] + k] == y[sa[i - 1] + k]) ? num : ++ num;\n        if (num == n) break; // 所有后缀排名已不同\n        m = num;\n    }\n}\n\n// 构建height数组\nvoid get_height() {\n    for (int i = 1; i <= n; i ++ ) rk[sa[i]] = i;\n    for (int i = 1, k = 0; i <= n; i ++ ) {\n        if (rk[i] == 1) continue;\n        if (k) k -- ; // height[i] >= height[i-1] - 1\n        int j = sa[rk[i] - 1];\n        while (i + k <= n && j + k <= n && s[i + k] == s[j + k]) k ++ ;\n        height[rk[i]] = k;\n    }\n}\n\n// 应用1：求任意两个后缀的LCP\n// LCP(i, j) = min(height[rk[i]+1], ..., height[rk[j]]) 假设rk[i] < rk[j]\n// 可用ST表预处理height，实现O(1)查询\n\n// 应用2：不同子串个数 = n*(n+1)/2 - sum(height[2..n])\n// 应用3：最长重复子串（可重叠） = max(height[1..n])\n// 应用4：最长不重叠重复子串：二分长度+height分组"
      },
      // --- 【数据结构】线段树：懒标记（Lazy Propagation）---
      {
        id: 'ds_segtree_lazy',
        name: "线段树 (懒标记)",
        x: 4400,
        y: 900,
        type: "hidden",
        desc: "支持区间修改的线段树，通过懒标记延迟更新，保证O(log n)复杂度",
        code: "// 线段树懒标记模板（区间加、区间求和）\nconst int N = 100010;\nint w[N]; // 原数组\nstruct Node {\n    int l, r;\n    LL sum; // 区间和\n    LL add; // 懒标记：表示该区间每个数要加的值\n} tr[N * 4];\n\n// 由子节点信息更新父节点\nvoid pushup(int u) {\n    tr[u].sum = tr[u << 1].sum + tr[u << 1 | 1].sum;\n}\n\n// 将懒标记下传\nvoid pushdown(int u) {\n    auto &root = tr[u], &left = tr[u << 1], &right = tr[u << 1 | 1];\n    if (root.add) {\n        // 更新左儿子\n        left.add += root.add;\n        left.sum += (LL)(left.r - left.l + 1) * root.add;\n        // 更新右儿子\n        right.add += root.add;\n        right.sum += (LL)(right.r - right.l + 1) * root.add;\n        // 清空当前节点标记\n        root.add = 0;\n    }\n}\n\n// 建树\nvoid build(int u, int l, int r) {\n    if (l == r) tr[u] = {l, r, w[r], 0};\n    else {\n        tr[u] = {l, r};\n        int mid = l + r >> 1;\n        build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);\n        pushup(u);\n    }\n}\n\n// 区间修改 [l, r] 每个数加d\nvoid modify(int u, int l, int r, int d) {\n    if (tr[u].l >= l && tr[u].r <= r) { // 完全覆盖\n        tr[u].sum += (LL)(tr[u].r - tr[u].l + 1) * d;\n        tr[u].add += d;\n    } else {\n        pushdown(u); // 分裂前必须下传标记\n        int mid = tr[u].l + tr[u].r >> 1;\n        if (l <= mid) modify(u << 1, l, r, d);\n        if (r > mid) modify(u << 1 | 1, l, r, d);\n        pushup(u);\n    }\n}\n\n// 区间查询 [l, r] 的和\nLL query(int u, int l, int r) {\n    if (tr[u].l >= l && tr[u].r <= r) return tr[u].sum;\n    pushdown(u); // 查询前也要下传标记，因为查询可能依赖子节点的最新值\n    int mid = tr[u].l + tr[u].r >> 1;\n    LL sum = 0;\n    if (l <= mid) sum += query(u << 1, l, r);\n    if (r > mid) sum += query(u << 1 | 1, l, r);\n    return sum;\n}\n\n// 注意：\n// 1. 懒标记适用于区间修改操作具有\"可叠加性\"（如加法、乘法）\n// 2. 对于赋值操作，懒标记的处理方式不同（需要覆盖而不是累加）\n// 3. 有多个懒标记时（如同时加和乘），需要定义优先级和合并规则"
      },
      // --- 【动态规划】数位DP详细实现 ---
      {
        id: 'dp_digit_detail',
        name: "数位DP (模板详解)",
        x: 4100,
        y: 2700,
        type: "hidden",
        desc: "基于记忆化搜索的标准数位DP模板，解决数字中满足特定条件的计数问题",
        code: "// 数位DP通用模板 (记忆化搜索)\n// 问题：统计区间 [L, R] 内满足某条件的数的个数\n// 转化为：count(R) - count(L-1)\n// 核心函数 dfs(pos, state, limit, lead)\n// pos: 当前处理到第几位（从高位到低位）\n// state: 当前状态（根据题目定义，如前一位数字、数字和、模数等）\n// limit: 是否受到上界的限制（如计算到R，则前几位等于R时limit=true）\n// lead: 是否有前导零（处理前导0对状态的影响）\n\n#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long LL;\nconst int N = 20; // 最大位数\n\nLL dp[N][state_size]; // 记忆化数组，第二维根据状态大小定义\nint a[N]; // 存储数字的每一位（从低位到高位或从高位到低位）\n\n// 示例：统计 [1, R] 中，数位上不包含数字4且不包含连续62的数字个数\n// 状态设计：pos, pre (上一位数字), limit, lead\n\nLL dfs(int pos, int pre, bool limit, bool lead) {\n    // 递归边界：已经处理完所有位\n    if (pos == 0) return 1; // 找到一个合法数字\n    // 记忆化：只有在 !limit && !lead 时才能直接用缓存\n    // 因为limit=true或lead=true时，状态是受限的，不能通用\n    if (!limit && !lead && dp[pos][pre] != -1) return dp[pos][pre];\n    \n    int up = limit ? a[pos] : 9; // 当前位能取的最大值\n    LL res = 0;\n    for (int i = 0; i <= up; i ++ ) {\n        // 跳过数字4\n        if (i == 4) continue;\n        // 检查是否出现62\n        if (pre == 6 && i == 2) continue;\n        // 处理前导0：如果lead为true且当前位为0，则pre应为-1（表示还没有非0位）\n        // 这里我们定义pre为-1表示前导0状态\n        int new_pre = i;\n        if (lead && i == 0) new_pre = -1; // 前导0情况下，pre保持-1\n        \n        res += dfs(pos - 1, new_pre, limit && i == up, lead && i == 0);\n    }\n    // 记录状态：只有在无限制且无前导0时才记录\n    if (!limit && !lead) dp[pos][pre] = res;\n    return res;\n}\n\nLL count(LL x) {\n    if (x <= 0) return 0;\n    // 将数字x分解为数组a\n    int len = 0;\n    while (x) {\n        a[++ len] = x % 10; // 这里从低位到高位存储\n        x /= 10;\n    }\n    memset(dp, -1, sizeof dp); // 初始化记忆化数组\n    // 注意：从最高位开始递归，pre初始化为-1（表示前导0），limit=true，lead=true\n    return dfs(len, -1, true, true);\n}\n\nint main() {\n    LL L, R;\n    while (cin >> L >> R, L || R) {\n        cout << count(R) - count(L - 1) << endl;\n    }\n    return 0;\n}\n\n// 其他常见数位DP变种：\n// 1. 数字和：状态为 sum，表示已选数字的和\n// 2. 模数：状态为 mod，表示当前数字对某数取模的结果\n// 3. 二进制数位DP：将数字转为二进制处理\n// 4. 状态压缩：如数字出现次数的奇偶性等"
      },


         // =========================================================
      // 🌌 第八次扩充：网络流进阶、平衡树、状态压缩DP
      // =========================================================
      // --- 【图论】费用流：最小费用最大流 ---
      {
        id: 'g_mcmf',
        name: "最小费用最大流",
        x: 4700,
        y: 2300,
        type: "hidden",
        desc: "在最大流的基础上，每条边有单位费用，求在最大流的情况下最小总费用",
        code: "// 最小费用最大流 (SPFA 找费用最短路，然后增广)\n// 注意：图中不能有负环（但可以有负权边，因为是最小费用，常用SPFA）\n// 存储：邻接表，每条边存储 {容量, 费用, 反向边索引}\nconst int N = 5010, M = 100010, INF = 1e8;\nint h[N], e[M], f[M], w[M], ne[M], idx; // f:容量，w:费用\nint dist[N], pre[N], incf[N]; // dist:费用最短路，pre:前驱边，incf:可增广流量\nbool st[N];\nint n, m, S, T;\n\nvoid add(int a, int b, int c, int d) {\n    e[idx] = b, f[idx] = c, w[idx] = d, ne[idx] = h[a], h[a] = idx ++ ;\n    e[idx] = a, f[idx] = 0, w[idx] = -d, ne[idx] = h[b], h[b] = idx ++ ;\n}\n\nbool spfa() {\n    queue<int> q;\n    memset(dist, 0x3f, sizeof dist);\n    memset(incf, 0, sizeof incf);\n    q.push(S);\n    dist[S] = 0, incf[S] = INF;\n    while (q.size()) {\n        int t = q.front(); q.pop();\n        st[t] = false;\n        for (int i = h[t]; ~i; i = ne[i]) {\n            int ver = e[i];\n            if (f[i] && dist[ver] > dist[t] + w[i]) { // 容量>0才考虑\n                dist[ver] = dist[t] + w[i];\n                pre[ver] = i; // 记录前驱边\n                incf[ver] = min(incf[t], f[i]);\n                if (!st[ver]) {\n                    q.push(ver);\n                    st[ver] = true;\n                }\n            }\n        }\n    }\n    return incf[T] > 0; // 汇点可增广流量>0\n}\n\nvoid EK(int &flow, int &cost) {\n    flow = cost = 0;\n    while (spfa()) {\n        int t = incf[T]; // 本次增广流量\n        flow += t, cost += t * dist[T];\n        for (int i = T; i != S; i = e[pre[i] ^ 1]) { // 逆向更新残余网络\n            f[pre[i]] -= t;\n            f[pre[i] ^ 1] += t;\n        }\n    }\n}\n\n// 调用：EK(max_flow, min_cost);\n// 注意：如果图中存在负权边，SPFA可以处理；如果有负环，则需要先处理负环。\n// 另一种写法：使用Dijkstra（需要势能函数，将费用转为非负），效率更高。"
      },
      // --- 【数据结构】平衡树：Treap ---
      {
        id: 'ds_treap',
        name: "Treap",
        x: 5000,
        y: 900,
        type: "hidden",
        desc: "通过随机优先级维护平衡的二叉搜索树，支持插入、删除、查询第k大、查询排名等操作",
        code: "// Treap = Tree + Heap\n// 每个节点有两个值：key（满足BST性质）和 priority（满足堆性质，随机生成）\n// 通过旋转操作维护平衡，期望高度O(log n)\n\n#include <iostream>\n#include <cstdio>\n#include <cstdlib>\n#include <ctime>\nusing namespace std;\n\nconst int N = 100010, INF = 1e9;\nstruct Node {\n    int l, r;\n    int key, val; // key是BST的键，val是随机优先级\n    int cnt, size; // cnt:当前key出现的次数，size:子树大小\n} tr[N];\nint root, idx;\n\nvoid pushup(int p) {\n    tr[p].size = tr[tr[p].l].size + tr[tr[p].r].size + tr[p].cnt;\n}\n\n// 右旋\nvoid zig(int &p) {\n    int q = tr[p].l;\n    tr[p].l = tr[q].r, tr[q].r = p, p = q;\n    pushup(tr[p].r), pushup(p);\n}\n\n// 左旋\nvoid zag(int &p) {\n    int q = tr[p].r;\n    tr[p].r = tr[q].l, tr[q].l = p, p = q;\n    pushup(tr[p].l), pushup(p);\n}\n\n// 创建新节点\nint get_node(int key) {\n    tr[++ idx].key = key;\n    tr[idx].val = rand(); // 随机优先级\n    tr[idx].cnt = tr[idx].size = 1;\n    return idx;\n}\n\n// 初始化：创建两个哨兵节点，避免边界判断\nvoid build() {\n    get_node(-INF), get_node(INF);\n    root = 1, tr[1].r = 2;\n    pushup(root);\n    if (tr[1].val < tr[2].val) zag(root);\n}\n\n// 插入\nvoid insert(int &p, int key) {\n    if (!p) p = get_node(key);\n    else if (tr[p].key == key) tr[p].cnt ++ ;\n    else if (tr[p].key > key) {\n        insert(tr[p].l, key);\n        if (tr[tr[p].l].val > tr[p].val) zig(p); // 维护堆性质\n    } else {\n        insert(tr[p].r, key);\n        if (tr[tr[p].r].val > tr[p].val) zag(p);\n    }\n    pushup(p);\n}\n\n// 删除\nvoid remove(int &p, int key) {\n    if (!p) return;\n    if (tr[p].key == key) {\n        if (tr[p].cnt > 1) tr[p].cnt -- ;\n        else if (tr[p].l || tr[p].r) { // 不是叶子节点，通过旋转将其变为叶子节点\n            if (!tr[p].r || tr[tr[p].l].val > tr[tr[p].r].val) {\n                zig(p);\n                remove(tr[p].r, key);\n            } else {\n                zag(p);\n                remove(tr[p].l, key);\n            }\n        } else p = 0; // 叶子节点，直接删除\n    } else if (tr[p].key > key) remove(tr[p].l, key);\n    else remove(tr[p].r, key);\n    pushup(p);\n}\n\n// 查询key的排名（比key小的数的个数+1）\nint get_rank_by_key(int p, int key) {\n    if (!p) return 0;\n    if (tr[p].key == key) return tr[tr[p].l].size + 1;\n    if (tr[p].key > key) return get_rank_by_key(tr[p].l, key);\n    return tr[tr[p].l].size + tr[p].cnt + get_rank_by_key(tr[p].r, key);\n}\n\n// 查询排名为rank的数\nint get_key_by_rank(int p, int rank) {\n    if (!p) return INF;\n    if (tr[tr[p].l].size >= rank) return get_key_by_rank(tr[p].l, rank);\n    if (tr[tr[p].l].size + tr[p].cnt >= rank) return tr[p].key;\n    return get_key_by_rank(tr[p].r, rank - tr[tr[p].l].size - tr[p].cnt);\n}\n\n// 找到key的前驱（严格小于key的最大数）\nint get_prev(int p, int key) {\n    if (!p) return -INF;\n    if (tr[p].key >= key) return get_prev(tr[p].l, key);\n    return max(tr[p].key, get_prev(tr[p].r, key));\n}\n\n// 找到key的后继（严格大于key的最小数）\nint get_next(int p, int key) {\n    if (!p) return INF;\n    if (tr[p].key <= key) return get_next(tr[p].r, key);\n    return min(tr[p].key, get_next(tr[p].l, key));\n}\n\n// 使用示例：\n// build(); // 初始化\n// insert(root, val); // 插入，注意root是引用\n// remove(root, val); // 删除\n// rank = get_rank_by_key(root, val) - 1; // 因为有两个哨兵，排名要减1\n// key = get_key_by_rank(root, rank + 1); // 同理，排名要加1\n// prev = get_prev(root, val);\n// next = get_next(root, val);"
      },
      // --- 【动态规划】状态压缩：旅行商问题 ---
      {
        id: 'dp_tsp',
        name: "旅行商问题 (TSP)",
        x: 4700,
        y: 2700,
        type: "hidden",
        desc: "经典的NP-Hard问题，用状态压缩DP求解小规模情况，f[state][j]表示已访问状态state，最后在j点的最短路径",
        code: "// 旅行商问题 (Traveling Salesman Problem)\n// 问题：有n个城市，从城市0出发，经过每个城市恰好一次，然后回到起点，求最短路径。\n// 状态表示：f[state][j]\n//   state: 一个n位二进制数，第i位为1表示已经访问过城市i\n//   j: 当前所在城市编号\n// 状态计算：f[state][j] = min{ f[state_j][k] + w[k][j] }\n//   其中 state_j 是 state 去掉j的状态，k是 state_j 中已访问的城市。\n\n#include <iostream>\n#include <cstring>\n#include <algorithm>\nusing namespace std;\n\nconst int N = 20, M = 1 << N, INF = 0x3f3f3f3f;\nint n;\nint w[N][N]; // 邻接矩阵，w[i][j]表示i到j的距离\nint f[M][N]; // 注意状态数量：2^n * n，当n=20时约为1亿，需要优化空间或使用其他算法\n\nint main() {\n    cin >> n;\n    for (int i = 0; i < n; i ++ )\n        for (int j = 0; j < n; j ++ )\n            cin >> w[i][j];\n    \n    memset(f, 0x3f, sizeof f);\n    f[1][0] = 0; // 起点0，状态为只有0被访问（第0位为1），距离为0\n    \n    for (int state = 0; state < 1 << n; state ++ ) // 枚举所有状态\n        for (int j = 0; j < n; j ++ ) // 枚举当前所在城市\n            if (f[state][j] < INF) { // 如果状态可达\n                for (int k = 0; k < n; k ++ ) // 枚举下一个城市\n                    if (!(state >> k & 1)) { // 如果城市k未被访问\n                        int new_state = state | (1 << k);\n                        f[new_state][k] = min(f[new_state][k], f[state][j] + w[j][k]);\n                    }\n            }\n    \n    // 最终状态：所有城市都访问过，且最后回到起点0\n    int res = INF;\n    for (int i = 1; i < n; i ++ ) // 从任意非起点城市回到起点\n        res = min(res, f[(1 << n) - 1][i] + w[i][0]);\n    cout << res << endl;\n    return 0;\n}\n\n// 优化：\n// 1. 空间优化：可以用滚动数组，但注意状态转移的顺序（state从小到大）。\n// 2. 剪枝：如果当前距离已经大于答案，可以剪枝。\n// 3. 对于n比较大的情况，可以用启发式算法（如模拟退火、遗传算法）。\n\n// 变种：\n// 1. 可以不回到起点，则答案为 min(f[(1<<n)-1][i])。\n// 2. 可以从任意点出发，则初始化所有f[1<<i][i]=0。\n// 3. 求最大值（最长路径）同理。"
      },



      // =========================================================
      // 🌌 第九次扩充：后缀自动机、树链剖分、扫描线
      // =========================================================
      // --- 【字符串处理】终极武器：后缀自动机（SAM）---
      {
        id: 'str_sam',
        name: "后缀自动机 (SAM)",
        x: 5000,
        y: 700,
        type: "hidden",
        desc: "能且只能识别一个字符串所有子串的有限状态自动机，空间复杂度O(n)，可用于解决复杂的字符串问题",
        code: "// 后缀自动机 (Suffix Automaton)\n// 每个状态（节点）代表一个endpos等价类，包含一个或多个子串（这些子串出现位置相同）\n// 转移边构成DAG，从初始状态出发，沿着转移边形成的路径对应原串的一个子串\nconst int N = 1000010; // 通常开两倍字符串长度\nint tot = 1, last = 1; // 总节点数（初始状态为1），当前最后一个状态\nstruct Node {\n    int len; // 该状态能表示的最长子串长度\n    int link; // 后缀链接（指向该状态所有子串的最长后缀所在的状态）\n    int ch[26]; // 转移边\n} node[N];\nchar str[N];\nLL f[N]; // 用于计算每个状态的出现次数（或子串个数等）\n\n// 扩展SAM，插入一个字符c\nvoid extend(int c) {\n    int p = last, np = last = ++ tot;\n    f[tot] = 1; // 初始化，表示这个状态是新的结束位置\n    node[np].len = node[p].len + 1;\n    for (; p && !node[p].ch[c]; p = node[p].link) node[p].ch[c] = np;\n    if (!p) node[np].link = 1;\n    else {\n        int q = node[p].ch[c];\n        if (node[q].len == node[p].len + 1) node[np].link = q;\n        else {\n            int nq = ++ tot;\n            node[nq] = node[q]; // 复制节点\n            node[nq].len = node[p].len + 1;\n            node[q].link = node[np].link = nq;\n            for (; p && node[p].ch[c] == q; p = node[p].link) node[p].ch[c] = nq;\n        }\n    }\n}\n\n// 构建SAM\nvoid build() {\n    for (int i = 0; str[i]; i ++ ) extend(str[i] - 'a');\n    // 建立parent树（后缀链接树），并计算每个状态的出现次数（或其他信息）\n    // 方法：按节点len从大到小排序（拓扑序），然后在parent树上累加\n    int a[N], c[N]; // 基数排序\n    for (int i = 1; i <= tot; i ++ ) c[node[i].len] ++ ;\n    for (int i = 1; i <= tot; i ++ ) c[i] += c[i - 1];\n    for (int i = 1; i <= tot; i ++ ) a[c[node[i].len] -- ] = i;\n    for (int i = tot; i; i -- ) { // 倒序遍历，即拓扑序\n        int p = a[i];\n        f[node[p].link] += f[p]; // 将当前节点的出现次数累加到后缀链接节点上\n    }\n}\n\n// 应用示例1：求不同子串个数\n// 每个状态表示的字符串个数为 node[i].len - node[node[i].link].len\n// 所以总数为 sum(node[i].len - node[node[i].link].len)\nLL get_substring_num() {\n    LL ans = 0;\n    for (int i = 1; i <= tot; i ++ )\n        ans += node[i].len - node[node[i].link].len;\n    return ans;\n}\n\n// 应用示例2：求所有子串出现次数（即每个子串在原串中出现次数）\n// 在build()中已经计算了f[]，f[i]表示状态i对应的所有子串的出现次数（即endpos集合大小）\n// 每个状态表示的子串出现次数相同，都是f[i]\n\n// 应用示例3：求两个串的最长公共子串（LCS）\n// 对第一个串建SAM，第二个串在SAM上匹配，记录当前状态和长度，更新答案\nint LCS(char *t) {\n    int ans = 0, len = 0, p = 1;\n    for (int i = 0; t[i]; i ++ ) {\n        int c = t[i] - 'a';\n        while (p && !node[p].ch[c]) p = node[p].link, len = node[p].len;\n        if (!p) p = 1, len = 0;\n        else p = node[p].ch[c], len ++ ;\n        ans = max(ans, len);\n    }\n    return ans;\n}"
      },
      // --- 【图论】树上操作：树链剖分 ---
      {
        id: 'g_hld',
        name: "树链剖分",
        x: 5000,
        y: 2300,
        type: "hidden",
        desc: "将树分割为若干链，并用线段树等数据结构维护，实现树上路径和子树的快速修改与查询",
        code: "// 树链剖分 (Heavy Light Decomposition)\n// 预处理出重儿子、深度、父节点、子树大小、重链顶部节点、DFS序等\nconst int N = 100010, M = N * 2;\nint h[N], e[M], ne[M], idx;\nint dep[N], fa[N], sz[N]; // 深度、父节点、子树大小\nint son[N]; // 重儿子\nint top[N]; // 所在重链的顶部节点\nint id[N], nw[N], cnt; // id: DFS序（剖分后的新编号），nw: 新编号对应的点权，cnt: 时间戳\nint w[N]; // 原始点权\nint n, m, root;\n\n// 添加树边\nvoid add(int a, int b) {\n    e[idx] = b, ne[idx] = h[a], h[a] = idx ++ ;\n}\n\n// 第一遍DFS：求fa, dep, sz, son（重儿子）\nvoid dfs1(int u, int father, int depth) {\n    dep[u] = depth, fa[u] = father, sz[u] = 1;\n    for (int i = h[u]; ~i; i = ne[i]) {\n        int j = e[i];\n        if (j == father) continue;\n        dfs1(j, u, depth + 1);\n        sz[u] += sz[j];\n        if (sz[son[u]] < sz[j]) son[u] = j; // 更新重儿子\n    }\n}\n\n// 第二遍DFS：求top, id（DFS序）\nvoid dfs2(int u, int t) {\n    id[u] = ++ cnt, nw[cnt] = w[u], top[u] = t;\n    if (!son[u]) return; // 叶子节点\n    dfs2(son[u], t); // 优先遍历重儿子（保证重链上DFS序连续）\n    for (int i = h[u]; ~i; i = ne[i]) {\n        int j = e[i];\n        if (j == fa[u] || j == son[u]) continue;\n        dfs2(j, j); // 轻儿子开始的新链\n    }\n}\n\n// 初始化\nvoid init() {\n    dfs1(root, -1, 1);\n    dfs2(root, root);\n    // 根据nw数组建线段树（此处略去线段树代码，假设有线段树数据结构）\n    // build(1, 1, n);\n}\n\n// 查询路径(u,v)上的信息（例如和、最大值等）\nint query_path(int u, int v) {\n    int res = 0;\n    while (top[u] != top[v]) { // 当u和v不在同一条重链上\n        if (dep[top[u]] < dep[top[v]]) swap(u, v); // 让u所在链的顶部更深\n        // 查询[ id[top[u]], id[u] ]这段区间（注意DFS序连续）\n        res += query(1, id[top[u]], id[u]); // query是线段树的查询函数\n        u = fa[top[u]]; // 跳到重链顶部的父节点\n    }\n    // 此时u和v在同一条重链上\n    if (dep[u] < dep[v]) swap(u, v);\n    res += query(1, id[v], id[u]); // 查询[v, u]这段区间（因为v是LCA）\n    return res;\n}\n\n// 修改路径(u,v)上的点权（每个点加上k）\nvoid update_path(int u, int v, int k) {\n    while (top[u] != top[v]) {\n        if (dep[top[u]] < dep[top[v]]) swap(u, v);\n        update(1, id[top[u]], id[u], k); // update是线段树的区间修改函数\n        u = fa[top[u]];\n    }\n    if (dep[u] < dep[v]) swap(u, v);\n    update(1, id[v], id[u], k);\n}\n\n// 查询以u为根的子树的信息（子树在DFS序中是连续的一段）\nint query_tree(int u) {\n    return query(1, id[u], id[u] + sz[u] - 1);\n}\n\n// 修改以u为根的子树（每个点加上k）\nvoid update_tree(int u, int k) {\n    update(1, id[u], id[u] + sz[u] - 1, k);\n}\n\n// 注意：\n// 1. 树链剖分将树上的路径查询/修改转化为O(log n)段连续区间的操作（利用线段树等）。\n// 2. 子树操作因为DFS序连续，所以是O(log n)的。\n// 3. 可以维护点权或边权（边权可以下放到点权处理）。"
      },
      // --- 【计算几何】扫描线算法 ---
      {
        id: 'geo_sweep',
        name: "扫描线",
        x: 5000,
        y: 2700,
        type: "hidden",
        desc: "通过一条扫描线（通常为竖直线）在平面上移动，处理平面上的图形交、并、面积等问题",
        code: "// 扫描线求矩形面积并（离散化 + 线段树）\n// 将每个矩形拆成两条竖直线：左边界（入边）和右边界（出边）\n// 从左到右扫描，用线段树维护当前扫描线上被矩形覆盖的长度\n#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nconst int N = 100010;\nint n;\nstruct Segment { // 竖直线段\n    double x, y1, y2; // x坐标，y方向区间[y1, y2]\n    int k; // 权值：左边界+1，右边界-1\n    bool operator< (const Segment &t) const {\n        return x < t.x;\n    }\n} seg[N * 2]; // 每个矩形两条边\n\nstruct Node { // 线段树节点，维护y轴区间\n    int l, r;\n    int cnt; // 当前区间被完整覆盖的次数\n    double len; // 当前区间被覆盖的长度\n} tr[N * 8]; // 离散化后最多2n个点，线段树开8倍\nvector<double> ys; // 用于离散化y坐标\n\n// 离散化：找到y值对应的下标\nint find(double y) {\n    return lower_bound(ys.begin(), ys.end(), y) - ys.begin();\n}\n\n// 线段树建树\nvoid build(int u, int l, int r) {\n    tr[u] = {l, r, 0, 0};\n    if (l == r) return;\n    int mid = l + r >> 1;\n    build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);\n}\n\n// 更新节点信息\nvoid pushup(int u) {\n    if (tr[u].cnt) // 如果当前区间被完整覆盖，则长度就是整个区间长度\n        tr[u].len = ys[tr[u].r + 1] - ys[tr[u].l]; // 注意：区间[l,r]对应实际y轴区间[ys[l], ys[r+1]]\n    else if (tr[u].l == tr[u].r) // 叶子节点且未被覆盖，长度为0\n        tr[u].len = 0;\n    else // 非叶子节点且未被完整覆盖，长度由两个子节点推出\n        tr[u].len = tr[u << 1].len + tr[u << 1 | 1].len;\n}\n\n// 区间修改（将区间[l,r]的覆盖次数加上k）\nvoid modify(int u, int l, int r, int k) {\n    if (tr[u].l >= l && tr[u].r <= r) {\n        tr[u].cnt += k;\n        pushup(u); // 注意：这里直接更新当前节点，不需要下传懒标记\n    } else {\n        int mid = tr[u].l + tr[u].r >> 1;\n        if (l <= mid) modify(u << 1, l, r, k);\n        if (r > mid) modify(u << 1 | 1, l, r, k);\n        pushup(u);\n    }\n}\n\nint main() {\n    int T = 1;\n    while (scanf(\"%d\", &n), n) {\n        ys.clear();\n        for (int i = 0, j = 0; i < n; i ++ ) {\n            double x1, y1, x2, y2;\n            scanf(\"%lf%lf%lf%lf\", &x1, &y1, &x2, &y2);\n            seg[j ++ ] = {x1, y1, y2, 1}; // 左边界\n            seg[j ++ ] = {x2, y1, y2, -1}; // 右边界\n            ys.push_back(y1), ys.push_back(y2);\n        }\n        // 离散化\n        sort(ys.begin(), ys.end());\n        ys.erase(unique(ys.begin(), ys.end()), ys.end());\n        // 建线段树，注意有ys.size()个点，则线段树维护ys.size()-1个区间\n        build(1, 0, ys.size() - 2); // 区间[0, ys.size()-2]\n        // 将线段按x坐标排序\n        sort(seg, seg + n * 2);\n        double res = 0;\n        for (int i = 0; i < n * 2; i ++ ) {\n            if (i) // 从第二条线开始，计算面积\n                res += tr[1].len * (seg[i].x - seg[i - 1].x); // 当前覆盖长度 * 宽度\n            // 更新线段树（将当前线段对应的y轴区间加上权值）\n            int l = find(seg[i].y1), r = find(seg[i].y2) - 1; // 注意：区间对应的是离散化后的下标\n            if (l <= r) modify(1, l, r, seg[i].k);\n        }\n        printf(\"Test case #%d\\n\", T ++ );\n        printf(\"Total explored area: %.2lf\\n\\n\", res);\n    }\n    return 0;\n}\n// 注意：\n// 1. 线段树维护的是y轴上的区间，每个节点对应一个区间[ys[l], ys[r+1]]。\n// 2. 因为cnt不需要下传（只要知道当前区间被完全覆盖的次数即可），所以不需要懒标记。\n// 3. 可以扩展到求矩形周长并等问题。"
      },

      
      // =========================================================
      // 🌌 第十次扩充：二分图最大权匹配、莫队算法、斜率优化DP
      // =========================================================
      // --- 【图论】二分图最大权完美匹配：KM算法 ---
      {
        id: 'g_km',
        name: "KM 算法",
        x: 5300,
        y: 2300,
        type: "hidden",
        desc: "求解二分图的最大权完美匹配（要求左右部点数相等），基于顶标和相等子图",
        code: "// KM算法 (Kuhn-Munkres) 求二分图最大权完美匹配\n// 注意：通常用于求最大权匹配，最小权匹配可将权值取负\n// 复杂度 O(n^3)\nconst int N = 510; // 点数\nconst int INF = 0x3f3f3f3f;\nint n; // 左右部点数（相等）\nint w[N][N]; // 边权\nint la[N], lb[N]; // 左、右部点的顶标\nbool va[N], vb[N]; // 访问标记（是否在交错树中）\nint match[N]; // 右部点匹配的左部点\nint upd[N]; // 右部点的slack值\n\nbool dfs(int x) {\n    va[x] = true;\n    for (int y = 1; y <= n; y ++ ) {\n        if (!vb[y]) {\n            if (la[x] + lb[y] - w[x][y] == 0) { // 相等子图\n                vb[y] = true;\n                if (!match[y] || dfs(match[y])) {\n                    match[y] = x;\n                    return true;\n                }\n            } else {\n                upd[y] = min(upd[y], la[x] + lb[y] - w[x][y]);\n            }\n        }\n    }\n    return false;\n}\n\nint KM() {\n    // 初始化顶标\n    for (int i = 1; i <= n; i ++ ) {\n        la[i] = -INF;\n        lb[i] = 0;\n        for (int j = 1; j <= n; j ++ )\n            la[i] = max(la[i], w[i][j]);\n    }\n    // 为每个左部点找匹配\n    for (int i = 1; i <= n; i ++ ) {\n        memset(va, false, sizeof va);\n        memset(vb, false, sizeof vb);\n        for (int j = 1; j <= n; j ++ ) upd[j] = INF;\n        // 直到找到匹配\n        while (true) {\n            if (dfs(i)) break;\n            int delta = INF;\n            for (int j = 1; j <= n; j ++ )\n                if (!vb[j]) delta = min(delta, upd[j]);\n            // 修改顶标\n            for (int j = 1; j <= n; j ++ ) {\n                if (va[j]) la[j] -= delta;\n                if (vb[j]) lb[j] += delta;\n            }\n            memset(vb, false, sizeof vb);\n            memset(va, false, sizeof va);\n        }\n    }\n    // 计算最大权匹配的总权值\n    int res = 0;\n    for (int i = 1; i <= n; i ++ )\n        res += w[match[i]][i];\n    return res;\n}\n\n// 注意：\n// 1. 如果求最小权匹配，可以将边权取负，然后求最大权匹配，最后结果再取负。\n// 2. 如果二分图不是完全图，可以将不存在的边权设为负无穷（求最大权）或正无穷（求最小权）。\n// 3. 如果左右部点数不等，需要补点，使得两部点数相等，不存在的边权设为0（或根据题意）。"
      },
      // --- 【数据结构/离线算法】莫队算法 ---
      {
        id: 'ds_mo',
        name: "莫队算法",
        x: 5300,
        y: 900,
        type: "hidden",
        desc: "离线处理区间查询问题，通过分块和排序，将询问重新排序，利用上一次查询结果减少移动次数",
        code: "// 莫队算法模板（处理不带修改的区间查询）\n// 问题：多次询问区间[l, r]内不同数字的个数\n#include <bits/stdc++.h>\nusing namespace std;\nconst int N = 50010, M = 200010, S = 1000010; // N: 数组长度, M: 询问数, S: 值域\nint n, m, len; // len: 分块长度\nint w[N], ans[M], cnt[S]; // w: 原数组, ans: 答案, cnt: 计数数组\nstruct Query {\n    int id, l, r;\n} q[M];\n\n// 获取分块编号（用于排序）\nint get(int x) {\n    return x / len;\n}\n\n// 排序函数：先按左端点所在块排序，再按右端点排序（奇偶化排序优化）\nbool cmp(const Query &a, const Query &b) {\n    int i = get(a.l), j = get(b.l);\n    if (i != j) return i < j;\n    // 奇偶化排序：奇数块内右端点升序，偶数块内右端点降序，减少指针移动\n    return (i & 1) ? a.r < b.r : a.r > b.r;\n}\n\n// 添加一个数\nvoid add(int x, int &res) {\n    if (cnt[x] == 0) res ++ ;\n    cnt[x] ++ ;\n}\n\n// 删除一个数\nvoid del(int x, int &res) {\n    cnt[x] -- ;\n    if (cnt[x] == 0) res -- ;\n}\n\nint main() {\n    scanf(\"%d\", &n);\n    for (int i = 1; i <= n; i ++ ) scanf(\"%d\", &w[i]);\n    scanf(\"%d\", &m);\n    len = max(1, (int)sqrt((double)n * n / m)); // 分块大小，也可以直接取 sqrt(n)\n    for (int i = 0; i < m; i ++ ) {\n        int l, r;\n        scanf(\"%d%d\", &l, &r);\n        q[i] = {i, l, r};\n    }\n    sort(q, q + m, cmp);\n    // 处理询问\n    int res = 0; // 当前区间的答案\n    for (int k = 0, i = 1, j = 0; k < m; k ++ ) { // i: 右指针，j: 左指针\n        int id = q[k].id, l = q[k].l, r = q[k].r;\n        // 因为初始区间为空，所以先扩展右指针，再扩展左指针\n        while (j < r) add(w[ ++ j], res); // 右指针右移，加入数字\n        while (j > r) del(w[j -- ], res); // 右指针左移，删除数字\n        while (i < l) del(w[i ++ ], res); // 左指针右移，删除数字\n        while (i > l) add(w[ -- i], res); // 左指针左移，加入数字\n        ans[id] = res;\n    }\n    for (int i = 0; i < m; i ++ ) printf(\"%d\\n\", ans[i]);\n    return 0;\n}\n\n// 带修改的莫队（待修改莫队）\n// 增加一维时间戳，排序时先按左端点块，再按右端点块，最后按时间排序。\n// 移动指针时，除了l和r，还需要移动时间指针t，处理修改操作。\n// 分块大小取 n^(2/3) 时，复杂度为 O(n^(5/3))。"
      },
      // --- 【动态规划】斜率优化 ---
      {
        id: 'dp_slope',
        name: "斜率优化",
        x: 5300,
        y: 2700,
        type: "hidden",
        desc: "将DP转移方程转化为斜率形式，通过维护凸包（通常用单调队列）来优化决策",
        code: "// 斜率优化DP模板（以HNOI2008 玩具装箱为例）\n// 题目：将n个物品分成若干组，每组连续，每组的费用为 (sum(C_i) - L)^2，求最小总费用\n// 状态转移：f[i] = min{ f[j] + (sum[i] - sum[j] + i - j - 1 - L)^2 } (0 <= j < i)\n// 令 a[i] = sum[i] + i, b[i] = sum[i] + i + 1 + L\n// 则转移方程化为：f[i] = min{ f[j] + (a[i] - b[j])^2 }\n// 展开：f[i] = f[j] + a[i]^2 - 2*a[i]*b[j] + b[j]^2\n// 移项：f[j] + b[j]^2 = 2*a[i]*b[j] + f[i] - a[i]^2\n// 令 y = f[j] + b[j]^2, k = 2*a[i], x = b[j], b = f[i] - a[i]^2\n// 则转化为直线方程 y = kx + b，目标是使截距b最小（即f[i]最小）\n// 因为k和x都是单调递增的，所以可以用单调队列维护下凸壳。\n\n#include <iostream>\n#include <cstring>\n#include <algorithm>\nusing namespace std;\ntypedef long long LL;\nconst int N = 50010;\nLL n, L;\nLL sum[N], f[N];\nint q[N]; // 单调队列（存下标）\n\nLL a(int i) { return sum[i] + i; }\nLL b(int j) { return sum[j] + j + 1 + L; }\nLL X(int j) { return b(j); }\nLL Y(int j) { return f[j] + b(j) * b(j); }\n// 斜率：注意用double，但实际比较时用乘法避免精度问题\ndouble slope(int i, int j) {\n    return double(Y(j) - Y(i)) / (X(j) - X(i));\n}\n\nint main() {\n    cin >> n >> L;\n    for (int i = 1; i <= n; i ++ ) {\n        cin >> sum[i];\n        sum[i] += sum[i - 1];\n    }\n    int hh = 0, tt = -1;\n    q[++ tt] = 0; // 初始决策点 j=0\n    for (int i = 1; i <= n; i ++ ) {\n        // 队头：如果斜率小于当前斜率2*a[i]，则出队（因为2*a[i]单调递增）\n        while (hh < tt && slope(q[hh], q[hh + 1]) < 2 * a(i)) hh ++ ;\n        int j = q[hh];\n        f[i] = f[j] + (a(i) - b(j)) * (a(i) - b(j));\n        // 队尾：维护下凸壳，如果新点(i)与队尾-1、队尾的斜率不满足下凸，则弹出队尾\n        while (hh < tt && slope(q[tt - 1], q[tt]) >= slope(q[tt], i)) tt -- ;\n        q[++ tt] = i;\n    }\n    cout << f[n] << endl;\n    return 0;\n}\n\n// 注意：\n// 1. 斜率优化通常用于DP转移方程形如 f[i] = min/max{ f[j] + val(i, j) }，且val(i,j)能拆成关于i和关于j的函数的乘积和。\n// 2. 关键步骤：将方程转化为 y = kx + b 的形式，其中y和x只与j有关，k只与i有关，b包含f[i]。\n// 3. 目标是使b最小（或最大），即维护一个凸包（下凸壳求最小，上凸壳求最大）。\n// 4. 如果斜率k和x都单调，可以使用单调队列/栈维护凸包；如果仅x单调，可以使用二分查找凸包；如果都不单调，则需要用平衡树或CDQ分治维护。"
      },



      
    ],

    // 🌟 错综复杂的星座连线
    links: [
      // 起源连接四大星系主干
      { source: 'root', target: 'ds' },
      { source: 'root', target: 'base' },
      { source: 'root', target: 'graph' },
      { source: 'root', target: 'dp' },
      
      // --- 数据结构分支 ---
      { source: 'ds', target: 'ds_dsu' },
      { source: 'ds', target: 'ds_heap' },
      { source: 'ds_dsu', target: 'ds_fenwick' },
      { source: 'ds_heap', target: 'ds_segtree' },
      { source: 'ds_fenwick', target: 'ds_trie' },
      { source: 'ds_segtree', target: 'ds_trie' },

      // --- 基础分支 ---
      { source: 'base', target: 'b_qsort' },
      { source: 'base', target: 'b_msort' },
      { source: 'b_qsort', target: 'b_bsearch' },
      { source: 'b_msort', target: 'b_bsearch' },
      { source: 'b_bsearch', target: 'b_2ptrs' },

      // --- 图论分支 ---
      { source: 'graph', target: 'g_dfs' },
      { source: 'graph', target: 'g_bfs' },
      { source: 'g_dfs', target: 'g_top' },
      { source: 'g_bfs', target: 'g_dijkstra' },
      { source: 'g_top', target: 'g_dijkstra' },

      // --- DP 分支 ---
      { source: 'dp', target: 'dp_pack01' },
      { source: 'dp', target: 'dp_packfull' },
      { source: 'dp_pack01', target: 'dp_linear' },
      { source: 'dp_packfull', target: 'dp_interval' },
      { source: 'dp_linear', target: 'dp_state' },
      { source: 'dp_interval', target: 'dp_state' },


      // --- 数论分支连线 ---
      // 插入位置提示：请确保上一行末尾有一个英文逗号 ,
      { source: 'root', target: 'math' },
      { source: 'math', target: 'm_gcd' },
      { source: 'math', target: 'm_prime' },
      { source: 'm_gcd', target: 'm_qpow' },
      { source: 'm_prime', target: 'm_qpow' },
      { source: 'm_qpow', target: 'm_inv' },
      { source: 'm_inv', target: 'm_lucas' },


      // =========================================================
      // 🔗 第一次扩充的连线
      // =========================================================
      // 数据结构星系的新连线
      { source: 'ds_trie', target: 'ds_rbtree' },
      { source: 'ds_heap', target: 'ds_hash' },
      { source: 'ds_segtree', target: 'ds_hash' },

      // 基础筑基星系的新连线
      { source: 'b_2ptrs', target: 'b_bignum_add' },
      { source: 'b_bignum_add', target: 'b_bignum_mul' },

      // 图论星系的新连线
      { source: 'g_dijkstra', target: 'g_bellman_ford' },
      { source: 'ds_dsu', target: 'g_kruskal' }, // Kruskal依赖并查集
      { source: 'g_bellman_ford', target: 'g_kruskal' },

      // 动态规划星系的新连线
      { source: 'dp_state', target: 'dp_tree' },
      { source: 'g_dfs', target: 'dp_tree' }, // 树形DP依赖DFS遍历
      { source: 'dp_state', target: 'dp_digit' },

      // 数论星系的新连线
      { source: 'm_inv', target: 'm_exgcd' }, // 逆元的一种求法
      { source: 'm_gcd', target: 'm_exgcd' }, // 扩展欧几里得是欧几里得的扩展



      // =========================================================
      // 🔗 第二次扩充的连线
      // =========================================================
      // 数据结构：跳表是链表的高级变种，连接红黑树和哈希表
      { source: 'ds_rbtree', target: 'ds_skiplist' },
      { source: 'ds_hash', target: 'ds_skiplist' },

      // 基础：前缀和与差分是基础算法的重要工具，连接双指针和高精度
      { source: 'b_2ptrs', target: 'b_prefix' },
      { source: 'b_bignum_mul', target: 'b_prefix' },

      // 图论：Floyd连接所有最短路，Prim是另一MST算法
      { source: 'g_dijkstra', target: 'g_floyd' },
      { source: 'g_bellman_ford', target: 'g_floyd' },
      { source: 'g_kruskal', target: 'g_prim' }, // 两种最小生成树算法相连

      // 动态规划：状态机是线性DP和背包问题的思想延伸
      { source: 'dp_linear', target: 'dp_statemachine' },
      { source: 'dp_pack01', target: 'dp_statemachine' },

      // 数论：欧拉函数是欧几里得和素数筛的自然延伸
      { source: 'm_gcd', target: 'm_euler' },
      { source: 'm_prime', target: 'm_euler' },



      // =========================================================
      // 🔗 第三次扩充的连线
      // =========================================================
      // 字符串：KMP 是字符串匹配的核心，连接自 Trie（同为字符串结构）和双指针（思想类似）
      { source: 'ds_trie', target: 'str_kmp' },
      { source: 'b_2ptrs', target: 'str_kmp' },

      // 图论：匈牙利算法用于二分图匹配，连接自 BFS/DFS（遍历思想）和图论基础
      { source: 'g_bfs', target: 'g_hungarian' },
      { source: 'g_dfs', target: 'g_hungarian' },

      // 组合数学：卡特兰数连接自数论基础，并与区间DP（计数问题）和栈（出栈序列应用）关联
      { source: 'math', target: 'm_catalan' },
      { source: 'dp_interval', target: 'm_catalan' },


      // =========================================================
      // 🔗 第四次扩充的连线
      // =========================================================
      // AC自动机是Trie和KMP思想的结合
      { source: 'ds_trie', target: 'str_ac' },
      { source: 'str_kmp', target: 'str_ac' },
      // Tarjan算法是DFS在图论中的深刻应用
      { source: 'g_dfs', target: 'g_tarjan_scc' },
      // 单调队列优化DP连接了DP、双指针和队列数据结构
      { source: 'dp_linear', target: 'dp_monoqueue' },
      { source: 'b_2ptrs', target: 'dp_monoqueue' },
      // 中国剩余定理是数论的综合应用，依赖扩展欧几里得
      { source: 'm_exgcd', target: 'm_crt' },


      // =========================================================
      // 🔗 第五次扩充的连线
      // =========================================================
      // Dinic算法是图论中网络流的核心，连接自BFS和DFS（因为算法中结合了二者）
      { source: 'g_bfs', target: 'g_dinic' },
      { source: 'g_dfs', target: 'g_dinic' },
      // 区间树状数组是基础树状数组的扩展，连接自树状数组和差分思想
      { source: 'ds_fenwick', target: 'ds_fenwick_range' },
      { source: 'b_prefix', target: 'ds_fenwick_range' },
      // 四边形不等式优化是区间DP的高级优化技巧
      { source: 'dp_interval', target: 'dp_quadrangle' },


      // =========================================================
      // 🔗 第六次扩充的连线
      // =========================================================
      // 字符串哈希是独立于KMP的快速匹配方法，连接自字符串基础
      { source: 'str_kmp', target: 'str_hash' },
      // 凸包算法是计算几何的起点，连接自排序（需要排序点）和基础数学
      { source: 'b_qsort', target: 'geo_convexhull' },
      { source: 'math', target: 'geo_convexhull' },
      // SG函数是博弈论的核心，连接自动态规划（记忆化搜索）和数学
      { source: 'dp_linear', target: 'game_sg' },
      { source: 'math', target: 'game_sg' },



      // =========================================================
      // 🔗 第七次扩充的连线
      // =========================================================
      // 后缀数组是字符串处理的终极武器之一，连接自KMP和字符串哈希
      { source: 'str_kmp', target: 'str_sa' },
      { source: 'str_hash', target: 'str_sa' },
      // 线段树懒标记是线段树的核心扩展，连接自基础线段树
      { source: 'ds_segtree', target: 'ds_segtree_lazy' },
      // 数位DP详细模板是对数位DP节点的深化和具体化
      { source: 'dp_digit', target: 'dp_digit_detail' },


      




      // =========================================================
      // 🔗 第八次扩充的连线
      // =========================================================
      // 最小费用最大流是网络流的进阶，连接自最大流Dinic
      { source: 'g_dinic', target: 'g_mcmf' },
      // Treap是平衡树的一种，连接自二叉搜索树思想（堆、排序等）
      { source: 'ds_heap', target: 'ds_treap' },
      { source: 'b_qsort', target: 'ds_treap' },
      // 旅行商问题是状态压缩DP的经典应用，连接自状态压缩DP
      { source: 'dp_state', target: 'dp_tsp' },


      // =========================================================
      // 🔗 第九次扩充的连线
      // =========================================================
      // 后缀自动机是字符串处理的集大成者，连接自后缀数组
      { source: 'str_sa', target: 'str_sam' },
      // 树链剖分是树上路径问题的重要工具，连接自DFS和线段树
      { source: 'g_dfs', target: 'g_hld' },
      { source: 'ds_segtree_lazy', target: 'g_hld' },
      // 扫描线是计算几何的重要技巧，连接自线段树和离散化
      { source: 'ds_segtree_lazy', target: 'geo_sweep' },
      { source: 'b_bsearch', target: 'geo_sweep' },



      // =========================================================
      // 🔗 第十次扩充的连线
      // =========================================================
      // KM算法是二分图匹配的扩展，连接自匈牙利算法
      { source: 'g_hungarian', target: 'g_km' },
      // 莫队算法是离线查询的常用技巧，连接自分块思想和排序
      { source: 'b_bsearch', target: 'ds_mo' },
      { source: 'b_qsort', target: 'ds_mo' },
      // 斜率优化是DP优化的重要方法，连接自单调队列和动态规划
      { source: 'dp_monoqueue', target: 'dp_slope' },
      { source: 'dp_linear', target: 'dp_slope' },

    ]
  },

  onLoad() {
    this.calculateLines(); 
  },

  // 核心引擎：自动计算连线 (保持不变)
  calculateLines() {
    const { nodes, links } = this.data;
    const calculatedLines = links.map(link => {
      const startNode = nodes.find(n => n.id === link.source);
      const endNode = nodes.find(n => n.id === link.target);
      if (!startNode || !endNode) return null;

      const dx = endNode.x - startNode.x;
      const dy = endNode.y - startNode.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      return {
        startX: startNode.x,
        startY: startNode.y,
        length: length,
        angle: angle
      };
    }).filter(line => line !== null);

    this.setData({ lines: calculatedLines });
  },




  
  
  onNodeClick(e) {
  const item = e.currentTarget.dataset.item;
  
  // 【增强版】支持更多语法元素的高亮
  const getHighlightedCode = (code) => {
    if (!code) return '';
    
    let html = code
      // 1. 转义 HTML 字符
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      
      // 2. 高亮注释 (// ...)
      .replace(/(\/\/.*)/g, '<span class="hl-comment">$1</span>')
      
      // 3. 高亮字符串 ("..." 或 '...')
      .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="hl-string">$&</span>')
      
      // 4. 高亮关键字
      .replace(/\b(int|long|float|double|char|void|if|else|for|while|return|break|continue|struct|class|public|private|const|static|bool|true|false|nullptr)\b/g, 
               '<span class="hl-keyword">$1</span>')
      
      // 5. 高亮函数名（后面跟括号的标识符）
      .replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span class="hl-function">$1</span>')
      
      // 6. 高亮变量名（简单 heuristic：非关键字的字母开头标识符）
      .replace(/\b([a-zA-Z_]\w*)\b(?!\s*[=+\-*/<>!&|])/g, 
               (match) => {
                 if (['int','for','if','return','void','bool','true','false'].includes(match)) return match;
                 return `<span class="hl-variable">${match}</span>`;
               })
      
      // 7. 高亮数字
      .replace(/\b(\d+)\b/g, '<span class="hl-number">$1</span>')
      
      // 8. 高亮运算符和符号
      .replace(/([=+\-*/<>!&|^%?:]+)/g, '<span class="hl-operator">$1</span>')
      .replace(/([{}[\]()])/g, '<span class="hl-bracket">$1</span>');
    
    return html;
  };

  this.setData({
    showPopup: true,
    currentAlgorithm: item,
    highlightedCode: getHighlightedCode(item.code)
  });
  },
  


  closePopup() {
    this.setData({ showPopup: false });
  }
})