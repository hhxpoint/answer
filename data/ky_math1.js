// module.exports = [
//   {
//     id: 1,
//     type: "choice",
//     subject: "高等数学",
//     title: "当 x -> 0 时，f(x) = x - sinx 是 g(x) = x^k 的同阶无穷小，则 k 为：",
//     options: [
//       { label: "A", content: "1" },
//       { label: "B", content: "2" },
//       { label: "C", content: "3" },
//       { label: "D", content: "4" }
//     ],
//     answer: "C",
//     analysis: "解析：使用泰勒展开，sinx = x - x^3/6 + o(x^3)。则 x - sinx ≈ x^3/6。所以是 x 的 3 阶无穷小。"
//   },
//   {
//     id: 2,
//     type: "choice",
//     subject: "线性代数",
//     title: "设 A 是 n 阶矩阵，若 A 的秩 r(A) < n，则下列结论正确的是：",
//     options: [
//       { label: "A", content: "A 的行列式 |A| 不等于 0" },
//       { label: "B", content: "Ax = 0 只有零解" },
//       { label: "C", content: "A 的特征值中必有 0" },
//       { label: "D", content: "A 一定可以对角化" }
//     ],
//     answer: "C",
//     analysis: "解析：r(A) < n 说明 A 是奇异矩阵，即行列式 |A| = 0。因为所有特征值的乘积等于行列式，所以必有一个特征值为 0。"
//   },
//   {
//     id: 3,
//     type: "fill",
//     subject: "高等数学",
//     title: "极限 lim(x->infinity) (1 + 2/x)^x 的值为 ___________。",
//     answer: "e^2",
//     analysis: "解析：利用重要极限公式 lim(1 + k/x)^x = e^k。此处 k=2，故结果为 e^2。"
//   },
//   {
//     id: 4,
//     type: "choice",
//     subject: "概率论",
//     title: "设 A, B 为随机事件，若 P(A) > 0，且 P(B|A) = 1，则必有：",
//     options: [
//       { label: "A", content: "P(A) = P(B)" },
//       { label: "B", content: "A 包含于 B" },
//       { label: "C", content: "P(B-A) = 0" },
//       { label: "D", content: "P(A-B) = 0" }
//     ],
//     answer: "D",
//     analysis: "解析：P(B|A) = P(AB)/P(A) = 1 => P(AB) = P(A)。又 P(A-B) = P(A) - P(AB) = 0。注意 P(A-B)=0 不代表 A 包含于 B（测度论视角），但在初等概率中常选此项。"
//   },


