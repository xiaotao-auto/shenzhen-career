// 全国一二线城市房价数据配置
// 数据来源：综合各地统计局、贝壳研究院等公开数据（2024-2025年）

const CITY_DATA = [
  // ============ 一线城市 ============
  {
    id: 'beijing', name: '北京', tier: '一线', region: '华北', industry: '金融/科技',
    price: 62000, income: 18000, rise: -2.3, gdpValue: 45400, realEstateGDPRatio: 6.8,
    population: 2189, rentYield: 2.1, housingArea: 34, score: 68,
    industries: ['金融', '科技', '文化', '教育'], risk: '中', priceToIncomeRatio: 28.9
  },
  {
    id: 'shanghai', name: '上海', tier: '一线', region: '华东', industry: '金融/半导体',
    price: 58000, income: 17500, rise: -1.8, gdpValue: 47200, realEstateGDPRatio: 7.2,
    population: 2487, rentYield: 2.3, housingArea: 32, score: 72,
    industries: ['金融', '半导体', '生物医药', '航运'], risk: '中', priceToIncomeRatio: 27.7
  },
  {
    id: 'shenzhen', name: '深圳', tier: '一线', region: '华南', industry: '科技/金融',
    price: 55000, income: 16500, rise: -4.5, gdpValue: 34600, realEstateGDPRatio: 8.1,
    population: 1766, rentYield: 2.0, housingArea: 22, score: 65,
    industries: ['科技', '金融', '新能源', '生物医药'], risk: '高', priceToIncomeRatio: 27.8
  },
  {
    id: 'guangzhou', name: '广州', tier: '一线', region: '华南', industry: '汽车/商贸',
    price: 38000, income: 13500, rise: -3.2, gdpValue: 31000, realEstateGDPRatio: 9.3,
    population: 1881, rentYield: 2.8, housingArea: 30, score: 71,
    industries: ['汽车', '商贸', '互联网', '会展'], risk: '中', priceToIncomeRatio: 23.5
  },
  // ============ 新一线城市 ============
  {
    id: 'hangzhou', name: '杭州', tier: '新一线', region: '华东', industry: '数字经济/电商',
    price: 35000, income: 14000, rise: -2.1, gdpValue: 20100, realEstateGDPRatio: 11.2,
    population: 1250, rentYield: 2.4, housingArea: 38, score: 75,
    industries: ['数字经济', '电商', '云计算', '旅游'], risk: '中', priceToIncomeRatio: 20.9
  },
  {
    id: 'nanjing', name: '南京', tier: '新一线', region: '华东', industry: '软件信息/集成电路',
    price: 30000, income: 12500, rise: -4.1, gdpValue: 17400, realEstateGDPRatio: 10.8,
    population: 955, rentYield: 2.6, housingArea: 36, score: 70,
    industries: ['软件信息', '智能电网', '集成电路', '生物医药'], risk: '中', priceToIncomeRatio: 20.0
  },
  {
    id: 'chengdu', name: '成都', tier: '新一线', region: '西南', industry: '电子信息/软件',
    price: 18500, income: 9500, rise: -5.8, gdpValue: 22000, realEstateGDPRatio: 13.5,
    population: 2140, rentYield: 2.9, housingArea: 40, score: 76,
    industries: ['电子信息', '软件', '文创', '游戏'], risk: '中', priceToIncomeRatio: 16.2
  },
  {
    id: 'wuhan', name: '武汉', tier: '新一线', region: '华中', industry: '光电子/汽车',
    price: 17000, income: 9000, rise: -4.2, gdpValue: 18800, realEstateGDPRatio: 12.1,
    population: 1373, rentYield: 3.1, housingArea: 38, score: 73,
    industries: ['光电子', '汽车', '生物医药', '教育'], risk: '中', priceToIncomeRatio: 15.7
  },
  {
    id: 'xian', name: '西安', tier: '新一线', region: '西北', industry: '航空航天/电子',
    price: 17500, income: 8500, rise: -3.5, gdpValue: 12100, realEstateGDPRatio: 11.5,
    population: 1300, rentYield: 2.8, housingArea: 35, score: 72,
    industries: ['航空航天', '电子', '教育', '旅游'], risk: '中', priceToIncomeRatio: 17.2
  },
  {
    id: 'tianjin', name: '天津', tier: '新一线', region: '华北', industry: '港口/化工',
    price: 21000, income: 10500, rise: -3.8, gdpValue: 16300, realEstateGDPRatio: 14.2,
    population: 1386, rentYield: 2.5, housingArea: 32, score: 65,
    industries: ['港口物流', '石油化工', '航空航天', '生物医药'], risk: '高', priceToIncomeRatio: 16.7
  },
  {
    id: 'chongqing', name: '重庆', tier: '新一线', region: '西南', industry: '汽车/电子',
    price: 14000, income: 8800, rise: -4.5, gdpValue: 30100, realEstateGDPRatio: 15.8,
    population: 3212, rentYield: 2.7, housingArea: 42, score: 70,
    industries: ['汽车', '电子', '房地产', '旅游'], risk: '高', priceToIncomeRatio: 13.3
  },
  {
    id: 'suzhou', name: '苏州', tier: '新一线', region: '华东', industry: '电子信息/装备制造',
    price: 28000, income: 13000, rise: -2.8, gdpValue: 24600, realEstateGDPRatio: 9.8,
    population: 1291, rentYield: 2.5, housingArea: 40, score: 78,
    industries: ['电子信息', '装备制造', '生物医药', '纳米材料'], risk: '低', priceToIncomeRatio: 18.0
  },
  // ============ 普通二线城市 ============
  {
    id: 'changsha', name: '长沙', tier: '二线', region: '华中', industry: '工程机械/食品',
    price: 11500, income: 8200, rise: -2.5, gdpValue: 14300, realEstateGDPRatio: 12.5,
    population: 1042, rentYield: 3.5, housingArea: 42, score: 82,
    industries: ['工程机械', '食品', '新材料', '文创'], risk: '低', priceToIncomeRatio: 11.7
  },
  {
    id: 'hefei', name: '合肥', tier: '二线', region: '华东', industry: '新型显示/集成电路',
    price: 16500, income: 8500, rise: -3.5, gdpValue: 12800, realEstateGDPRatio: 10.5,
    population: 963, rentYield: 2.8, housingArea: 38, score: 74,
    industries: ['新型显示', '集成电路', '人工智能', '新能源汽车'], risk: '中', priceToIncomeRatio: 16.2
  },
  {
    id: 'zhengzhou', name: '郑州', tier: '二线', region: '华中', industry: '物流/汽车',
    price: 13000, income: 7800, rise: -5.5, gdpValue: 13600, realEstateGDPRatio: 16.8,
    population: 1282, rentYield: 2.6, housingArea: 40, score: 62,
    industries: ['物流', '汽车', '电子', '食品'], risk: '高', priceToIncomeRatio: 13.9
  },
  {
    id: 'fuzhou', name: '福州', tier: '二线', region: '华东', industry: '轻工/电子',
    price: 23000, income: 8500, rise: -2.8, gdpValue: 12300, realEstateGDPRatio: 11.2,
    population: 842, rentYield: 2.3, housingArea: 36, score: 68,
    industries: ['轻工', '电子', '纺织', '海洋经济'], risk: '中', priceToIncomeRatio: 22.6
  },
  {
    id: 'shenyang', name: '沈阳', tier: '二线', region: '东北', industry: '装备制造/化工',
    price: 10500, income: 7500, rise: -4.5, gdpValue: 7690, realEstateGDPRatio: 13.5,
    population: 914, rentYield: 3.2, housingArea: 34, score: 65,
    industries: ['装备制造', '石油化工', '食品', '旅游'], risk: '高', priceToIncomeRatio: 11.7
  },
  {
    id: 'dalian', name: '大连', tier: '二线', region: '东北', industry: '港口/软件',
    price: 13000, income: 8000, rise: -3.8, gdpValue: 8750, realEstateGDPRatio: 12.0,
    population: 753, rentYield: 2.9, housingArea: 33, score: 67,
    industries: ['港口物流', '软件信息', '石油化工', '海洋经济'], risk: '中', priceToIncomeRatio: 13.6
  },
  {
    id: 'xiamen', name: '厦门', tier: '二线', region: '华东', industry: '旅游/会展/贸易',
    price: 42000, income: 10500, rise: -6.2, gdpValue: 7800, realEstateGDPRatio: 18.5,
    population: 530, rentYield: 1.8, housingArea: 38, score: 58,
    industries: ['旅游', '会展', '贸易', '金融'], risk: '高', priceToIncomeRatio: 33.3
  },
  {
    id: 'kunming', name: '昆明', tier: '二线', region: '西南', industry: '旅游/农业',
    price: 13000, income: 7500, rise: -3.2, gdpValue: 7500, realEstateGDPRatio: 14.5,
    population: 868, rentYield: 3.0, housingArea: 40, score: 70,
    industries: ['旅游', '现代农业', '生物医药', '新材料'], risk: '中', priceToIncomeRatio: 14.4
  },
  {
    id: 'urumqi', name: '乌鲁木齐', tier: '二线', region: '西北', industry: '能源/物流',
    price: 8500, income: 8000, rise: -1.5, gdpValue: 3880, realEstateGDPRatio: 15.2,
    population: 408, rentYield: 4.2, housingArea: 36, score: 72,
    industries: ['能源化工', '商贸物流', '旅游', '农产品加工'], risk: '低', priceToIncomeRatio: 8.9
  },
  {
    id: 'zhongshan', name: '中山', tier: '二线', region: '华南', industry: '家电/灯饰',
    price: 14000, income: 7500, rise: -4.8, gdpValue: 3800, realEstateGDPRatio: 12.8,
    population: 445, rentYield: 2.8, housingArea: 42, score: 71,
    industries: ['家电', '灯饰', '医药', '装备制造'], risk: '中', priceToIncomeRatio: 15.6
  },
  {
    id: 'foshan', name: '佛山', tier: '二线', region: '华南', industry: '家电/陶瓷',
    price: 15000, income: 8000, rise: -5.2, gdpValue: 13000, realEstateGDPRatio: 13.5,
    population: 955, rentYield: 2.6, housingArea: 44, score: 70,
    industries: ['家电', '陶瓷', '有色金属', '装备制造'], risk: '中', priceToIncomeRatio: 15.6
  },
  {
    id: 'wuxi', name: '无锡', tier: '二线', region: '华东', industry: '物联网/集成电路',
    price: 21000, income: 11500, rise: -2.5, gdpValue: 15400, realEstateGDPRatio: 8.5,
    population: 749, rentYield: 2.4, housingArea: 42, score: 78,
    industries: ['物联网', '集成电路', '生物医药', '新材料'], risk: '低', priceToIncomeRatio: 15.2
  },
  {
    id: 'dongguan', name: '东莞', tier: '二线', region: '华南', industry: '电子/家具',
    price: 23000, income: 7800, rise: -5.8, gdpValue: 11400, realEstateGDPRatio: 14.2,
    population: 1047, rentYield: 2.5, housingArea: 38, score: 63,
    industries: ['电子信息', '家具', '纺织服装', '模具'], risk: '高', priceToIncomeRatio: 24.6
  },
  {
    id: 'ningbo', name: '宁波', tier: '二线', region: '华东', industry: '港口/石化',
    price: 27000, income: 11000, rise: -1.8, gdpValue: 16400, realEstateGDPRatio: 10.2,
    population: 969, rentYield: 2.3, housingArea: 40, score: 75,
    industries: ['港口物流', '石油化工', '装备制造', '新材料'], risk: '低', priceToIncomeRatio: 20.5
  },
  {
    id: 'qingdao', name: '青岛', tier: '二线', region: '华东', industry: '家电/海洋',
    price: 20000, income: 9500, rise: -2.8, gdpValue: 15800, realEstateGDPRatio: 11.5,
    population: 1037, rentYield: 2.6, housingArea: 38, score: 73,
    industries: ['家电', '海洋经济', '金融', '旅游'], risk: '中', priceToIncomeRatio: 17.5
  },
  {
    id: 'jinan', name: '济南', tier: '二线', region: '华东', industry: '软件/医药',
    price: 16000, income: 8800, rise: -2.2, gdpValue: 12700, realEstateGDPRatio: 12.8,
    population: 940, rentYield: 2.7, housingArea: 38, score: 72,
    industries: ['软件信息', '生物医药', '装备制造', '文化'], risk: '中', priceToIncomeRatio: 15.2
  },
  {
    id: 'wenzhou', name: '温州', tier: '二线', region: '华东', industry: '鞋业/低压电器',
    price: 21000, income: 8500, rise: -3.5, gdpValue: 8730, realEstateGDPRatio: 13.2,
    population: 967, rentYield: 2.4, housingArea: 40, score: 67,
    industries: ['鞋革', '低压电器', '泵阀', '时尚服装'], risk: '中', priceToIncomeRatio: 20.6
  },
  {
    id: 'harbin', name: '哈尔滨', tier: '二线', region: '东北', industry: '装备制造/农业',
    price: 8500, income: 6500, rise: -5.2, gdpValue: 5490, realEstateGDPRatio: 14.8,
    population: 1001, rentYield: 3.4, housingArea: 32, score: 63,
    industries: ['装备制造', '农产品加工', '旅游', '医药'], risk: '高', priceToIncomeRatio: 10.9
  },
  {
    id: 'shijiazhuang', name: '石家庄', tier: '二线', region: '华北', industry: '医药/化工',
    price: 13000, income: 7500, rise: -3.8, gdpValue: 7530, realEstateGDPRatio: 15.5,
    population: 1123, rentYield: 2.8, housingArea: 36, score: 65,
    industries: ['医药', '化工', '装备制造', '旅游'], risk: '高', priceToIncomeRatio: 14.4
  },
  {
    id: 'nanchang', name: '南昌', tier: '二线', region: '华中', industry: '航空/食品',
    price: 12000, income: 7500, rise: -2.8, gdpValue: 7200, realEstateGDPRatio: 13.8,
    population: 653, rentYield: 2.9, housingArea: 38, score: 71,
    industries: ['航空', '食品', '电子', '医药'], risk: '中', priceToIncomeRatio: 13.3
  },
  {
    id: 'nanning', name: '南宁', tier: '二线', region: '华南', industry: '东盟贸易/农业',
    price: 11000, income: 7200, rise: -3.5, gdpValue: 5460, realEstateGDPRatio: 14.2,
    population: 875, rentYield: 3.1, housingArea: 38, score: 72,
    industries: ['东盟贸易', '现代农业', '电子', '新材料'], risk: '中', priceToIncomeRatio: 12.7
  },
  {
    id: 'guiyang', name: '贵阳', tier: '二线', region: '西南', industry: '大数据/旅游',
    price: 9000, income: 7500, rise: -4.2, gdpValue: 5150, realEstateGDPRatio: 16.5,
    population: 622, rentYield: 3.3, housingArea: 36, score: 68,
    industries: ['大数据', '旅游', '中医药', '农业'], risk: '高', priceToIncomeRatio: 10.0
  },
  {
    id: 'taiyuan', name: '太原', tier: '二线', region: '华北', industry: '煤炭/钢铁',
    price: 11000, income: 8000, rise: -3.5, gdpValue: 5900, realEstateGDPRatio: 17.5,
    population: 544, rentYield: 2.8, housingArea: 34, score: 58,
    industries: ['煤炭', '钢铁', '装备制造', '旅游'], risk: '高', priceToIncomeRatio: 11.5
  },
  {
    id: 'changchun', name: '长春', tier: '二线', region: '东北', industry: '汽车/农产品',
    price: 9500, income: 7000, rise: -4.8, gdpValue: 7000, realEstateGDPRatio: 12.5,
    population: 909, rentYield: 3.0, housingArea: 34, score: 66,
    industries: ['汽车', '农产品加工', '光电', '医药'], risk: '中', priceToIncomeRatio: 11.3
  }
];

