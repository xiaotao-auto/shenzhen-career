// ============================================================
// 半生路 v3.1 — 22岁到50岁人生模拟器（温暖家庭风）
// ============================================================
var soundManager = require('./sound.js');
const GW=750,GH=1334;
// 温暖家庭配色方案
const C={
  bg:'#FFF8F0',         // 暖米白背景
  bgDark:'#F5E6D3',     // 深一点的暖色
  card:'#FFFFFF',       // 纯白卡片
  cardAlt:'#FFF3E8',    // 暖白卡片
  border:'#E8D5C0',     // 暖棕边框
  textDark:'#3D2B1F',   // 深棕文字
  textMid:'#8B7355',    // 中棕文字
  textLight:'#B8A08A',  // 浅棕文字
  orange:'#E8763A',     // 暖橙（主色）
  coral:'#E85D5D',      // 珊瑚红
  gold:'#D4A843',       // 暖金
  green:'#6B9E4F',      // 自然绿
  sky:'#5B9BD5',        // 天空蓝
  purple:'#9B7DB8',     // 柔紫
  pink:'#E8A0BF',       // 暖粉
  brown:'#8D6E63',      // 大地棕
  warmRed:'#D45050',    // 暖红
  cream:'#FFF3E0',      // 奶油色
  shadow:'rgba(139,115,85,0.15)', // 暖色阴影
};
const PHASES=[
  {id:'rookie',name:'职场菜鸟',range:[22,26],color:'#E8763A',emoji:'🐣',salary:6000},
  {id:'growth',name:'职场成长',range:[27,33],color:'#D4A843',emoji:'🔥',salary:12000},
  {id:'midlife',name:'中年危机',range:[34,42],color:'#8D6E63',emoji:'🏔️',salary:20000},
  {id:'twilight',name:'退休倒计时',range:[43,50],color:'#5B9BD5',emoji:'🌅',salary:25000},
];

