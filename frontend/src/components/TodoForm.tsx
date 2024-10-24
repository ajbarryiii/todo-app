// src/components/TodoForm.tsx
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { TodoFormProps } from '../types/todo';

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [itemName, setItemName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    onAdd({
      item_name: itemName,
      task_category: 'Default',
      done: false
    });
    
    setItemName('');
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="d-flex">
        <Form.Control
          type="text"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          placeholder="Add new todo"
          className="me-2"
        />
        <Button type="submit" variant="primary">Add</Button>
      </Form.Group>
    </Form>
  );
};