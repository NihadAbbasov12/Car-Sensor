const brandMap: Record<string, string> = {
  "\u30c8\u30e8\u30bf": "Toyota",
  "\u65e5\u7523": "Nissan",
  "\u30db\u30f3\u30c0": "Honda",
  "\u30b9\u30ba\u30ad": "Suzuki",
  "\u30de\u30c4\u30c0": "Mazda",
  "\u30b9\u30d0\u30eb": "Subaru",
  "\u30c0\u30a4\u30cf\u30c4": "Daihatsu",
  "\u4e09\u83f1": "Mitsubishi",
  "\u30ec\u30af\u30b5\u30b9": "Lexus",
  "\u30a4\u30b9\u30ba": "Isuzu",
  "\u65e5\u91ce": "Hino",
};

const modelMap: Record<string, string> = {
  "\u30de\u30fc\u30afX": "Mark X",
  "\u30d7\u30ea\u30a6\u30b9": "Prius",
  "\u30a2\u30af\u30a2": "Aqua",
  "\u30eb\u30fc\u30df\u30fc": "Roomy",
  "\u30a8\u30b9\u30c6\u30a3\u30de": "Estima",
  "\u30af\u30e9\u30a6\u30f3\u30ed\u30a4\u30e4\u30eb": "Crown Royal",
  "\u30e9\u30a4\u30ba": "Raize",
  "\u30ab\u30ed\u30fc\u30e9\u30af\u30ed\u30b9": "Corolla Cross",
  "\u30ab\u30ed\u30fc\u30e9\u30c4\u30fc\u30ea\u30f3\u30b0": "Corolla Touring",
  "\u30cf\u30ea\u30a2\u30fc": "Harrier",
  "\u30b7\u30a8\u30f3\u30bf": "Sienta",
  "\u30f4\u30a9\u30af\u30b7\u30fc": "Voxy",
  "\u30cf\u30a4\u30a8\u30fc\u30b9\u30d0\u30f3": "HiAce Van",
  "\u30b9\u30da\u30a4\u30c9": "Spade",
  "C-HR": "C-HR",
  "SAI": "SAI",
  "86": "86",
};

const bodyTypeMap: Record<string, string> = {
  "\u30df\u30cb\u30d0\u30f3": "Minivan",
  "\u30bb\u30c0\u30f3": "Sedan",
  "\u30af\u30fc\u30da": "Coupe",
  "\u30aa\u30fc\u30d7\u30f3": "Convertible",
  "\u30ef\u30b4\u30f3": "Wagon",
  "\u30cf\u30c3\u30c1\u30d0\u30c3\u30af": "Hatchback",
  "\u30b3\u30f3\u30d1\u30af\u30c8": "Compact",
  "\u8efd\u81ea\u52d5\u8eca": "Kei",
  "\u30c8\u30e9\u30c3\u30af": "Truck",
  "\u30d0\u30f3": "Van",
  "\u30b9\u30dd\u30fc\u30c4": "Sports",
  "SUV": "SUV",
};

const colorMap: Record<string, string> = {
  "\u30d6\u30e9\u30c3\u30af": "Black",
  "\u30db\u30ef\u30a4\u30c8": "White",
  "\u30d1\u30fc\u30eb": "Pearl",
  "\u30b7\u30eb\u30d0\u30fc": "Silver",
  "\u30b0\u30ec\u30fc": "Gray",
  "\u30d6\u30eb\u30fc": "Blue",
  "\u30ec\u30c3\u30c9": "Red",
  "\u30d6\u30e9\u30a6\u30f3": "Brown",
  "\u30b0\u30ea\u30fc\u30f3": "Green",
  "\u30a4\u30a8\u30ed\u30fc": "Yellow",
};

const prefectureMap: Record<string, string> = {
  "\u5317\u6d77\u9053": "Hokkaido",
  "\u9752\u68ee\u770c": "Aomori",
  "\u5ca9\u624b\u770c": "Iwate",
  "\u5bae\u57ce\u770c": "Miyagi",
  "\u79cb\u7530\u770c": "Akita",
  "\u5c71\u5f62\u770c": "Yamagata",
  "\u798f\u5cf6\u770c": "Fukushima",
  "\u8328\u57ce\u770c": "Ibaraki",
  "\u6803\u6728\u770c": "Tochigi",
  "\u7fa4\u99ac\u770c": "Gunma",
  "\u57fc\u7389\u770c": "Saitama",
  "\u5343\u8449\u770c": "Chiba",
  "\u6771\u4eac\u90fd": "Tokyo",
  "\u795e\u5948\u5ddd\u770c": "Kanagawa",
  "\u65b0\u6f5f\u770c": "Niigata",
  "\u5bcc\u5c71\u770c": "Toyama",
  "\u77f3\u5ddd\u770c": "Ishikawa",
  "\u798f\u4e95\u770c": "Fukui",
  "\u5c71\u68a8\u770c": "Yamanashi",
  "\u9577\u91ce\u770c": "Nagano",
  "\u5c90\u961c\u770c": "Gifu",
  "\u9759\u5ca1\u770c": "Shizuoka",
  "\u611b\u77e5\u770c": "Aichi",
  "\u4e09\u91cd\u770c": "Mie",
  "\u6ecb\u8cc0\u770c": "Shiga",
  "\u4eac\u90fd\u5e9c": "Kyoto",
  "\u5927\u962a\u5e9c": "Osaka",
  "\u5175\u5eab\u770c": "Hyogo",
  "\u5948\u826f\u770c": "Nara",
  "\u548c\u6b4c\u5c71\u770c": "Wakayama",
  "\u9ce5\u53d6\u770c": "Tottori",
  "\u5cf6\u6839\u770c": "Shimane",
  "\u5ca1\u5c71\u770c": "Okayama",
  "\u5e83\u5cf6\u770c": "Hiroshima",
  "\u5c71\u53e3\u770c": "Yamaguchi",
  "\u5fb3\u5cf6\u770c": "Tokushima",
  "\u9999\u5ddd\u770c": "Kagawa",
  "\u611b\u5a9b\u770c": "Ehime",
  "\u9ad8\u77e5\u770c": "Kochi",
  "\u798f\u5ca1\u770c": "Fukuoka",
  "\u4f50\u8cc0\u770c": "Saga",
  "\u9577\u5d0e\u770c": "Nagasaki",
  "\u718a\u672c\u770c": "Kumamoto",
  "\u5927\u5206\u770c": "Oita",
  "\u5bae\u5d0e\u770c": "Miyazaki",
  "\u9e7f\u5150\u5cf6\u770c": "Kagoshima",
  "\u6c96\u7e04\u770c": "Okinawa",
};

function normalizeFromMap(value: string | null | undefined, map: Record<string, string>) {
  if (!value) {
    return null;
  }

  return map[value] ?? null;
}

export function normalizeBrand(value: string | null | undefined) {
  return normalizeFromMap(value, brandMap) ?? value ?? null;
}

export function normalizeModel(value: string | null | undefined) {
  return normalizeFromMap(value, modelMap) ?? value ?? null;
}

export function normalizeBodyType(value: string | null | undefined) {
  return normalizeFromMap(value, bodyTypeMap) ?? value ?? null;
}

export function normalizeColor(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  for (const [key, mapped] of Object.entries(colorMap)) {
    if (value.includes(key)) {
      return mapped;
    }
  }

  return value;
}

export function normalizeLocation(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const primary = value.split("/")[0]?.trim() ?? value;
  return prefectureMap[primary] ?? primary;
}