// 事件：{id,tag,scene,text,options:[{label,money,energy,expect,career,happiness,desc}]}
// money=万, energy/expect/career/happiness=百分比
const EV={
rookie:[
{id:'r01',tag:'🎓 毕业季',scene:'school',text:'毕业了！你站在校门口，攥着简历，面前是四条路——',
o:[{l:'🏢 去大厂卷',m:2,e:-10,x:15,c:20,h:-5,d:'你进了大厂，月薪6K。室友说"你牛"，但你每天加班到11点。'},
{l:'🏛️ 考公务员',m:0,e:-15,x:25,c:5,h:10,d:'考了三次上岸。工资不高但稳定，妈妈在亲戚群发了三条语音。'},
{l:'🚀 跟朋友创业',m:-1,e:-20,x:-10,c:15,h:5,d:'租了间小办公室画PPT，前三个月没有一分收入。'},
{l:'📚 考研再读',m:-2,e:-15,x:10,c:0,h:5,d:'又读了三年。出来发现应届生比你年轻三岁，起薪差不多。'}]},
{id:'r02',tag:'💼 第一份工',scene:'office',text:'入职第一个月，领导安排你做PPT，你通宵做完，领导只看了一眼——',
o:[{l:'😤 继续加班改',m:0,e:-15,x:5,c:10,h:-10,d:'你改了7版，领导用了第2版。你学到了一个词叫"职场PUA"。'},
{l:'😊 虚心请教',m:0,e:-5,x:5,c:15,h:0,d:'老同事教了你几个技巧，你开始上手了。融入感+1。'},
{l:'😐 凑合交差',m:0,e:5,x:0,c:-5,h:5,d:'领导没说什么，但你在他心里打了折。多了时间刷手机。'},
{l:'🚶 想跳槽了',m:0,e:-5,x:-5,c:0,h:5,d:'你开始看招聘APP。但简历只有1个月经历，没人理你。'}]},
{id:'r03',tag:'🏠 租房',scene:'home',text:'要租房了，你在网上看了三天，越看越绝望——',
o:[{l:'🏢 合租城中村',m:0,e:-5,x:-5,c:0,h:-10,d:'8平米隔断房，隔壁呼噜声清晰可闻，但省了¥1500/月。'},
{l:'🏠 租正规小区',m:-3,e:5,x:5,c:0,h:10,d:'月租¥3500占工资一半。但你睡得好，周末能做饭。'},
{l:'👥 和朋友合租',m:-1,e:0,x:0,c:0,h:5,d:'两居室三人住。热闹但拥挤，有人不爱洗碗。'},
{l:'🏠 住亲戚家',m:1,e:-10,x:10,c:0,h:-15,d:'免费住表姐家客厅，但每天陪她孩子写作业到10点。'}]},
{id:'r04',tag:'💰 第一笔工资',scene:'office',text:'第一个月工资到账！¥6000扣完社保到手¥4800——',
o:[{l:'💳 存起来',m:1,e:0,x:5,c:0,h:0,d:'你把¥4000存了定期。看着余额从0变4000，有种微小的安全感。'},
{l:'🛍️ 奖励自己',m:-1,e:10,x:0,c:0,h:15,d:'买了新手机和球鞋。爽！然后信用卡账单也来了。'},
{l:'👨‍👩‍👦 寄回家',m:-1,e:0,x:20,c:0,h:5,d:'给妈妈转了¥2000。她说"不用"，但马上发了朋友圈。'},
{l:'📖 投资自己',m:-1,e:-5,x:0,c:10,h:5,d:'报了¥3000的培训班。下班后上课，累但充实。'}]},
{id:'r05',tag:'💔 初恋',scene:'street',text:'大学谈了三年的对象说：你去了大城市，我们可能不太合适了——',
o:[{l:'😭 苦苦挽留',m:0,e:-15,x:-5,c:-5,h:-20,d:'打了三小时电话，对方说"你太幼稚了"。你哭了一晚上。'},
{l:'😎 潇洒放手',m:0,e:5,x:0,c:5,h:-5,d:'你说了句"祝好"，一个人喝了顿酒。第二天你更拼了。'},
{l:'🤝 协议做朋友',m:0,e:-5,x:0,c:0,h:-10,d:'偶尔还聊，但越来越少。后来对方朋友圈出现了另一个人。'},
{l:'😤 化悲愤为力量',m:0,e:-10,x:5,c:15,h:0,d:'你把所有时间投入工作，三个月后升了一级。'}]},
{id:'r06',tag:'🏠 家里来电',scene:'home',text:'妈妈打电话："隔壁王婶的儿子都买房了，你啥时候……"',
o:[{l:'😅 哄着说快了',m:0,e:-5,x:10,c:0,h:-5,d:'"妈我攒着呢！"挂了电话你看了眼存款：¥3200。'},
{l:'😤 烦死了挂了',m:0,e:5,x:-20,c:0,h:-5,d:'你摔了手机。又捡起来发了条微信："刚信号不好"。'},
{l:'📊 算账讲道理',m:0,e:-5,x:-5,c:0,h:0,d:'你列了收支表发给妈妈。妈妈回："你爸当年比你还穷。"你无言以对。'},
{l:'🙏 请求理解',m:0,e:-5,x:5,c:0,h:5,d:'"妈，我刚毕业，给我点时间。"妈妈叹气："行，照顾好自己。"'}]},
{id:'r07',tag:'🎲 社交',scene:'street',text:'室友约旅行，AA制人均¥2000。你卡里只剩¥5000——',
o:[{l:'✈️ 去！青春无价',m:-2,e:10,x:0,c:0,h:15,d:'去了厦门拍了200张照片。回来吃了一周泡面。'},
{l:'🚶 就近玩一天',m:-1,e:5,x:0,c:0,h:10,d:'去郊区露营，也挺好的。至少不用吃泡面。'},
{l:'💸 不去了，穷',m:0,e:-5,x:0,c:0,h:-10,d:'看着他们的朋友圈，假装不羡慕。'},
{l:'💰 周末做兼职',m:1,e:-10,x:0,c:5,h:-5,d:'做了两天兼职赚了¥800。没有旅行，但有存款。'}]},
{id:'r08',tag:'💼 加班文化',scene:'office',text:'部门流行"自愿加班"，大家9点后才走。你6点做完了——',
o:[{l:'🏢 坐到9点',m:0,e:-10,x:5,c:10,h:-10,d:'刷3小时手机假装忙碌。领导路过点了点头。"态度好"口碑+1。'},
{l:'🚶 6点直接走',m:0,e:5,x:0,c:-10,h:10,d:'全部门看着你走出大门。第二天领导找你"聊聊工作态度"。'},
{l:'📱 假装加班',m:0,e:-5,x:5,c:5,h:-5,d:'你在工位刷手机到8点。浪费2小时但没人说什么。'},
{l:'💻 利用时间学习',m:0,e:-15,x:5,c:20,h:0,d:'你利用"加班"时间学了新技术。三个月后跳槽涨薪50%。'}]},
],
growth:[
{id:'g01',tag:'💼 晋升机会',scene:'office',text:'部门主管岗位空缺，你和另一个同事都有机会——',
o:[{l:'⚔️ 正面竞争',m:3,e:-15,x:10,c:20,h:-5,d:'加班一个月做了三份方案。你赢了，月薪涨3K，但和那个同事再也回不去了。'},
{l:'🤝 主动让路',m:0,e:5,x:0,c:-10,h:10,d:'对方升了请你吃饭。你保持了关系，但每次要向他汇报。'},
{l:'🚀 直接跳槽',m:5,e:-10,x:5,c:15,h:5,d:'拿着经验跳到竞品公司，直接主管title，月薪+5K。'},
{l:'📊 用数据说话',m:2,e:-10,x:5,c:15,h:5,d:'你整理了半年业绩找领导谈。"我考虑一下"，两周后你升了。'}]},
{id:'g02',tag:'❤️ 感情选择',scene:'home',text:'你认识了不错的人，但对方说"异地我不太能接受"——',
o:[{l:'🏠 为爱回老家',m:-3,e:5,x:20,c:-15,h:15,d:'辞了大城市的工作回老家。工资砍半，但每天有人等你回家。'},
{l:'📱 先谈着试试',m:0,e:-10,x:0,c:0,h:-5,d:'异地恋真难。视频聊到深夜但见面越来越少，半年后对方说"算了"。'},
{l:'😤 不将就！',m:0,e:5,x:-10,c:5,h:5,d:'"我能找到更好的。"你删了对方微信。然后失眠了三天。'},
{l:'🏠 邀对方来你城市',m:-2,e:-5,x:5,c:0,h:10,d:'对方犹豫很久最终来了。你们开始了新的城市生活。'}]},
{id:'g03',tag:'💸 买房抉择',scene:'home',text:'房价一直在涨，爸妈说可以帮你凑首付，但要还30年房贷——',
o:[{l:'🏠 咬牙上车',m:-10,e:-5,x:20,c:0,h:-5,d:'郊区买了70平小房子。月供¥8000，从此花钱都要算。'},
{l:'🚫 不买，租房',m:0,e:5,x:-15,c:0,h:10,d:'你决定自由。但每次搬家都很痛苦，租金也年年涨。'},
{l:'🏘️ 回老家买',m:-3,e:0,x:10,c:-5,h:0,d:'老家房子便宜但你不在那住。月月还贷房子空着落灰。'},
{l:'📊 再等等看',m:0,e:-5,x:-5,c:0,h:-5,d:'等了两年房价又涨20%。你后悔当初没买。'}]},
{id:'g04',tag:'💼 职场PUA',scene:'office',text:'领导在会上点名批评你："有些人就是不上心，你不适合干这行。"',
o:[{l:'😤 当场反驳',m:0,e:5,x:-5,c:-10,h:10,d:'全场安静。你说了该说的，但之后领导再没给过你好项目。'},
{l:'🤐 忍了继续干',m:0,e:-15,x:5,c:5,h:-20,d:'你告诉自己"忍忍就过去了"。但每天闹钟响时都不想起床。'},
{l:'📋 收集证据',m:0,e:-5,x:0,c:0,h:5,d:'你默默截图保存。半年后拿着证据和HR谈，领导被调走了。'},
{l:'🚪 直接辞职',m:-2,e:10,x:-10,c:-5,h:10,d:'你第二天没去上班。失业三个月后找到了新工作，薪水更高。'}]},
{id:'g05',tag:'🎲 副业诱惑',scene:'home',text:'朋友邀你一起做自媒体/带货，说月入3万不是梦——',
o:[{l:'🎬 全职投入',m:-2,e:-20,x:-5,c:-10,h:5,d:'辞职做自媒体。前三个月0收入，第四个月终于赚了¥2000。'},
{l:'🌙 下班后搞',m:2,e:-20,x:0,c:5,h:-5,d:'白天上班晚上剪视频每天只睡5小时。半年后副业月入¥5000，但人快废了。'},
{l:'🤝 只投资不出力',m:-1,e:0,x:0,c:0,h:0,d:'你投了¥1万。朋友做了三个月放弃了，钱打水漂了。'},
{l:'🚫 算了不折腾',m:0,e:5,x:0,c:5,h:5,d:'你把时间用在提升本职工作上，年底拿了优秀员工。'}]},
{id:'g06',tag:'🏠 家里催婚',scene:'home',text:'过年回家，七大姑八大姨围着你："有对象了吗？年纪不小了！"',
o:[{l:'😬 答应去相亲',m:-1,e:-5,x:20,c:0,h:-5,d:'你见了三个相亲对象。一个10分钟就走了，一个要你买房，还有一个……还行。'},
{l:'😤 顶回去',m:0,e:5,x:-25,c:0,h:5,d:'"我的事不用你们管！"全场沉默。妈妈偷偷哭了，你内疚了整年。'},
{l:'😂 打太极糊弄',m:0,e:-5,x:5,c:0,h:0,d:'"在谈了在谈了！"你编了一个人设撑过了春节。明年还得编。'},
{l:'📱 试试社交软件',m:0,e:-5,x:5,c:0,h:5,d:'注册了三个APP，聊了20个见了5个，有一个约了第二次。'}]},
{id:'g07',tag:'💡 职业瓶颈',scene:'office',text:'工作5年了，在重复同样的活，看不到上升空间——',
o:[{l:'📚 考证/读MBA',m:-3,e:-15,x:5,c:15,h:-5,d:'报了MBA周末全泡在课堂。两年后跳槽涨薪40%，但没了所有社交。'},
{l:'🔄 换赛道转行',m:-2,e:-20,x:-5,c:10,h:5,d:'从头学新领域。前半年工资降30%，但一年后追回来了。'},
{l:'🧘 躺平混日子',m:0,e:10,x:-5,c:-10,h:10,d:'开始了965的日子。工作不温不火，但终于有时间生活了。'},
{l:'🤝 找mentor带',m:0,e:-5,x:5,c:15,h:5,d:'约了行业前辈喝咖啡。几个关键建议让你少走两年弯路。'}]},
{id:'g08',tag:'🎲 同学差距',scene:'street',text:'同学聚会上有人年薪50万，有人创业拿融资，有人考上博士——',
o:[{l:'😤 焦虑到失眠',m:0,e:-15,x:0,c:0,h:-20,d:'你开始疯狂比较越比越焦虑。连续一周失眠工作效率也下来了。'},
{l:'😎 为他们开心',m:0,e:5,x:0,c:0,h:10,d:'"每个人都有自己的时区。"你给自己倒了杯酒，祝他们越来越好。'},
{l:'📊 盘点自己的路',m:0,e:-5,x:0,c:10,h:5,d:'你回去认真做了职业规划。差距是有的，但你找到了自己的节奏。'},
{l:'🤝 拓展人脉',m:-1,e:-5,x:5,c:10,h:5,d:'你和混得好的同学保持联系，后来真的通过他们拿到了一个机会。'}]},
],
midlife:[
{id:'m01',tag:'👶 生不生娃',scene:'home',text:'年纪到了，身边的朋友都在晒娃。你和伴侣讨论——',
o:[{l:'👶 生！',m:-5,e:-15,x:25,c:-10,h:10,d:'孩子出生了。第一次当父母手忙脚乱。奶粉月嫂早教月均¥8000起。'},
{l:'⏳ 再等等',m:0,e:5,x:-10,c:5,h:0,d:'"再准备准备"。但年龄不等人，后来想生的时候更难了。'},
{l:'🚫 丁克到底',m:2,e:10,x:-25,c:5,h:10,d:'"两个人的生活也挺好。"但每次回家过年都是一场审讯。'},
{l:'🐱 先养只猫',m:-1,e:-5,x:-5,c:0,h:15,d:'你养了只橘猫。它不催你买房不问你工资，只会蹭你的腿。'}]},
{id:'m02',tag:'💼 35岁裁员',scene:'office',text:'公司优化，你赫然在名单上。HR说"N+1，签了吧"——',
o:[{l:'⚖️ 劳动仲裁',m:3,e:-10,x:0,c:-5,h:-5,d:'你赢了多拿了3个月赔偿。但行业圈子小，面试总被问"为什么离开"。'},
{l:'🚀 拿赔偿创业',m:-5,e:-20,x:5,c:15,h:5,d:'用赔偿金开了公司。第一年亏了，第二年持平，第三年开始盈利。'},
{l:'📋 赶紧找工作',m:0,e:-15,x:5,c:-5,h:-10,d:'投了100份简历面了20家。三个月后找到新工作，工资降了20%。'},
{l:'🧘 先休息一阵',m:-2,e:15,x:-5,c:-10,h:10,d:'你给自己放了三个月假。每天跑步读书做饭，好像重新找到了自己。'}]},
{id:'m03',tag:'🏠 房贷压力',scene:'home',text:'每月房贷¥12000，孩子幼儿园¥5000，钱永远不够用——',
o:[{l:'💸 削减一切开支',m:1,e:-5,x:0,c:0,h:-15,d:'开始记账。不聚餐不买衣服不旅游。生活变成了一串数字。'},
{l:'💰 拼命搞钱',m:5,e:-25,x:10,c:10,h:-10,d:'你接了三份副业每天只睡4小时。钱多了，但你开始心悸。'},
{l:'🏘️ 卖房换小的',m:5,e:-5,x:-5,c:0,h:5,d:'换了个小房子月供减半。空间小了但压力也小了。'},
{l:'👨‍👩‍👦 找爸妈支援',m:3,e:5,x:-10,c:0,h:-5,d:'爸妈又凑了¥5万。你很愧疚，但实在没办法了。'}]},
{id:'m04',tag:'💔 婚姻危机',scene:'home',text:'你和伴侣最近总吵架，都是鸡毛蒜皮但越吵越累——',
o:[{l:'💬 认真沟通',m:0,e:-10,x:0,c:0,h:15,d:'坐下来谈了一整晚。哭了，但也终于理解了对方。关系慢慢回暖。'},
{l:'😶 互相冷战',m:0,e:-15,x:0,c:-5,h:-20,d:'开始各过各的。同一屋檐下，话越来越少。'},
{l:'💔 凑合过',m:0,e:-10,x:5,c:0,h:-10,d:'"为了孩子。"你们把矛盾压了下去。但隔阂像裂缝越来越大。'},
{l:'🔄 做心理咨询',m:-1,e:-5,x:0,c:0,h:10,d:'去做了伴侣咨询。有点用，但更多要靠两个人自己。'}]},
{id:'m05',tag:'🏥 身体警报',scene:'home',text:'体检：脂肪肝、颈椎病、轻度焦虑——医生说"注意生活方式"',
o:[{l:'🏃 开始运动',m:-1,e:-5,x:0,c:-5,h:15,d:'每天跑步5公里。一个月瘦了3斤，体检指标有所好转。'},
{l:'💊 先吃药顶着',m:-1,e:5,x:0,c:5,h:-5,d:'开了药但没改习惯。药吃完又犯了。'},
{l:'😴 增加睡眠',m:0,e:10,x:0,c:-5,h:10,d:'开始10点睡6点起。精神好了很多，但晚上9点后的工作没人做。'},
{l:'😤 没空管这些',m:0,e:-10,x:5,c:5,h:-15,d:'"等我忙完这阵再说。"但你总有下一阵要忙。'}]},
{id:'m06',tag:'💼 职场天花板',scene:'office',text:'在这个位置做了5年，上面的位子只有1个，等的人排着队——',
o:[{l:'⚔️ 使劲往上挤',m:5,e:-20,x:10,c:15,h:-10,d:'疯狂社交做项目。一年后你升了，但头发白了一片。'},
{l:'🔄 转管理路线',m:3,e:-10,x:5,c:10,h:0,d:'开始带团队。写代码少了开会多了。你不确定这是不是想要的。'},
{l:'🚀 出来创业',m:-5,e:-25,x:5,c:20,h:5,d:'拉几个兄弟出来创业。前两年亏损，第三年持平，第四年盈利。'},
{l:'🧘 就这样吧',m:0,e:10,x:-5,c:-5,h:10,d:'你接受了"不是每个人都能当总监"。开始把精力分给生活。'}]},
{id:'m07',tag:'🏠 父母养老',scene:'home',text:'爸妈年纪大了身体越来越差。他们在老家你在大城市——',
o:[{l:'🏠 接来身边',m:-3,e:-10,x:15,c:-5,h:5,d:'租了大房子把爸妈接来。但他们不习惯大城市，整天闷在家。'},
{l:'📞 常打电话',m:0,e:-5,x:5,c:0,h:-5,d:'每周视频通话。但每次挂完电话都觉得不够。'},
{l:'💰 请人照顾',m:-3,e:0,x:10,c:0,h:0,d:'请了阿姨照顾爸妈。¥5000/月，多了一个固定支出。'},
{l:'🏠 回老家发展',m:-5,e:5,x:20,c:-15,h:10,d:'你回老家了。工资降了一大截，但每天能看到爸妈。'}]},
{id:'m08',tag:'🎲 中年社交',scene:'street',text:'朋友圈越来越安静。以前经常聚的朋友，现在连点赞都少了——',
o:[{l:'📞 主动约人',m:-1,e:-5,x:0,c:5,h:10,d:'你组了个局。只来了4个人，但聊到凌晨很开心。'},
{l:'🧘 享受独处',m:0,e:5,x:0,c:0,h:10,d:'你开始习惯一个人的周末。跑步看书做饭，也挺好。'},
{l:'📱 沉迷短视频',m:0,e:-5,x:0,c:0,h:-5,d:'一刷就到凌晨2点。第二天更累，但晚上又忍不住刷。'},
{l:'🎯 培养新爱好',m:-1,e:-5,x:0,c:0,h:15,d:'你开始学吉他/画画/摄影。学得慢，但每次都很享受。'}]},
],
twilight:[
{id:'t01',tag:'💼 职场最后冲刺',scene:'office',text:'45岁了，公司又在招年轻人。有人议论"老员工性价比低"——',
o:[{l:'📖 考证证明价值',m:-1,e:-15,x:5,c:10,h:-5,d:'你考了行业认证。有用，但学得比以前慢多了。'},
{l:'🤝 转型做顾问',m:3,e:-5,x:5,c:10,h:10,d:'你开始做外部顾问用经验赚钱。轻松些，收入也不差。'},
{l:'😤 硬扛不退',m:0,e:-15,x:5,c:0,h:-10,d:'你拼命加班证明自己。但身体开始频繁出状况。'},
{l:'🌅 提前退休规划',m:-2,e:5,x:0,c:-10,h:10,d:'你开始规划退休。算了笔账，省着点55岁可以退休。'}]},
{id:'t02',tag:'👶 孩子的选择',scene:'home',text:'孩子说不想考大学，想去做电竞/当主播/创业——',
o:[{l:'😤 必须考大学',m:0,e:-10,x:10,c:0,h:-15,d:'你和孩子大吵一架。孩子摔门进房间，一周没和你说话。'},
{l:'🤝 尊重TA的选择',m:-2,e:-5,x:-15,c:0,h:10,d:'"我支持你，但要为自己负责。"孩子说谢谢，你却整夜睡不着。'},
{l:'📋 约法三章',m:-1,e:-5,x:5,c:0,h:5,d:'"给你一年时间不行就回来读书。"你们签了"协议"。'},
{l:'🌟 分享你的经验',m:0,e:-5,x:0,c:0,h:10,d:'你把年轻时踩过的坑告诉了孩子。TA听进去了，但最后还是选了自己的路。'}]},
{id:'t03',tag:'💰 理财规划',scene:'home',text:'你积攒了一些存款，有人推荐买基金/炒股/投资——',
o:[{l:'📈 冲进股市',m:0,e:-10,x:0,c:0,h:-10,d:'50%概率赚30%，50%概率亏30%。你选了……命运决定。'},
{l:'🏦 稳健理财',m:2,e:0,x:0,c:0,h:5,d:'买了稳健型基金。年化4%，不多但安心。'},
{l:'🏠 投资房产',m:-5,e:-5,x:10,c:0,h:5,d:'买了第二套房出租。有稳定租金但贷款压力也不小。'},
{l:'🔒 就存银行',m:1,e:0,x:0,c:0,h:0,d:'你什么都没投。安全，但看着通胀有点心慌。'}]},
{id:'t04',tag:'🏥 身体大修',scene:'home',text:'体检发现需要做个小手术，医生说"不急但也不能拖"——',
o:[{l:'🏥 马上做手术',m:-3,e:-15,x:0,c:-5,h:5,d:'手术很顺利。修养一个月，你感觉身体轻了不少。'},
{l:'💊 先保守治疗',m:-1,e:-5,x:0,c:0,h:-5,d:'吃了半年药病情稳定但没好转。医生说"迟早要做的"。'},
{l:'😤 没时间管',m:0,e:-10,x:0,c:5,h:-15,d:'你继续加班。半年后病情加重不得不住院花更多钱。'},
{l:'🧘 顺势调整生活',m:-2,e:5,x:5,c:-10,h:15,d:'你把工作减了半开始规律作息。身体好了收入少了，但你觉得值。'}]},
{id:'t05',tag:'❤️ 回顾人生',scene:'home',text:'深夜一个人坐在阳台上看城市灯火，突然想——这辈子值吗？',
o:[{l:'😊 值了',m:0,e:10,x:5,c:0,h:20,d:'虽然吃了不少苦但也有过开心的时刻。够了。'},
{l:'😔 有些遗憾',m:0,e:-5,x:0,c:0,h:-10,d:'你想起那些没选的路。如果当初……但没有如果。'},
{l:'🔥 还没完呢！',m:0,e:10,x:5,c:10,h:10,d:'"50岁才是下半场的开始。"你给自己倒了杯酒开始列新目标。'},
{l:'🧘 平淡是福',m:0,e:5,x:0,c:0,h:15,d:'你不再追求什么了。每天散步做饭看新闻，也挺好。'}]},
{id:'t06',tag:'🏠 家族聚会',scene:'home',text:'回老家参加家族聚会，亲戚们有的比你有出息有的不如你——',
o:[{l:'😊 平常心面对',m:0,e:5,x:5,c:0,h:10,d:'你发现每个人都有自己的苦。那个"有出息"的表哥头发白了一半。'},
{l:'😅 低调装穷',m:0,e:0,x:-5,c:0,h:5,d:'你学会了"哭穷"。果然没人找你借钱了，但爸妈面子挂不住。'},
{l:'🎉 大方请客',m:-2,e:-5,x:15,c:0,h:5,d:'你请全家人吃了顿大餐。爸妈很开心，你的钱包哭了。'},
{l:'🚶 早点离开',m:0,e:5,x:0,c:0,h:0,d:'你坐了半小时就借口走了。回家路上你松了口气。'}]},
],
};

