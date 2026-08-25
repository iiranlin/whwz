import { ref, onMounted } from "vue";
import { dictCateList } from "@/api/system/common";

export const useDict = (dictType, params = {}) => {
  const dictList = ref([]);
  const dictMap = ref({});
  const loadDict = async () => {
    const {data} = await dictCateList({ ...params, code: dictType });
    dictList.value = data.map(item => {
        return {...item, value: item.code, label: item.name}
    })
    dictMap.value = data.reduce((map, item) => {
        map[item.code] = item.name
        return map
    }, {})
  };

  onMounted( () => {
    loadDict()
  })

  const getLabel = (value) => {
    return dictMap.value[value] || '未知'
  }

  return {dictList, dictMap, getLabel, loadDict}
};


export const useDictData = async (dictType, params = {}) => {
  let dictList = [];
  let dictMap = {};
  const {data} = await dictCateList({ ...params, code: dictType });
  dictList = data.map(item => {
      return {...item, value: item.code, label: item.name}
  })
  dictMap = data.reduce((map, item) => {
      map[item.code] = item.name
      return map
  }, {})
  return {dictList, dictMap}
};