// 行业分析数据
const INDUSTRY_ANALYSIS = {
  'beijing': { hot: '金融/互联网', suitable: '科技/教育', growth: 'AI/新能源', salary: 18000 },
  'shanghai': { hot: '金融/半导体', suitable: '生物医药/外贸', growth: 'AI/集成电路', salary: 17500 },
  'shenzhen': { hot: '科技/金融', suitable: '互联网/生物医药', growth: 'AI/机器人', salary: 16500 },
  'guangzhou': { hot: '汽车/商贸', suitable: '跨境电商/医美', growth: '新能源/数字创意', salary: 13500 },
  'hangzhou': { hot: '电商/云计算', suitable: '直播/金融科技', growth: 'AI/元宇宙', salary: 14000 },
  'nanjing': { hot: '软件/集成电路', suitable: '智能电网/航空', growth: '半导体/AI', salary: 12500 },
  'chengdu': { hot: '电子信息/软件', suitable: '游戏/文创', growth: '新能源/半导体', salary: 9500 },
  'wuhan': { hot: '光电子/汽车', suitable: '生物医药/教育', growth: '新能源/光通信', salary: 9000 },
  'xian': { hot: '航空航天/电子', suitable: '教育/旅游', growth: 'AI/新能源', salary: 8500 },
  'suzhou': { hot: '电子信息/装备制造', suitable: '生物医药/纳米材料', growth: '新能源/机器人', salary: 13000 },
  'changsha': { hot: '工程机械/食品', suitable: '新材料/文创', growth: '新能源/半导体', salary: 8200 },
  'hefei': { hot: '新型显示/集成电路', suitable: '人工智能/新能源汽车', growth: '半导体/AI', salary: 8500 },
  'zhengzhou': { hot: '物流/汽车', suitable: '电子/食品', growth: '新能源/高端制造', salary: 7800 },
  'fuzhou': { hot: '轻工/电子', suitable: '纺织/海洋经济', growth: '数字经济/新材料', salary: 8500 },
  'shenyang': { hot: '装备制造/化工', suitable: '食品/旅游', growth: '智能制造/新能源', salary: 7500 },
  'dalian': { hot: '港口/软件', suitable: '石油化工/海洋', growth: '软件/数字经济', salary: 8000 },
  'xiamen': { hot: '旅游/会展', suitable: '贸易/金融', growth: '数字服务/海洋经济', salary: 10500 },
  'kunming': { hot: '旅游/农业', suitable: '生物医药/新材料', growth: '大健康/数字旅游', salary: 7500 },
  'urumqi': { hot: '能源/物流', suitable: '商贸/旅游', growth: '新能源/数字丝路', salary: 8000 },
  'zhongshan': { hot: '家电/灯饰', suitable: '医药/装备制造', growth: '智能制造/新能源', salary: 7500 },
  'foshan': { hot: '家电/陶瓷', suitable: '有色金属/装备制造', growth: '智能制造/新材料', salary: 8000 },
  'wuxi': { hot: '物联网/集成电路', suitable: '生物医药/新材料', growth: 'AI/集成电路', salary: 11500 },
  'dongguan': { hot: '电子/家具', suitable: '纺织服装/模具', growth: '智能制造/新能源', salary: 7800 },
  'ningbo': { hot: '港口/石化', suitable: '装备制造/新材料', growth: '新能源/数字港口', salary: 11000 },
  'qingdao': { hot: '家电/海洋', suitable: '金融/旅游', growth: '海洋经济/数字经济', salary: 9500 },
  'jinan': { hot: '软件/医药', suitable: '装备制造/文化', growth: 'AI/生物医药', salary: 8800 },
  'wenzhou': { hot: '鞋革/低压电器', suitable: '泵阀/时尚服装', growth: '数字经济/智能制造', salary: 8500 },
  'harbin': { hot: '装备制造/农业', suitable: '医药/旅游', growth: '冰雪经济/数字农业', salary: 6500 },
  'shijiazhuang': { hot: '医药/化工', suitable: '装备制造/旅游', growth: '生物医药/新材料', salary: 7500 },
  'nanchang': { hot: '航空/食品', suitable: '电子/医药', growth: '航空经济/数字经济', salary: 7500 },
  'nanning': { hot: '东盟贸易/农业', suitable: '电子/新材料', growth: '数字贸易/大健康', salary: 7200 },
  'guiyang': { hot: '大数据/旅游', suitable: '中医药/农业', growth: '数字经济/大健康', salary: 7500 },
  'taiyuan': { hot: '煤炭/钢铁', suitable: '装备制造/旅游', growth: '新能源/数字转型', salary: 8000 },
  'changchun': { hot: '汽车/农产品', suitable: '光电/医药', growth: '新能源汽车/数字农业', salary: 7000 }
};