// 结局
const ENDINGS={
tycoon:  {e:'🏆',t:'人生赢家',  c:C.gold,   d:'你实现了财务自由，\n成为全村的传奇。\n过年回家，村口挂了横幅。'},
stable:  {e:'🏠',t:'平淡幸福',  c:C.green,  d:'你有一份稳定的工作，\n一个温暖的家。\n不富裕，但很踏实。'},
burnout: {e:'🛏️',t:'身心俱疲',  c:C.brown,  d:'你拼了大半辈子，\n换来一身病和一个空荡荡的家。\n退休后你才开始学着生活。'},
broke:   {e:'💸',t:'入不敷出',  c:C.warmRed, d:'存款归零的那天，\n你站在天桥上看了很久的车流。\n但你还活着，这已经够了。'},
escape:  {e:'🏡',t:'归园田居',  c:C.green,  d:'你回到了老家，\n种菜养鸡，远离喧嚣。\n有时候平静才是真正的赢。'},
regret:  {e:'😔',t:'满心遗憾',  c:C.textMid, d:'你总在想"如果当初"。\n但人生没有如果。\n好在，还有明天。'},
free:    {e:'🌅',t:'自由人生',  c:C.sky,    d:'你不再为任何人而活。\n50岁，你出发了。\n路还很长。'},
family:  {e:'👨‍👩‍👧',t:'家庭至上',c:C.coral,  d:'你把一切都给了家人。\n他们幸福你就幸福。\n只是偶尔会想，自己呢？'},
};