//   {
//     id: 5,
//     type: "fill",
//     subject: "高等数学",
//     title: "极限 lim(x->0) [ ∫(0到x) sin(t^2) dt ] / x^3 的值为 ___________。",
//     answer: "1/3",
//     analysis: "解析：此为 0/0 型极限，使用洛必达法则对分子分母分别求导。对变上限积分求导，原式 = lim(x->0) sin(x^2) / (3x^2)。当 x->0 时，sin(x^2) 等价于 x^2，故极限为 lim(x->0) x^2 / (3x^2) = 1/3。"
//   },
//   {
//     id: 6,
//     type: "choice",
//     subject: "高等数学",
//     title: "当 x -> 0 时，若 x - tanx 与 x^k 是同阶无穷小，则 k 的值为：",
//     options: [
//       { label: "A", content: "1" },
//       { label: "B", content: "2" },
//       { label: "C", content: "3" },
//       { label: "D", content: "4" }
//     ],
//     answer: "C",
//     analysis: "解析：利用泰勒展开公式，tanx = x + x^3/3 + o(x^3)。则 x - tanx = -x^3/3 + o(x^3)。可以看出其最低次幂为 3 次，所以它是 x 的 3 阶无穷小，k = 3。"
//   },
//   {
//     id: 7,
//     type: "choice",
//     subject: "高等数学",
//     title: "设函数 f(x) = { (1-cos(sqrt(x)))/x, x>0 ; a, x=0 }，若 f(x) 在 x=0 处连续，则 a 的值为：",
//     options: [
//       { label: "A", content: "1/2" },
//       { label: "B", content: "1" },
//       { label: "C", content: "0" },
//       { label: "D", content: "2" }
//     ],
//     answer: "A",
//     analysis: "解析：考察函数在分段点的连续性。求 x -> 0+ 时的极限 lim(x->0+) (1-cos(sqrt(x)))/x。当 u->0 时，1-cos(u) ~ u^2 / 2，故 1-cos(sqrt(x)) ~ (sqrt(x))^2 / 2 = x / 2。因此极限为 (x/2) / x = 1/2。因为 f(x) 在 x=0 处连续，所以 a = f(0) = 1/2。"
//   },
//   {
//     id: 8,
//     type: "choice",
//     subject: "线性代数",
//     title: "设 A, B 均为 n 阶实对称矩阵，且 A 与 B 相似，则必有：",
//     options: [
//       { label: "A", content: "A, B 具有完全相同的特征向量" },
//       { label: "B", content: "A 与 B 合同" },
//       { label: "C", content: "A, B 的秩不同" },
//       { label: "D", content: "A, B 不一定正交相似" }
//     ],
//     answer: "B",
//     analysis: "解析：实对称矩阵必定可以正交相似于对角阵。因为 A, B 相似，所以它们具有相同的特征值，从而它们正交相似于同一个对角阵 Λ。根据相似和合同的性质，它们都合同于 Λ，由合同的传递性可知，A 与 B 必然合同。特征向量不一定相同，但必定正交相似。"
//   },
//   {
//     id: 9,
//     type: "fill",
//     subject: "高等数学",
//     title: "设函数 z = z(x,y) 由方程 e^(x+y+z) + xyz = 1 确定，则点 (0, 0, 0) 处的全微分 dz = ___________。",
//     answer: "-dx - dy",
//     analysis: "解析：对方程两边求全微分，得 e^(x+y+z)(dx + dy + dz) + yz dx + xz dy + xy dz = 0。将 x=0, y=0, z=0 代入上式，得到 1 * (dx + dy + dz) + 0 = 0，化简即得 dz = -dx - dy。"
//   },
//   {
//     id: 10,
//     type: "choice",
//     subject: "概率论",
//     title: "设随机变量 X, Y 独立同分布，且均服从标准正态分布 N(0, 1)，则 (X+Y)^2 / 2 服从的分布为：",
//     options: [
//       { label: "A", content: "N(0, 1)" },
//       { label: "B", content: "χ²(1)" },
//       { label: "C", content: "χ²(2)" },
//       { label: "D", content: "F(1, 1)" }
//     ],
//     answer: "B",
//     analysis: "解析：因为 X, Y 相互独立且服从 N(0, 1)，由正态分布的可加性可知，X+Y 服从 N(0, 2)。将其标准化，即 Z = (X+Y)/sqrt(2) 服从标准正态分布 N(0, 1)。根据卡方分布的定义，标准正态分布变量的平方服从自由度为 1 的卡方分布，因此 Z^2 = (X+Y)^2 / 2 服从 χ²(1)。"
//   },
//   {
//     id: 11,
//     type: "fill",
//     subject: "线性代数",
//     title: "设 3 阶实矩阵 A 的特征值为 1, 2, -1，E 为 3 阶单位矩阵，则矩阵行列式 |A^2 + E| 的值为 ___________。",
//     answer: "20",
//     analysis: "解析：根据矩阵多项式特征值的性质，若 A 的特征值为 λ，则多项式 f(A) = A^2 + E 的特征值为 f(λ) = λ^2 + 1。将 A 的特征值分别代入，得到 A^2 + E 的特征值为：1^2+1=2，2^2+1=5，(-1)^2+1=2。矩阵的行列式等于其特征值之积，故 |A^2 + E| = 2 * 5 * 2 = 20。"
//   },
//   {
//     id: 12,
//     type: "choice",
//     subject: "高等数学",
//     title: "设空间曲面 Σ 为 x^2 + y^2 + z^2 = 1 (z >= 0)，则第一类曲面积分 ∫∫_Σ z dS 的值为：",
//     options: [
//       { label: "A", content: "π" },
//       { label: "B", content: "2π" },
//       { label: "C", content: "π/2" },
//       { label: "D", content: "4π" }
//     ],
//     answer: "A",
//     analysis: "解析：Σ 为上半球面。其在 xOy 平面的投影区域 D 为 x^2 + y^2 <= 1。由于曲面方程 z = sqrt(1 - x^2 - y^2)，面积元素 dS = sqrt(1 + (z_x)^2 + (z_y)^2) dxdy = (1 / sqrt(1 - x^2 - y^2)) dxdy = (1/z) dxdy。故原积分 = ∫∫_D z * (1/z) dxdy = ∫∫_D 1 dxdy，其值即为投影圆 D 的面积 π*1^2 = π。"
//   },
//   {
//     id: 13,
//     type: "choice",
//     subject: "高等数学",
//     title: "已知正项级数 Σ(n=1 to infinity) a_n 收敛，则下列级数中必定收敛的是：",
//     options: [
//       { label: "A", content: "Σ(n=1 to infinity) a_n^(1/2)" },
//       { label: "B", content: "Σ(n=1 to infinity) a_n^2" },
//       { label: "C", content: "Σ(n=1 to infinity) a_n / sqrt(n)" },
//       { label: "D", content: "Σ(n=1 to infinity) (a_n)^(1/n)" }
//     ],
//     answer: "B",
//     analysis: "解析：级数 Σa_n 收敛必有一般项趋于0，即 lim(n->infinity) a_n = 0。所以存在 N，当 n>N 时，0 < a_n < 1。此时必定有 a_n^2 < a_n。由正项级数的比较审敛法可知，较大的级数收敛，较小的级数 Σa_n^2 必定收敛。A、C、D均可举出反例（如考虑 p 级数）。"
//   },
//   {
//     id: 14,
//     type: "fill",
//     subject: "概率论",
//     title: "设随机变量 X 服从参数为 λ 的泊松分布。若 P(X = 1) = P(X = 2)，则期望 E(X^2) = ___________。",
//     answer: "6",
//     analysis: "解析：由泊松分布概率公式 P(X=k) = (λ^k / k!) * e^(-λ)，根据条件有：λ * e^(-λ) = (λ^2 / 2) * e^(-λ)。解方程得 λ = 2（λ=0不合题意舍去）。泊松分布的期望 E(X) = λ = 2，方差 D(X) = λ = 2。因此 E(X^2) = D(X) + [E(X)]^2 = 2 + 2^2 = 6。"
//   },



