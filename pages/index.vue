<template>
  <section class="container">
    <h1>Todo App</h1>
    <div class="task-holder">
      <label for="taskTitle">タスク名</label>
      <input type="text" name="content" v-model="content" id="taskTitle"/>
      <button @click="taskAdd">タスク追加</button>
    </div>

    <ul class="todo-list" v-cloak>
      <li class="todo-list__item" v-for="(todo, index) in display_todos" :key="index">
        <div class="todo">{{ todo.content }}</div>
        <button class="todo-state" @click="changeState(todo, $event)">{{ todo.state }}</button>
        <div class="created-date">{{ todo.createdDate }}</div>
        <button class="todo-close" @click="taskRemove(todo, index);"></button>
      </li>
    </ul>
    <ul class="list"></ul>
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
  margin-top: 100px;
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
      createdDate: ''
    }
  },
  computed: {
    ...mapState(['todos']),
    display_todos: function(){
      let array = []
      let data = this.todos;
      data.forEach(element =>{
        if(element.content.toLowerCase() == this.content.toLowerCase()){
          array.push(element);
        }
      });
      return this.todos
    },
  },
  methods: {
    taskAdd: function(){
      this.$store.commit('taskAdd', {
        content: this.content,
        state: this.state
      })
      this.saveStorage(this.content)
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
    changeState: function (todo, event) {
      if(todo.state === '作業中'){
        event.target.classList.add('done')
        todo.state = '完了'
      } else if(todo.state === '完了'){
        event.target.classList.remove('done')
        todo.state = '作業中'
      }
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
    this.buttons = document.querySelectorAll('.todo-list__item .todo-close')

    window.onload = () => {
      if(localStorage.getItem('todos')){
        this.taskReload()
      }
    }
  }
}


</script>