// ── 工具函数 ──
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function wrapText(ctx,text,x,y,mw,lh){
  let line='',cy=y;
  for(const ch of text){
    const tl=line+ch;
    if(ctx.measureText(tl).width>mw&&line){ctx.fillText(line,x,cy);line=ch;cy+=lh;}
    else line=tl;
  }
  if(line)ctx.fillText(line,x,cy);return cy;
}
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}
// 温暖风装饰：飘落的花瓣/树叶
function drawPetals(ctx,w,h,n){
  ctx.save();
  const petalColors=['#FFB7C5','#FFDAB9','#FFE4C4','#F5DEB3','#E8C9A0'];
  for(let i=0;i<n;i++){
    const x=(Math.sin(i*137.5+0.3)*.5+.5)*w;
    const y=(Math.cos(i*97.3+0.7)*.5+.5)*h;
    ctx.globalAlpha=.15+(i%4)*.08;
    ctx.fillStyle=petalColors[i%petalColors.length];
    ctx.beginPath();
    // 小花瓣形状
    ctx.ellipse(x,y,3+i%3,2+i%2,i*0.5,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}
// 温暖的云朵装饰
function drawClouds(ctx,w,h){
  ctx.save();ctx.globalAlpha=0.08;
  const clouds=[{x:w*0.15,y:h*0.08,s:1},{x:w*0.7,y:h*0.12,s:0.7},{x:w*0.45,y:h*0.05,s:0.5}];
  clouds.forEach(cl=>{
    ctx.fillStyle='#FFFFFF';
    ctx.beginPath();
    ctx.arc(cl.x,cl.y,40*cl.s,0,Math.PI*2);
    ctx.arc(cl.x+35*cl.s,cl.y-10*cl.s,30*cl.s,0,Math.PI*2);
    ctx.arc(cl.x+60*cl.s,cl.y,35*cl.s,0,Math.PI*2);
    ctx.arc(cl.x+25*cl.s,cl.y+5*cl.s,28*cl.s,0,Math.PI*2);
    ctx.fill();
  });
  ctx.restore();
}

// ── 主游戏类 ──
class Game{
  constructor(canvas){
    this.cv=canvas;this.ctx=canvas.getContext('2d');
    this.sc=canvas.width/GW;this.W=GW;this.H=Math.ceil(canvas.height/this.sc);
    this.state='title';
    this.age=22;this.money=0;this.energy=80;this.expect=50;this.career=10;this.happiness=50;
    this.phaseIdx=0;this.stepInPhase=0;this.stepsPerPhase=8;
    this.curEv=null;this.resText='';this.resDelta=null;this.resTimer=0;this.endingKey=null;
    this.evHistory=new Set();this.touchAreas=[];this.frame=0;
    this.soundInited=false;
    this.sw=si.windowWidth;this.sh=si.windowHeight;
    wx.onTouchStart(e=>this._onTouch(e));
    this._loop=this._loop.bind(this);requestAnimationFrame(this._loop);
  }
  _loop(){this.frame++;this._render();requestAnimationFrame(this._loop);}
  _onTouch(e){
    const t=e.touches[0],tx=t.clientX/this.sw*this.W,ty=t.clientY/this.sh*this.H;
    for(const a of this.touchAreas)if(tx>=a.x&&tx<=a.x+a.w&&ty>=a.y&&ty<=a.y+a.h){a.fn();return;}
  }
  get phase(){return PHASES[this.phaseIdx];}
  _initSound(){
    if(this.soundInited)return;
    this.soundInited=true;
    soundManager.init();
    soundManager.resume();
  }
  _loadFirstEv(){
    // 阶段介绍页点击继续后，加载该阶段的第一个事件（不再递增stepInPhase）
    soundManager.playResult();
    const pool=EV[this.phase.id];
    let avail=pool.filter(e=>!this.evHistory.has(e.id));
    if(!avail.length){this.evHistory=new Set();avail=pool;}
    const ev=avail[Math.floor(Math.random()*avail.length)];
    this.evHistory.add(ev.id);this.curEv=ev;this.state='playing';
  }
  _startGame(){
    this.age=22;this.money=0;this.energy=80;this.expect=50;this.career=10;this.happiness=50;
    this.phaseIdx=0;this.stepInPhase=0;this.evHistory=new Set();
    this.state='playing';
    // 初始化音效
    if(!this.soundInited){this.soundInited=true;soundManager.init();soundManager.resume();}
    soundManager.playStart();
    soundManager.startBGM();
    this._nextEv();
  }
  _nextEv(){
    this.stepInPhase++;
    if(this.stepInPhase>this.stepsPerPhase){
      this.stepInPhase=1;
      this.phaseIdx++;
      if(this.phaseIdx>=PHASES.length){this._calcEnding();this.state='ending';soundManager.stopBGM();soundManager.playEnding();return;}
      this.age=PHASES[this.phaseIdx].range[0];
      this.money+=PHASES[this.phaseIdx].salary*6/10000;
      // 阶段切换音效 + 阶段介绍页
      soundManager.playPhaseChange();
      this.state='phaseIntro';return;
    }else{
      this.age++;
    }
    if(this.age>50){this._calcEnding();this.state='ending';soundManager.stopBGM();soundManager.playEnding();return;}
    if(this.energy<=0){this.endingKey='burnout';this.state='ending';soundManager.stopBGM();soundManager.playEnding();return;}
    if(this.money<-5){this.endingKey='broke';this.state='ending';soundManager.stopBGM();soundManager.playEnding();return;}
    // 新事件出现时播放结果音效
    soundManager.playResult();
    const pool=EV[this.phase.id];
    let avail=pool.filter(e=>!this.evHistory.has(e.id));
    if(!avail.length){this.evHistory=new Set();avail=pool;}
    const ev=avail[Math.floor(Math.random()*avail.length)];
    this.evHistory.add(ev.id);this.curEv=ev;this.state='playing';
  }
  _choose(opt){
    this.money=clamp(this.money+(opt.m||0),-99,999);
    this.energy=clamp(this.energy+(opt.e||0),0,100);
    this.expect=clamp(this.expect+(opt.x||0),0,100);
    this.career=clamp(this.career+(opt.c||0),0,100);
    this.happiness=clamp(this.happiness+(opt.h||0),0,100);
    this.resText=opt.d;this.resDelta={m:opt.m||0,e:opt.e||0,x:opt.x||0,c:opt.c||0,h:opt.h||0};
    this.state='result';this.resTimer=0;
    // 选择确认音效 + 属性变化提示
    var d=opt;
    var hasGood=(d.m||0)>0||(d.e||0)>0||(d.c||0)>0||(d.h||0)>0;
    var hasBad=(d.m||0)<0||(d.e||0)<0||(d.c||0)<0||(d.h||0)<-10;
    if(hasGood&&!hasBad) soundManager.playStatUp();
    else if(hasBad&&!hasGood) soundManager.playStatDown();
    else soundManager.playChoose();
  }
  _calcEnding(){
    const{money:m,energy:e,expect:x,career:c,happiness:h}=this;
    if(m>=20&&c>=60&&h>=50){this.endingKey='tycoon';return;}
    if(m>=5&&h>=60&&x>=40){this.endingKey='stable';return;}
    if(h>=70&&c<30){this.endingKey='free';return;}
    if(x>=70&&h>=40){this.endingKey='family';return;}
    if(x>=50&&c<30&&m<0){this.endingKey='escape';return;}
    if(h<30){this.endingKey='regret';return;}
    if(m<-3){this.endingKey='broke';return;}
    this.endingKey='regret';
  }
  // ── 渲染 ──
  _render(){
    const ctx=this.ctx;ctx.clearRect(0,0,this.cv.width,this.cv.height);
    ctx.save();ctx.scale(this.sc,this.sc);
    if(this.state==='title')this._rTitle();
    else if(this.state==='playing')this._rPlay();
    else if(this.state==='result')this._rResult();
    else if(this.state==='ending')this._rEnd();
    else if(this.state==='phaseIntro')this._rPhaseIntro();
    ctx.restore();
  }
  // 温暖背景
  _drawBg(ctx,gradTop,gradBot){
    const g=ctx.createLinearGradient(0,0,0,this.H);
    g.addColorStop(0,gradTop||'#FFF8F0');g.addColorStop(1,gradBot||'#F5E6D3');
    ctx.fillStyle=g;ctx.fillRect(0,0,this.W,this.H);
  }
  // 温暖按钮
  _drawBtn(ctx,x,y,w,h,text,bg,tc){
    ctx.save();
    ctx.shadowColor='rgba(0,0,0,0.1)';ctx.shadowBlur=10;ctx.shadowOffsetY=3;
    ctx.fillStyle=bg;roundRect(ctx,x,y,w,h,h/2);ctx.fill();
    ctx.restore();
    ctx.fillStyle=tc||'#FFFFFF';ctx.font='bold 30px sans-serif';ctx.textAlign='center';ctx.fillText(text,x+w/2,y+h/2+10);
  }
  _valColor(v,lo,hi){return v<lo?C.warmRed:v>hi?C.green:C.gold;}
  // ── 标题页 ──
  _rTitle(){
    const ctx=this.ctx,W=this.W,H=this.H;this.touchAreas=[];
    const safeTop=Math.max(80, (wx.getSystemInfoSync().statusBarHeight||44)+10);
    const contentTop=safeTop;
    const contentBottom=H-20;
    const contentH=contentBottom-contentTop;
    // 温暖渐变背景
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#FFF8F0');bg.addColorStop(0.5,'#FFE8D0');bg.addColorStop(1,'#F5DEB3');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    drawClouds(ctx,W,H);
    drawPetals(ctx,W,H,40);
    // 温暖光晕
    const g=ctx.createRadialGradient(W/2,contentTop+contentH*.30,0,W/2,contentTop+contentH*.30,260);
    g.addColorStop(0,'rgba(232,118,58,0.12)');g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // 标题 — 占内容区20%
    ctx.textAlign='center';
    ctx.fillStyle=C.textDark;ctx.font='bold 72px sans-serif';
    ctx.fillText('半生路',W/2,contentTop+contentH*.18);
    // 副标题
    ctx.font='28px sans-serif';ctx.fillStyle=C.orange;
    ctx.fillText('22岁到50岁 · 人生模拟器',W/2,contentTop+contentH*.26);
    // 人生阶段 emoji
    ctx.font='90px sans-serif';ctx.fillText('🐣→🔥→🏔️→🌅',W/2,contentTop+contentH*.40);
    // 描述
    ctx.font='24px sans-serif';ctx.fillStyle=C.textMid;
    ctx.fillText('你是全村唯一的大学生',W/2,contentTop+contentH*.52);
    ctx.fillText('从22岁到50岁，每个选择都将决定你的命运',W/2,contentTop+contentH*.57);
    // 属性说明
    ctx.font='20px sans-serif';ctx.fillStyle=C.textLight;
    ctx.fillText('💰 财富  ❤️ 精力  🏠 期望  📈 事业  😊 幸福',W/2,contentTop+contentH*.65);
    // 开始按钮 — 内容区75%位置
    const bx=W/2-160,by=contentTop+contentH*.74,bw=320,bh=80;
    this._drawBtn(ctx,bx,by,bw,bh,'开始人生',C.orange,'#FFFFFF');
    this.touchAreas.push({x:bx,y:by,w:bw,h:bh,fn:()=>{this._initSound();this._startGame();}});
    // 音效开关按钮 — 右上角
    const sndX=W-70,sndY=safeTop+8,sndS=44;
    ctx.fillStyle='rgba(255,255,255,0.6)';roundRect(ctx,sndX,sndY,sndS,sndS,10);ctx.fill();
    ctx.strokeStyle='rgba(232,118,58,0.3)';ctx.lineWidth=1.5;roundRect(ctx,sndX,sndY,sndS,sndS,10);ctx.stroke();
    ctx.font='24px sans-serif';ctx.fillStyle=C.textDark;ctx.textAlign='center';
    ctx.fillText(soundManager.sfxMuted?'🔇':'🔊',sndX+sndS/2,sndY+sndS*0.68);
    this.touchAreas.push({x:sndX,y:sndY,w:sndS,h:sndS,fn:()=>{this._initSound();soundManager.toggleBGM();soundManager.toggleSFX();}});
    // 底部
    ctx.font='18px sans-serif';ctx.fillStyle=C.textLight;ctx.fillText('每次选择都将影响你的人生轨迹',W/2,contentTop+contentH*.92);
  }
  // ── 阶段介绍页 ──
  _rPhaseIntro(){
    const ctx=this.ctx,W=this.W,H=this.H;this.touchAreas=[];
    const safeTop=Math.max(80, (wx.getSystemInfoSync().statusBarHeight||44)+10);
    const p=this.phase;
    const contentTop=safeTop;
    const contentBottom=H-20;
    const contentH=contentBottom-contentTop;
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#FFF8F0');bg.addColorStop(1,'#F5E6D3');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    drawClouds(ctx,W,H);
    drawPetals(ctx,W,H,30);
    const g=ctx.createRadialGradient(W/2,contentTop+contentH*.25,0,W/2,contentTop+contentH*.25,300);
    g.addColorStop(0,p.color+'22');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.font='120px sans-serif';ctx.textAlign='center';ctx.fillText(p.emoji,W/2,contentTop+contentH*.22);
    ctx.font='bold 50px sans-serif';ctx.fillStyle=p.color;ctx.fillText(p.name,W/2,contentTop+contentH*.38);
    ctx.font='28px sans-serif';ctx.fillStyle=C.textMid;ctx.fillText(`${p.range[0]}岁 - ${p.range[1]}岁`,W/2,contentTop+contentH*.47);
    ctx.font='24px sans-serif';ctx.fillStyle=C.textLight;ctx.fillText(`月薪 ¥${p.salary.toLocaleString()}`,W/2,contentTop+contentH*.54);
    const bx=W/2-160,by=contentTop+contentH*.66,bw=320,bh=80;
    this._drawBtn(ctx,bx,by,bw,bh,'继续',p.color,'#FFFFFF');
    this.touchAreas.push({x:bx,y:by,w:bw,h:bh,fn:()=>{soundManager.playClick();this.state='playing';this._loadFirstEv();}});
  }
  // ── 游戏页 ──
  _rPlay(){
    const ctx=this.ctx,W=this.W,H=this.H;this.touchAreas=[];
    const ev=this.curEv;if(!ev)return;
    // 温暖渐变背景
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#FFF8F0');bg.addColorStop(1,'#F0E4D4');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    drawPetals(ctx,W,H,20);
    // 顶部状态栏 — 避开刘海
    const safeTop=Math.max(80, (wx.getSystemInfoSync().statusBarHeight||44)+10),barH=180;
    // 计算可用内容区：从状态栏底部到屏幕底部
    const contentTop=barH+safeTop;
    const contentBottom=H-30; // 底部留30px呼吸空间
    const contentH=contentBottom-contentTop;
    ctx.fillStyle='rgba(255,248,240,0.95)';ctx.fillRect(0,0,W,barH+safeTop);
    ctx.strokeStyle=C.border;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,barH+safeTop);ctx.lineTo(W,barH+safeTop);ctx.stroke();
    // 年龄&阶段
    const p=this.phase;
    ctx.font='bold 34px sans-serif';ctx.fillStyle=p.color;ctx.textAlign='left';
    ctx.fillText(`${this.age}岁`,30,42+safeTop);
    ctx.font='22px sans-serif';ctx.fillStyle=C.textLight;ctx.fillText(p.name,30,68+safeTop);
    // 5个属性
    const stats=[
      {icon:'💰',val:`${this.money}万`,color:this.money>=0?C.gold:C.warmRed},
      {icon:'❤️',val:`${this.energy}%`,color:this._valColor(this.energy,25,65)},
      {icon:'🏠',val:`${this.expect}%`,color:C.sky},
      {icon:'📈',val:`${this.career}%`,color:this._valColor(this.career,25,65)},
      {icon:'😊',val:`${this.happiness}%`,color:this._valColor(this.happiness,25,65)},
    ];
    const sw=W/stats.length;
    stats.forEach((s,i)=>{
      ctx.font='24px sans-serif';ctx.fillStyle=C.textLight;ctx.textAlign='center';ctx.fillText(s.icon,sw*i+sw/2,105+safeTop);
      ctx.font='bold 26px sans-serif';ctx.fillStyle=s.color;ctx.fillText(s.val,sw*i+sw/2,135+safeTop);
    });
    // 人生进度条
    const pY=152+safeTop,pH=10,pW=W-60;
    ctx.fillStyle='#E8D5C0';roundRect(ctx,30,pY,pW,pH,5);ctx.fill();
    ctx.fillStyle=p.color;roundRect(ctx,30,pY,pW*((this.age-22)/28),pH,5);ctx.fill();
    // 音效开关按钮 — 右上角
    const sndX2=W-70,sndY2=safeTop+8,sndS2=44;
    ctx.fillStyle='rgba(255,248,240,0.8)';roundRect(ctx,sndX2,sndY2,sndS2,sndS2,10);ctx.fill();
    ctx.strokeStyle='rgba(232,118,58,0.3)';ctx.lineWidth=1.5;roundRect(ctx,sndX2,sndY2,sndS2,sndS2,10);ctx.stroke();
    ctx.font='24px sans-serif';ctx.fillStyle=C.textDark;ctx.textAlign='center';
    ctx.fillText(soundManager.sfxMuted?'🔇':'🔊',sndX2+sndS2/2,sndY2+sndS2*0.68);
    this.touchAreas.unshift({x:sndX2,y:sndY2,w:sndS2,h:sndS2,fn:()=>{soundManager.toggleBGM();soundManager.toggleSFX();}});
    // ── 内容区自适应布局 ──
    const cP=30; // 左右边距
    // 事件标签
    const tagY=contentTop+20;
    ctx.fillStyle=C.cardAlt;roundRect(ctx,cP,tagY,160,40,20);ctx.fill();
    ctx.font='bold 22px sans-serif';ctx.fillStyle=p.color;ctx.textAlign='center';ctx.fillText(ev.tag,cP+80,tagY+27);
    // 事件卡片 — 高度按内容区比例分配
    const cardTop=tagY+55;
    const opts=ev.o;
    const optCount=opts.length;
    // 选项区域需要的空间：每个选项按钮 + 间距
    const optGap=16;
    // 先计算选项按钮可用高度（占内容区下半部分约55%）
    const optAreaH=contentH*0.52;
    const optBtnH=Math.floor((optAreaH-(optCount-1)*optGap)/optCount);
    const optBtnHClamped=Math.max(80,Math.min(optBtnH,160));
    // 事件卡片：填满标签底部到选项区域之间的空间
    const optStartY=contentBottom-optCount*optBtnHClamped-(optCount-1)*optGap;
    const cardH=optStartY-cardTop-20;
    const cardHClamped=Math.max(120,cardH);
    // 如果卡片+选项超出范围，调整选项起始位置
    const actualOptStart=cardTop+cardHClamped+20;
    ctx.save();ctx.shadowColor='rgba(0,0,0,0.06)';ctx.shadowBlur=8;ctx.shadowOffsetY=2;
    ctx.fillStyle=C.card;roundRect(ctx,cP,cardTop,W-cP*2,cardHClamped,16);ctx.fill();ctx.restore();
    ctx.strokeStyle=C.border;ctx.lineWidth=1;roundRect(ctx,cP,cardTop,W-cP*2,cardHClamped,16);ctx.stroke();
    ctx.fillStyle=C.textDark;ctx.font='30px sans-serif';ctx.textAlign='left';
    wrapText(ctx,ev.text,cP+24,cardTop+50,W-cP*2-48,46);
    // 选项按钮 — 自适应高度填满底部
    const bColors=[C.orange,C.gold,C.sky,C.coral];
    opts.forEach((opt,i)=>{
      const by=actualOptStart+i*(optBtnHClamped+optGap),bx=cP,bw=W-cP*2;
      // 选项卡片
      ctx.save();ctx.shadowColor='rgba(0,0,0,0.05)';ctx.shadowBlur=6;ctx.shadowOffsetY=2;
      ctx.fillStyle=C.card;roundRect(ctx,bx,by,bw,optBtnHClamped,14);ctx.fill();ctx.restore();
      ctx.strokeStyle=bColors[i%4];ctx.lineWidth=2.5;roundRect(ctx,bx,by,bw,optBtnHClamped,14);ctx.stroke();
      // 左侧色条
      ctx.fillStyle=bColors[i%4];roundRect(ctx,bx,by,7,optBtnHClamped,3);ctx.fill();
      // 选项文字 — 垂直居中偏上
      const textY=by+optBtnHClamped*0.38;
      ctx.fillStyle=C.textDark;ctx.font='bold 30px sans-serif';ctx.textAlign='left';ctx.fillText(opt.l,bx+24,textY);
      // 效果预览 — 垂直居中偏下
      const fx=[];
      if(opt.m>0)fx.push(`💰+${opt.m}万`);if(opt.m<0)fx.push(`💰${opt.m}万`);
      if(opt.e>0)fx.push(`❤️+${opt.e}`);if(opt.e<0)fx.push(`❤️${opt.e}`);
      if(opt.x>0)fx.push(`🏠+${opt.x}`);if(opt.x<0)fx.push(`🏠${opt.x}`);
      if(opt.c>0)fx.push(`📈+${opt.c}`);if(opt.c<0)fx.push(`📈${opt.c}`);
      if(opt.h>0)fx.push(`😊+${opt.h}`);if(opt.h<0)fx.push(`😊${opt.h}`);
      ctx.font='20px sans-serif';ctx.fillStyle=C.textLight;ctx.fillText(fx.join('  ')||'无变化',bx+24,textY+34);
      const fi=i;this.touchAreas.push({x:bx,y:by,w:bw,h:optBtnHClamped,fn:()=>this._choose(opts[fi])});
    });
  }
  // ── 结果页 ──
  _rResult(){
    const ctx=this.ctx,W=this.W,H=this.H;this.touchAreas=[];this.resTimer++;
    const safeTop=Math.max(80, (wx.getSystemInfoSync().statusBarHeight||44)+10);
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#FFF8F0');bg.addColorStop(1,'#F0E4D4');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    drawPetals(ctx,W,H,15);
    // 内容区域自适应
    const contentTop=safeTop+30;
    const contentBottom=H-30;
    const contentH=contentBottom-contentTop;
    const cx=40,cy=contentTop+20,cw=W-80,ch=Math.min(320,contentH*0.42);
    ctx.save();ctx.shadowColor='rgba(0,0,0,0.08)';ctx.shadowBlur=10;ctx.shadowOffsetY=3;
    ctx.fillStyle=C.card;roundRect(ctx,cx,cy,cw,ch,20);ctx.fill();ctx.restore();
    ctx.strokeStyle=C.orange;ctx.lineWidth=1.5;roundRect(ctx,cx,cy,cw,ch,20);ctx.stroke();
    ctx.textAlign='center';ctx.font='bold 28px sans-serif';ctx.fillStyle=C.textDark;
    wrapText(ctx,this.resText,W/2,cy+55,cw-50,42);
    // 数值变化
    const d=this.resDelta;
    if(d){
      const items=[
        {l:'💰',v:d.m,u:'万',c:d.m>=0?C.green:C.warmRed},
        {l:'❤️',v:d.e,u:'%',c:d.e>=0?C.green:C.warmRed},
        {l:'🏠',v:d.x,u:'%',c:d.x>=0?C.sky:C.coral},
        {l:'📈',v:d.c,u:'%',c:d.c>=0?C.green:C.warmRed},
        {l:'😊',v:d.h,u:'%',c:d.h>=0?C.green:C.warmRed},
      ].filter(i=>i.v!==0);
      if(items.length){
        const sx=W/2-(items.length*130)/2+65;
        items.forEach((it,i)=>{
          const ix=sx+i*130;
          ctx.font='18px sans-serif';ctx.fillStyle=C.textLight;ctx.fillText(it.l,ix,cy+ch-70);
          ctx.font='bold 28px sans-serif';ctx.fillStyle=it.c;
          ctx.fillText(`${it.v>0?'+':''}${it.v}${it.u}`,ix,cy+ch-38);
        });
      }
    }
    // 当前属性 — 放大显示
    const sy=cy+ch+25;
    const attrBarH=90;
    ctx.fillStyle=C.cardAlt;roundRect(ctx,40,sy,W-80,attrBarH,12);ctx.fill();
    const ss=[{i:'💰',v:`${this.money}万`,c:this.money>=0?C.gold:C.warmRed},{i:'❤️',v:`${this.energy}%`,c:this._valColor(this.energy,25,65)},{i:'🏠',v:`${this.expect}%`,c:C.sky},{i:'📈',v:`${this.career}%`,c:this._valColor(this.career,25,65)},{i:'😊',v:`${this.happiness}%`,c:this._valColor(this.happiness,25,65)}];
    const ssw=(W-80)/5;
    ss.forEach((s,i)=>{ctx.font='20px sans-serif';ctx.fillStyle=C.textLight;ctx.textAlign='center';ctx.fillText(s.i,40+ssw*i+ssw/2,sy+30);ctx.font='bold 24px sans-serif';ctx.fillStyle=s.c;ctx.fillText(s.v,40+ssw*i+ssw/2,sy+65);});
    // 继续按钮 — 居中偏下
    const btnAreaTop=sy+attrBarH+20;
    const btnAreaBottom=contentBottom;
    const btnCenterY=(btnAreaTop+btnAreaBottom)/2;
    const bx=W/2-160,by=btnCenterY-40,bw=320,bh=80;
    const alpha=Math.min(1,(this.resTimer-15)/15);ctx.globalAlpha=alpha;
    this._drawBtn(ctx,bx,by,bw,bh,'继续 →',C.orange,'#FFFFFF');ctx.globalAlpha=1;
    if(this.resTimer>15)this.touchAreas.push({x:bx,y:by,w:bw,h:bh,fn:()=>{soundManager.playContinue();this._nextEv();}});
    ctx.font='22px sans-serif';ctx.fillStyle=C.textLight;ctx.textAlign='center';ctx.fillText(`${this.age}岁`,W/2,by+bh+40);
  }
  // ── 结局页 ──
  _rEnd(){
    const ctx=this.ctx,W=this.W,H=this.H;this.touchAreas=[];
    const safeTop=Math.max(80, (wx.getSystemInfoSync().statusBarHeight||44)+10);
    const ed=ENDINGS[this.endingKey];if(!ed)return;
    // 温暖渐变
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#FFF8F0');bg.addColorStop(0.6,'#FFE8D0');bg.addColorStop(1,'#F5DEB3');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    drawClouds(ctx,W,H);
    drawPetals(ctx,W,H,50);
    // 内容区域
    const contentTop=safeTop+20;
    const contentBottom=H-30;
    const contentH=contentBottom-contentTop;
    // 结局光晕
    const g=ctx.createRadialGradient(W/2,contentTop+contentH*0.22,0,W/2,contentTop+contentH*0.22,300);
    g.addColorStop(0,ed.c+'33');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // emoji — 占内容区顶部15%
    const emojiY=contentTop+contentH*0.15;
    ctx.font='120px sans-serif';ctx.textAlign='center';ctx.fillText(ed.e,W/2,emojiY);
    // 标题
    const titleY=contentTop+contentH*0.30;
    ctx.font='bold 52px sans-serif';ctx.fillStyle=ed.c;ctx.fillText(ed.t,W/2,titleY);
    // 分割线
    const lineY=contentTop+contentH*0.35;
    ctx.strokeStyle=ed.c+'44';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(W*.2,lineY);ctx.lineTo(W*.8,lineY);ctx.stroke();
    // 描述文字
    const descY=contentTop+contentH*0.42;
    ctx.font='26px sans-serif';ctx.fillStyle=C.textMid;
    ed.d.split('\n').forEach((l,i)=>ctx.fillText(l,W/2,descY+i*40));
    // 最终数据 — 占内容区中间
    const dataY=contentTop+contentH*0.60;
    const dataH=100;
    ctx.fillStyle=C.cardAlt;roundRect(ctx,40,dataY,W-80,dataH,12);ctx.fill();
    ctx.strokeStyle=C.border;ctx.lineWidth=1;roundRect(ctx,40,dataY,W-80,dataH,12);ctx.stroke();
    const fs=[{i:'💰',v:`${this.money}万`,c:this.money>=0?C.gold:C.warmRed},{i:'❤️',v:`${this.energy}%`,c:C.green},{i:'🏠',v:`${this.expect}%`,c:C.sky},{i:'📈',v:`${this.career}%`,c:C.purple},{i:'😊',v:`${this.happiness}%`,c:C.coral}];
    const fsw=(W-80)/5;
    fs.forEach((s,i)=>{ctx.font='18px sans-serif';ctx.fillStyle=C.textLight;ctx.textAlign='center';ctx.fillText(s.i,40+fsw*i+fsw/2,dataY+35);ctx.font='bold 22px sans-serif';ctx.fillStyle=s.c;ctx.fillText(s.v,40+fsw*i+fsw/2,dataY+68);});
    // 走过多少年
    const yearsY=dataY+dataH+35;
    ctx.font='bold 24px sans-serif';ctx.fillStyle=C.textMid;ctx.fillText(`你走过了 ${this.age-22} 年`,W/2,yearsY);
    // 重新来过按钮 — 底部居中
    const bx=W/2-160,by=contentTop+contentH*0.85,bw=320,bh=76;
    this._drawBtn(ctx,bx,by,bw,bh,'🔄 重新来过',C.orange,'#FFFFFF');
    this.touchAreas.push({x:bx,y:by,w:bw,h:bh,fn:()=>{soundManager.playRestart();soundManager.stopBGM();this.state='title';}});
  }
}

// ── 启动 ──
const canvas=wx.createCanvas();
const si=wx.getSystemInfoSync();
canvas.width=si.windowWidth*(si.pixelRatio||2);
canvas.height=si.windowHeight*(si.pixelRatio||2);
new Game(canvas);
