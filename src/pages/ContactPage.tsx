/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct mailto URL with form data
    const mailtoUrl = `mailto:gorstan@geoffwebsterbooks.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Contact Us" />
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">General Inquiries</h3>
                <p className="text-zinc-300">
                  For questions about Gorstan, gameplay support, or general inquiries:
                </p>
                <a 
                  href="mailto:gorstan@geoffwebsterbooks.com" 
                  className="text-amber-400 hover:text-amber-300 font-mono text-lg"
                >
                  gorstan@geoffwebsterbooks.com
                </a>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Technical Support</h3>
                <p className="text-zinc-300">
                  Experiencing technical issues? Need help with the game? We're here to help.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Press & Media</h3>
                <p className="text-zinc-300">
                  Media inquiries, interview requests, and press materials.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Business & Partnerships</h3>
                <p className="text-zinc-300">
                  Interested in collaborations or business opportunities.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Response Time</h3>
              <p className="text-zinc-300">
                We typically respond to inquiries within 1-2 business days. For urgent technical issues, 
                please include "URGENT" in your subject line.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                >
                  <option value="">Select a subject...</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Gameplay Question">Gameplay Question</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Press Inquiry">Press Inquiry</option>
                  <option value="Business Inquiry">Business Inquiry</option>
                  <option value="General Question">General Question</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide as much detail as possible about your inquiry..."
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-vertical"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                Send Message
              </button>
              
              <p className="text-sm text-zinc-400">
                * Required fields. This form will open your default email client.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
