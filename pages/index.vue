<template>
  <section class="container">
    <h1>Todo App</h1>
    <div class="task-holder">
      <label for="taskTitle">タスク名</label>
      <input type="text" name="content" v-model="content" id="taskTitle"/>
      <button @click="taskAdd">タスク追加</button>
    </div>

    <ul class="todo-list">
      <li class="todo-list__item" v-for="(todo, index) in display_todos" :key="index">
        <div class="todo">{{ todo.content }}</div>
        <button class="todo-state" @click="changeState(todo, $event)">{{ todo.state }}</button>
        <div class="created-date">{{ todo.createdDate }}</div>
        <button class="todo-close" @click="taskRemove(todo)"></button>
      </li>
    </ul>
  </section>
</template>

<style lang="scss">
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
      state: '作業中'
    }
  },
  computed: {
    ...mapState(['todos']),
    display_todos: function(){
      if(this.find_flag){
        let arr = []
        let data = this.todos;
        data.forEach(element =>{
          if(element.content.toLowerCase() == this.content.toLowerCase()){
            arr.push(element);
          }
        });
        return arr;
      } else {
        return this.todos;
      }
    }
  },
  methods: {
    taskAdd: function(){
      this.$store.commit('taskAdd', {
        content: this.content,
        state: this.state
      })
    },
    taskRemove: function(todo){
      this.$store.commit('taskRemove', todo)
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
  }
}

</script>