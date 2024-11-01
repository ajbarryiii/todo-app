import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { TodoFormProps } from '../types/todo';

const extractHashtags = (text: string) => {
  // Get the last hashtag in the text
  const hashtagMatch = text.match(/#[^\s#]+/g);
  const category = hashtagMatch ? 
    hashtagMatch[hashtagMatch.length - 1].slice(1) : // Remove the # symbol
    'Default';
  
  // Remove all hashtags from the text for the item name
  const cleanText = text.replace(/#[^\s#]+/g, '').trim();
  
  return { text: cleanText, category };
};

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [inputText, setInputText] = useState('');
  const [previewCategory, setPreviewCategory] = useState('Default');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    
    // Update preview category as user types
    const { category } = extractHashtags(newText);
    setPreviewCategory(category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const { text, category } = extractHashtags(inputText);
    
    // Only submit if we have a non-empty task name
    if (text) {
      onAdd({
        item_name: text,
        task_category: category,
        done: false
      });
      
      setInputText('');
      setPreviewCategory('Default');
    }
  };

  return (
    <div className="mb-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <div className="d-flex">
            <Form.Control
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Add todo (use #category to set category)"
              className="me-2"
            />
            <Button type="submit" variant="primary">Add</Button>
          </div>
        </Form.Group>
      </Form>
      {previewCategory !== 'Default' && (
        <div className="text-muted small">
          Category: <span className="badge bg-secondary">{previewCategory}</span>
        </div>
      )}
    </div>
  );
};