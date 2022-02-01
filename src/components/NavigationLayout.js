import React from 'react';
import Navigation from './navigation/Navigation';


//makes a main layout where you want to have the navbar available
export default function NavigationLayout({ children }) {
    return (
        <>
            <div>
                <Navigation />
            </div>
            {children}
        </>
       
      );
}
