import { getRandomArrayItem } from './helpers';

const coffees = [
  'Cappuccino',
  'Cortado',
  'Latte',
  'Red Eye',
  'Mocha',
  'Raf',
  'Macchiato',
  'Cold Brew',
  'Espresso Con Panna',
  'Café Cubano',
  'Espresso Romano',
  'Nitro',
  'Turkish',
  'Piccolo Latte',
  'Long Black',
  'Flat White',
  'Cà Phê Sữa Đá',
  'Frappé',
  'Caffè Breve',
  'Bulletproof',
  'Caffé Doppio',
  'Galão',
  'Caffé Lungo',
  'Ristretto',
  'Affogato',
  'Café au Lait',
  'Irish',
  'Vienna',
  'Quad Shots',
  'Brewed',
  'Freddo',
  'Americano',
  'Chicory',
  'Espresso Martini',
  'Mexican'
];

const teas = [
  'Chun Mee',
  'Chun Lu',
  'Bi Luo Chun',
  'Gunpowder',
  'Maofeng',
  'Yellow',
  'Jasmine',
  'Anji Bai Cha',
  'Maojian',
  'Taiping Houkui',
  'Jin Shan',
  'Longjing',
  'Sejak',
  'Ujeon',
  'Jungjak',
  'Daejak',
  'Sencha',
  'Gyokuro',
  'Kabusecha',
  'Tencha',
  'Matcha',
  'Mecha',
  'Shincha',
  'Hojicha',
  'Kukicha',
  'Bancha',
  'Genmaicha',
  'Konacha',
  'Kamairicha',
  'Tamaryokucha',
  'Assam',
  'English Breakfast',
  'Earl Grey',
  'Darjeeling',
  'Rukeri',
  'Pu-Erh',
  'Scottish Afternoon',
  'Irish Breakfast',
  'Milima',
  'Ceylon',
  'Chai',
  'Panyang Congou',
  'Keemun',
  'Lapsang Souchong',
  'Golden Tips',
  'Temi Sikkim',
  'Nimbu',
  'Wakuocha',
  'Silver Needle',
  'White Peony',
  'Shou Mei',
  'Gong Mei',
  'Darjeeling White',
  'Da Hong Pao',
  'Shui Jin Gui',
  'Tie Luo Han',
  'Shui Xian',
  'Bai Jiguan',
  'Tieguanyin',
  'Mi Lan Xiang Dan Con',
  'Ancient Tree Dan Cong',
  'Guan Yin',
  'Dancong',
  'Cassia',
  'Da Yu Lin',
  'Dong Ding',
  'Dong Fang Meiren',
  'Alishan',
  'Pouchong',
  'Ruan Zhi',
  'Jin Xuan',
  'Li Shan',
  'Avocado Leaf',
  'Bamboo',
  'Butterfly Pea Flower',
  'Chaga Mushroom',
  'Chamomile',
  'Lavender',
  'Liquorice',
  'Guayusa',
  'Honeysuckle Flower',
  'Lemon',
  'Mint',
  'Olive Leaves',
  'Hibiscus',
  'Rooibos',
  'Turmeric',
  'Pumpkin Spice',
  'Chrysanthemum',
  'Buckwheat',
  'Honeybush',
  'Bush',
  'Mamaki'
];

export const getUniqueCoffeeName = () => getRandomArrayItem(coffees);
export const getUniqueTeaName = () => getRandomArrayItem(teas);
