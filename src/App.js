import React, { useState } from 'react';
import axios from 'axios';
import './App.css'
function App() {
  const [formData, setFormData] = useState({
    websiteType: '',
    industry: '',
    color: '#3B82F6',
    font: '',
    sections: [],
    description: ''
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [websiteImage, setWebsiteImage] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionsChange = (e) => {
    const sections = e.target.value.split(',').map(section => section.trim());
    setFormData(prev => ({
      ...prev,
      sections
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/generate-website', formData);
      setGeneratedCode(response.data.code);
      setWebsiteImage(response.data.image);
    } catch (error) {
      console.error('Error generating website:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">InstantSite-AI</h1>
     <center><h6>ai website layout generator</h6></center> 
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <select 
          name="websiteType" 
          value={formData.websiteType} 
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Website Type</option>
          <option value="portfolio">Portfolio</option>
          <option value="business">Business</option>
          <option value="ecommerce">E-commerce</option>
          <option value="blog">Blog</option>
        </select>

        <input 
          type="text"
          name="industry"
          placeholder="Industry (e.g., Technology, Fashion)"
          value={formData.industry}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        
     <h4>select color</h4>
     <input
  type="color"
  name="color"
  value={formData.color}
  onChange={handleInputChange}
  className="w-20 h-20 rounded-full border-none shadow-md"
/>

        <select 
          name="font" 
          value={formData.font} 
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Font</option>
          <option value="roboto">Roboto</option>
          <option value="open-sans">Open Sans</option>
          <option value="montserrat">Montserrat</option>
        </select>

        <input 
          type="text"
          name="sections"
          placeholder="Sections (comma-separated, e.g. Home, About, Services)"
          onChange={handleSectionsChange}
          className="w-full p-2 border rounded"
          required
        />

        <textarea 
          name="description"
          placeholder="Brief description of your website"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded h-24"
          required
        />

       <center> <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Generate Website
        </button></center>
      </form>

      {websiteImage && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Website Preview</h2>
          <img 
            src={websiteImage} 
            alt="Generated Website" 
            className="w-full border rounded shadow-lg"
          />
        </div>
      )}
      {generatedCode && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Generated Website Code</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {generatedCode}
          </pre>
        </div>
      )}

      
    </div>
  );
}

export default App;