// ];








// data/ky_math1.js
module.exports = [
  {
    id: 1,
    type: "choice",
    subject: "高等数学",
    title: "当 $x \\to 0$ 时，$f(x) = x - \\sin x$ 是 $g(x) = x^k$ 的同阶无穷小，则 $k$ 为：",
    options: [
      { label: "A", content: "$1$" },
      { label: "B", content: "$2$" },
      { label: "C", content: "$3$" },
      { label: "D", content: "$4$" }
    ],
    answer: "C",
    analysis: "解析：使用泰勒展开，$\\sin x = x - \\frac{x^3}{6} + o(x^3)$。则 $x - \\sin x \\approx \\frac{x^3}{6}$。所以是 $x$ 的 3 阶无穷小。"
  },
  {
    id: 2,
    type: "choice",
    subject: "线性代数",
    title: "设 $A$ 是 $n$ 阶矩阵，若 $A$ 的秩 $r(A) < n$，则下列结论正确的是：",
    options: [
      { label: "A", content: "$A$ 的行列式 $|A| \\neq 0$" },
      { label: "B", content: "$Ax = 0$ 只有零解" },
      { label: "C", content: "$A$ 的特征值中必有 $0$" },
      { label: "D", content: "$A$ 一定可以对角化" }
    ],
    answer: "C",
    analysis: "解析：$r(A) < n$ 说明 $A$ 是奇异矩阵，即行列式 $|A| = 0$。因为所有特征值的乘积等于行列式，所以必有一个特征值为 $0$。"
  },
  {
    id: 3,
    type: "fill",
    subject: "高等数学",
    title: "极限 $\\lim_{x \\to \\infty} (1 + \\frac{2}{x})^x$ 的值为 __________。",
    answer: "$e^2$",
    analysis: "解析：利用重要极限公式 $\\lim_{x \\to \\infty} (1 + \\frac{k}{x})^x = e^k$。此处 $k=2$，故结果为 $e^2$。"
  },
  {
    id: 4,
    type: "choice",
    subject: "概率论",
    title: "设 $A, B$ 为随机事件，若 $P(A) > 0$，且 $P(B|A) = 1$，则必有：",
    options: [
      { label: "A", content: "$P(A) = P(B)$" },
      { label: "B", content: "$A \\subset B$" },
      { label: "C", content: "$P(B-A) = 0$" },
      { label: "D", content: "$P(A-B) = 0$" }
    ],
    answer: "D",
    analysis: "解析：$P(B|A) = \\frac{P(AB)}{P(A)} = 1 \\Rightarrow P(AB) = P(A)$。又 $P(A-B) = P(A) - P(AB) = 0$。注意 $P(A-B)=0$ 不代表 $A \\subset B$，但在初等概率中常选此项。"
  },
  {
    id: 5,
    type: "fill",
    subject: "高等数学",
    title: "极限 $\\lim_{x \\to 0} \\frac{\\int_0^x \\sin(t^2) dt}{x^3}$ 的值为 __________。",
    answer: "$\\frac{1}{3}$",
    analysis: "解析：此为 $0/0$ 型极限，使用洛必达法则对分子分母分别求导。对变上限积分求导，原式 $= \\lim_{x \\to 0} \\frac{\\sin(x^2)}{3x^2}$。当 $x \\to 0$ 时，$\\sin(x^2) \\sim x^2$，故极限为 $\\lim_{x \\to 0} \\frac{x^2}{3x^2} = \\frac{1}{3}$。"
  },
  {
    id: 6,
    type: "choice",
    subject: "高等数学",
    title: "当 $x \\to 0$ 时，若 $x - \\tan x$ 与 $x^k$ 是同阶无穷小，则 $k$ 的值为：",
    options: [
      { label: "A", content: "$1$" },
      { label: "B", content: "$2$" },
      { label: "C", content: "$3$" },
      { label: "D", content: "$4$" }
    ],
    answer: "C",
    analysis: "解析：利用泰勒展开公式，$\\tan x = x + \\frac{x^3}{3} + o(x^3)$。则 $x - \\tan x = -\\frac{x^3}{3} + o(x^3)$。可以看出其最低次幂为 3 次，所以它是 $x$ 的 3 阶无穷小，$k = 3$。"
  },
  {
    id: 7,
    type: "choice",
    subject: "高等数学",
    title: "设函数 $f(x) = \\begin{cases} \\frac{1-\\cos\\sqrt{x}}{x}, & x>0 \\\\ a, & x=0 \\end{cases}$，若 $f(x)$ 在 $x=0$ 处连续，则 $a$ 的值为：",
    options: [
      { label: "A", content: "$\\frac{1}{2}$" },
      { label: "B", content: "$1$" },
      { label: "C", content: "$0$" },
      { label: "D", content: "$2$" }
    ],
    answer: "A",
    analysis: "解析：考察函数在分段点的连续性。求 $x \\to 0^+$ 时的极限 $\\lim_{x \\to 0^+} \\frac{1-\\cos\\sqrt{x}}{x}$。当 $u \\to 0$ 时，$1-\\cos u \\sim \\frac{u^2}{2}$，故 $1-\\cos\\sqrt{x} \\sim \\frac{(\\sqrt{x})^2}{2} = \\frac{x}{2}$。因此极限为 $\\frac{x/2}{x} = \\frac{1}{2}$。因为 $f(x)$ 在 $x=0$ 处连续，所以 $a = f(0) = \\frac{1}{2}$。"
  },
  {
    id: 8,
    type: "choice",
    subject: "线性代数",
    title: "设 $A, B$ 均为 $n$ 阶实对称矩阵，且 $A$ 与 $B$ 相似，则必有：",
    options: [
      { label: "A", content: "$A, B$ 具有完全相同的特征向量" },
      { label: "B", content: "$A$ 与 $B$ 合同" },
      { label: "C", content: "$A, B$ 的秩不同" },
      { label: "D", content: "$A, B$ 不一定正交相似" }
    ],
    answer: "B",
    analysis: "解析：实对称矩阵必定可以正交相似于对角阵。因为 $A, B$ 相似，所以它们具有相同的特征值，从而它们正交相似于同一个对角阵 $\\Lambda$。根据相似和合同的性质，它们都合同于 $\\Lambda$，由合同的传递性可知，$A$ 与 $B$ 必然合同。"
  },
  {
    id: 9,
    type: "fill",
    subject: "高等数学",
    title: "设函数 $z = z(x,y)$ 由方程 $e^{x+y+z} + xyz = 1$ 确定，则点 $(0, 0, 0)$ 处的全微分 $dz =$ __________。",
    answer: "$-dx - dy$",
    analysis: "解析：对方程两边求全微分，得 $e^{x+y+z}(dx + dy + dz) + yz dx + xz dy + xy dz = 0$。将 $x=0, y=0, z=0$ 代入上式，得到 $1 \\cdot (dx + dy + dz) + 0 = 0$，化简即得 $dz = -dx - dy$。"
  },
  {
    id: 10,
    type: "choice",
    subject: "概率论",
    title: "设随机变量 $X, Y$ 独立同分布，且均服从标准正态分布 $N(0, 1)$，则 $\\frac{(X+Y)^2}{2}$ 服从的分布为：",
    options: [
      { label: "A", content: "$N(0, 1)$" },
      { label: "B", content: "$\\chi^2(1)$" },
      { label: "C", content: "$\\chi^2(2)$" },
      { label: "D", content: "$F(1, 1)$" }
    ],
    answer: "B",
    analysis: "解析：因为 $X, Y$ 相互独立且服从 $N(0, 1)$，由正态分布的可加性可知，$X+Y$ 服从 $N(0, 2)$。将其标准化，即 $Z = \\frac{X+Y}{\\sqrt{2}}$ 服从标准正态分布 $N(0, 1)$。根据卡方分布的定义，标准正态分布变量的平方服从自由度为 1 的卡方分布，因此 $Z^2 = \\frac{(X+Y)^2}{2}$ 服从 $\\chi^2(1)$。"
  },
  {
    id: 11,
    type: "fill",
    subject: "线性代数",
    title: "设 3 阶实矩阵 $A$ 的特征值为 $1, 2, -1$，$E$ 为 3 阶单位矩阵，则矩阵行列式 $|A^2 + E|$ 的值为 __________。",
    answer: "$20$",
    analysis: "解析：根据矩阵多项式特征值的性质，若 $A$ 的特征值为 $\\lambda$，则多项式 $f(A) = A^2 + E$ 的特征值为 $f(\\lambda) = \\lambda^2 + 1$。将 $A$ 的特征值分别代入，得到 $A^2 + E$ 的特征值为：$1^2+1=2$，$2^2+1=5$，$(-1)^2+1=2$。矩阵的行列式等于其特征值之积，故 $|A^2 + E| = 2 \\times 5 \\times 2 = 20$。"
  },
  {
    id: 12,
    type: "choice",
    subject: "高等数学",
    title: "设空间曲面 $\\Sigma$ 为 $x^2 + y^2 + z^2 = 1$ $(z \\ge 0)$，则第一类曲面积分 $\\iint_{\\Sigma} z dS$ 的值为：",
    options: [
      { label: "A", content: "$\\pi$" },
      { label: "B", content: "$2\\pi$" },
      { label: "C", content: "$\\frac{\\pi}{2}$" },
      { label: "D", content: "$4\\pi$" }
    ],
    answer: "A",
    analysis: "解析：$\\Sigma$ 为上半球面。其在 $xOy$ 平面的投影区域 $D$ 为 $x^2 + y^2 \\le 1$。由于曲面方程 $z = \\sqrt{1 - x^2 - y^2}$，面积元素 $dS = \\sqrt{1 + (z_x)^2 + (z_y)^2} dxdy = \\frac{1}{\\sqrt{1 - x^2 - y^2}} dxdy = \\frac{1}{z} dxdy$。故原积分 $= \\iint_D z \\cdot \\frac{1}{z} dxdy = \\iint_D 1 dxdy$，其值即为投影圆 $D$ 的面积 $\\pi \\times 1^2 = \\pi$。"
  },
  {
    id: 13,
    type: "choice",
    subject: "高等数学",
    title: "已知正项级数 $\\sum_{n=1}^{\\infty} a_n$ 收敛，则下列级数中必定收敛的是：",
    options: [
      { label: "A", content: "$\\sum_{n=1}^{\\infty} \\sqrt{a_n}$" },
      { label: "B", content: "$\\sum_{n=1}^{\\infty} a_n^2$" },
      { label: "C", content: "$\\sum_{n=1}^{\\infty} \\frac{a_n}{\\sqrt{n}}$" },
      { label: "D", content: "$\\sum_{n=1}^{\\infty} a_n^{1/n}$" }
    ],
    answer: "B",
    analysis: "解析：级数 $\\sum a_n$ 收敛必有一般项趋于 0，即 $\\lim_{n\\to\\infty} a_n = 0$。所以存在 $N$，当 $n > N$ 时，$0 < a_n < 1$。此时必定有 $a_n^2 < a_n$。由正项级数的比较审敛法可知，较小的级数 $\\sum a_n^2$ 必定收敛。A、C、D均可举出反例（如考虑 $p$ 级数）。"
  },
  {
    id: 14,
    type: "fill",
    subject: "概率论",
    title: "设随机变量 $X$ 服从参数为 $\\lambda$ 的泊松分布。若 $P(X = 1) = P(X = 2)$，则期望 $E(X^2) =$ __________。",
    answer: "$6$",
    analysis: "解析：由泊松分布概率公式 $P(X=k) = \\frac{\\lambda^k}{k!} e^{-\\lambda}$，根据条件有：$\\lambda e^{-\\lambda} = \\frac{\\lambda^2}{2} e^{-\\lambda}$。解方程得 $\\lambda = 2$（$\\lambda=0$ 不合题意舍去）。泊松分布的期望 $E(X) = \\lambda = 2$，方差 $D(X) = \\lambda = 2$。因此 $E(X^2) = D(X) + [E(X)]^2 = 2 + 2^2 = 6$。"
  }
];