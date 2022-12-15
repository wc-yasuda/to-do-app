import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      todos: [
        {
          content: 'サンプル',
          state: '作業中',
          createdDate: '2022年12月12日 16:00'
        }
      ],
    }),
    mutations: {
      taskAdd: function (state, obj) {
        if(!obj.content) {
          return alert('タスク名を選択してください！！')
        }
        
        let d = new Date();
        const YEAR = d.getFullYear();
        const MONTH = ("00" + (d.getMonth() + 1)).slice(-2)
        const DAY = ("00" + d.getDate()).slice(-2)
        const HOUR = ("00" + d.getHours()).slice(-2)
        const MINUTES = ("00" + d.getMinutes()).slice(-2)
        const DATE_FORMAT = `${YEAR}年${MONTH}月${DAY}日 ${HOUR}:${MINUTES}`

        state.todos.unshift({
          content: obj.content,
          state: obj.state,
          createdDate: DATE_FORMAT,
        });
      },
      taskRemove: function (state, obj) {
        for (let i = 0; i < state.todos.length; i++) {
          const ob = state.todos[i];
          if (ob.content == obj.content && ob.createdDate == obj.createdDate) {
            state.todos.splice(i, 1);
            return;
          }
        }
      },
    },
  });
};

export default createStore;
