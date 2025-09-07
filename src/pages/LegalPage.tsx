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

import React from 'react';
import { PageHeader } from '../components/shared/PageHeader';

export const LegalPage: React.FC = () => (
  <div className="min-h-screen bg-zinc-900 text-white py-16 px-4">
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Legal Information" />
      
      <div className="prose prose-zinc prose-invert max-w-none space-y-8">
        
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Terms of Service</h2>
          <div className="bg-zinc-800 p-6 rounded-lg">
            <h3>Acceptance of Terms</h3>
            <p>
              By accessing and using Gorstan, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
            
            <h3>Access Tiers and Usage Rights</h3>
            <p>
              Gorstan offers multiple access tiers with different usage rights:
            </p>
            <ul>
              <li><strong>Demo Access (Free):</strong> Limited access to demonstration content including select rooms and features. 
              Demo access is provided free of charge for evaluation purposes and may be used indefinitely.</li>
              <li><strong>Beta Access (Paid):</strong> Time-limited full access granted through purchased beta codes. 
              Beta access provides full game functionality until the specified expiry date.</li>
              <li><strong>Supporter Access (Subscription):</strong> Ongoing full access through Patreon subscription. 
              Access continues while subscription remains active and in good standing.</li>
            </ul>
            
            <h3>License Grant</h3>
            <p>
              Subject to your compliance with these terms and applicable payment (where required), 
              Geoff Webster grants you a limited, non-exclusive, non-transferable license to access and use 
              Gorstan according to your access tier. This license includes:
            </p>
            <ul>
              <li>Personal, non-commercial use of the game content</li>
              <li>Access to features corresponding to your current access tier</li>
              <li>Local storage of game progress and settings</li>
            </ul>
            
            <h3>Restrictions</h3>
            <p>
              Under this license you may not:
            </p>
            <ul>
              <li>Modify, copy, or distribute the game materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to reverse engineer any software contained in Gorstan</li>
              <li>Remove any copyright or other proprietary notations</li>
              <li>Share access credentials or attempt to circumvent access controls</li>
              <li>Access content beyond your authorized tier</li>
            </ul>
            
            <h3>Payment and Refunds</h3>
            <p>
              Beta codes and subscription fees are processed through third-party payment providers. 
              Refund policies are governed by the terms of those providers and applicable consumer protection laws.
              Demo access remains free and does not require payment.
            </p>
            
            <h3>Disclaimer</h3>
            <p>
              The materials in Gorstan are provided on an 'as is' basis. Geoff Webster makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including without 
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
              or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Privacy Policy</h2>
          <div className="bg-zinc-800 p-6 rounded-lg">
            <h3>Information We Collect</h3>
            <p>
              Gorstan respects your privacy and minimizes data collection. We collect:
            </p>
            <ul>
              <li><strong>Game Progress:</strong> Stored locally in your browser for save functionality</li>
              <li><strong>Access Credentials:</strong> Beta codes and subscription status to verify access rights</li>
              <li><strong>Anonymous Analytics:</strong> Basic usage statistics to improve game experience</li>
              <li><strong>Contact Information:</strong> Only when you voluntarily provide it through contact forms</li>
            </ul>
            
            <h3>Local Storage</h3>
            <p>
              Game saves, preferences, and progress are stored locally in your browser's storage. 
              This information remains on your device and is not transmitted to our servers unless 
              you explicitly choose to share it through support requests.
            </p>
            
            <h3>Access Verification</h3>
            <p>
              For paid tiers (Beta and Patreon access), we verify your access credentials with 
              third-party providers to ensure authorized access. This verification is limited to 
              confirming your access status and does not involve sharing personal information.
            </p>
            
            <h3>Analytics and Usage Data</h3>
            <p>
              We collect anonymous, aggregated usage statistics to understand how players interact 
              with the game and identify areas for improvement. This data does not identify individual 
              users and is used solely for development purposes.
            </p>
            
            <h3>Contact Information</h3>
            <p>
              When you contact us via email, we use your information solely to respond to your inquiry 
              and provide support. We do not share this information with third parties or use it for 
              marketing purposes.
            </p>
            
            <h3>Data Retention</h3>
            <p>
              Demo access requires no personal data retention. For paid access, we retain only the 
              minimum information necessary to verify your access rights for the duration of your 
              access period.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Copyright Notice</h2>
          <div className="bg-zinc-800 p-6 rounded-lg">
            <p>
              <strong>Gorstan Interactive Game Framework</strong><br />
              Copyright © 2025 Geoff Webster. All Rights Reserved.
            </p>
            
            <p>
              This source code is proprietary and confidential. Unauthorised copying, distribution, 
              modification, resale, reverse engineering, or use of this software, via any medium, 
              is strictly prohibited without prior written consent from the copyright holder.
            </p>
            
            <p>
              <strong>Access Rights:</strong> Demo access is provided free of charge for evaluation purposes. 
              Full access is granted only to users who have purchased beta codes or maintain active 
              subscription access through authorized channels. All access is subject to these terms 
              and is strictly limited to personal use of the Gorstan game experience.
            </p>
            
            <p>
              No part of this software may be used to create derivative works, other games, or 
              redistributed in any form. Access credentials are non-transferable and for individual use only.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Third-Party Licenses</h2>
          <div className="bg-zinc-800 p-6 rounded-lg">
            <p>
              Gorstan incorporates various third-party libraries and assets, each subject to their 
              respective licenses:
            </p>
            
            <h3>Software Libraries</h3>
            <ul>
              <li><strong>React:</strong> MIT License</li>
              <li><strong>TypeScript:</strong> Apache License 2.0</li>
              <li><strong>Vite:</strong> MIT License</li>
              <li><strong>Tailwind CSS:</strong> MIT License</li>
            </ul>
            
            <h3>Audio Assets</h3>
            <p>
              Sound effects and music are either original compositions or used under appropriate 
              Creative Commons or commercial licenses. Attribution information is available upon request.
            </p>
            
            <h3>Fonts</h3>
            <p>
              Typography uses system fonts and open-source typefaces under their respective licenses.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Accessibility Commitment</h2>
          <div className="bg-zinc-800 p-6 rounded-lg">
            <p>
              We are committed to ensuring that Gorstan is accessible to users with disabilities. 
              The game includes features such as:
            </p>
            <ul>
              <li>Screen reader compatibility</li>
              <li>Keyboard navigation support</li>
              <li>Adjustable visual settings</li>
              <li>Alternative input methods</li>
            </ul>
            <p>
              If you encounter accessibility barriers, please contact us at 
              <a href="mailto:gorstan@geoffwebsterbooks.com" className="text-amber-400 hover:text-amber-300">
                gorstan@geoffwebsterbooks.com
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Contact for Legal Matters</h2>
          <div className="bg-zinc-800 p-6 rounded-lg">
            <p>
              For legal inquiries, copyright questions, or licensing requests, please contact:
            </p>
            <p>
              <strong>Email:</strong> 
              <a href="mailto:gorstan@geoffwebsterbooks.com" className="text-amber-400 hover:text-amber-300 ml-2">
                gorstan@geoffwebsterbooks.com
              </a>
            </p>
            <p className="text-sm text-zinc-400 mt-4">
              Last updated: January 2025
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default LegalPage;
