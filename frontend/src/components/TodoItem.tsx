// src/components/TodoItem.tsx
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { TodoItemProps } from '../types/todo';

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => (
  <div className="d-flex align-items-center mb-2">
    <Form.Check
      type="checkbox"
      checked={todo.done}
      onChange={() => onToggle(todo.id)}
      label={todo.item_name}
      className="me-3"
    />
    <Button 
      variant="outline-danger" 
      size="sm"
      onClick={() => onDelete(todo.id)}
    >
      Delete
    </Button>
  </div>
);
