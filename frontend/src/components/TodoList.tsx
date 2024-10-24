// src/components/TodoList.tsx
import React from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { useTodos } from '../hooks/useTodos';

export const TodoList: React.FC = () => {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos();

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-3">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-3">
      <h1 className="mb-4">Todo List</h1>
      <TodoForm onAdd={addTodo} />
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </Container>
  );
};