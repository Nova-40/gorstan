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

interface PageHeaderProps {
  title: string;
  showBackLink?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, showBackLink = true }) => (
  <div className="mb-8">
    {showBackLink && (
      <a 
        href="#home" 
        className="text-amber-400 hover:text-amber-300 text-sm inline-flex items-center gap-2 mb-4 transition-colors"
      >
        ← Back to Home
      </a>
    )}
    <h1 className="text-4xl font-bold">{title}</h1>
  </div>
);

export default PageHeader;
