// src/components/TodoItem.tsx
import React from 'react';
import { Form, Button, Badge } from 'react-bootstrap';

interface Todo {
  id: number;
  item_name: string;
  task_category: string;
  done: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => (
  <div className="d-flex align-items-center justify-content-between mb-2 p-2 border rounded">
    <div className="d-flex align-items-center flex-grow-1">
      <Form.Check
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        label={
          <span className={todo.done ? 'text-muted text-decoration-line-through' : ''}>
            {todo.item_name}
          </span>
        }
        className="me-3"
      />
      {todo.task_category !== 'Default' && (
        <Badge 
          bg="secondary" 
          className="ms-2"
          style={{ fontSize: '0.8em' }}
        >
          {todo.task_category}
        </Badge>
      )}
    </div>
    <Button 
      variant="outline-danger" 
      size="sm"
      onClick={() => onDelete(todo.id)}
    >
      Delete
    </Button>
  </div>
);