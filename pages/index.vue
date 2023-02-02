<template>
  <section class="container">
    <h1>Todo App</h1>
    <div class="task-holder">
      <label for="taskTitle">タスク名</label>
      <input type="text" ref="autoFocus" v-model="content" id="taskTitle"/>
      <button @click="taskAdd">タスク追加</button>
    </div>

    <ul class="todo-list" v-cloak>
      <li class="todo-list__item" v-for="(todo, index) in display_todos" :key="index">

        <div class="todo" v-show="!todo.isActive">{{ todo.content }}</div>

        <div class="todo-input" v-if="todo.isActive">
          <input type="text" v-model="todo.content">
          <button @click="editDone(index)">保存</button>
        </div>

        <button v-show="!todo.isActive" @click="editItem(index)">編集</button>
        <button :class="classDoneObject(index)" class="todo-state" @click="changeState(todo)">{{ todo.state }}</button>
        <div class="created-date">{{ todo.createdDate }}</div>
        <button class="todo-close" @click="taskRemove(todo, index);"></button>
      </li>
    </ul>
  </section>
</template>

<style lang="scss">
[v-cloak] { display: none; }

.container {
  max-width: 1200px;
  margin: 100px auto;
  text-align: center;
  h1 {
    font-size: 32pt;
  }
}
.task-holder{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
}

.todo-list{
  margin: 100px auto 0;
  padding: 0;
}
.todo-list__item{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 20px;
}
.todo-state{
  background-color: lightblue;
  border-radius: 9999px;
  border: none;
  width: 100px;
  height: 40px;
  &.done{
    color: #fff;
    background-color: red;
  }
}

.todo-close{
  width: 30px;
  height: 30px;
  background-color: #ddd;
  border-radius: 9999px;
  border: none;
  position: relative;
  &::before,
  &::after{
    content: "";
    display: block;
    position: absolute;
    width: 14px;
    height: 1px;
    background-color: #000;
    left: 26%;
  }
  &::before{
    transform: rotate(45deg);
  }
  &::after{
    transform: rotate(-45deg);
  }
}
</style>

<script>
import {mapState} from 'vuex';

export default {
  data: function() {
    return {
      content: '',
      state: '作業中',
      createdDate: '',
      isActive: false,
    }
  },
  computed: {
    ...mapState(['todos']),
    display_todos: function(){
      let array = []
      let data = this.todos;
      data.forEach(element =>{
        array.push(element);
      });
      return this.todos
    },
    classDoneObject: function () {
      return function(index){
        const todosObj = JSON.parse(localStorage.getItem("todos"))
        let isState = todosObj[index].state
        return {
          done: isState === '完了'
        }
      }
    }
  },
  methods: {
    editItem: function(index){
      this.todos[index].isActive = true
    },
    editDone: function(index){
      const todosObj = JSON.parse(localStorage.getItem("todos"));
      todosObj[index].content = this.todos[index].content;
      const todosJson = JSON.stringify(todosObj)
      localStorage.setItem('todos', todosJson)
      this.todos[index].isActive = false
    },
    taskAdd: function(){
      if(this.content.match(/^\s/g)) {
        this.content = ''
        this.$refs.autoFocus.focus()
        return alert('1文字目にはスペースは入れられません')
      }
      this.$store.commit('taskAdd', {
        content: this.content,
        state: this.state
      })
      this.content = ""
      this.saveStorage()
    },
    taskRemove: function(todo, index){
      this.$store.commit('taskRemove', todo)
      this.deleteStorage(index)
    },
    taskReload: function(){
      const data = JSON.parse(localStorage.getItem('todos'))
      for (let i = 0; i < data.length; i++) {
        this.$store.commit('reload', {
          content: data[i].content,
          state: data[i].state,
          createdDate: data[i].createdDate
        })
      }
    },
    changeState: function (todo){
      if(todo.state === '作業中'){
        todo.state = '完了'
      } else if(todo.state === '完了'){
        todo.state = '作業中'
      }
      this.saveStorage()
    },
    saveStorage: function(){
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },
    deleteStorage: function(index){
      localStorage.removeItem('todos', JSON.stringify(this.todos[index]))
      localStorage.setItem('todos', JSON.stringify(Object.assign(this.todos, this.todos)))
    }
  },
  mounted(){
    const isTodos = localStorage.getItem('todos')
    if(isTodos){
      this.taskReload()
    } else{
      this.todos = []
    }
  }
}


</script>
