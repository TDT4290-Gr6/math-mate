'use client';

import { Check, User, X } from 'lucide-react';
import { Button } from './button';
import SubjectCheckbox from '../subject-checkbox';
import { Checkbox } from './checkbox';
import { UserRound, Moon} from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import React from 'react';
import { useTheme } from 'next-themes';


interface SidebarMenuProps {
  onClose: () => void;
}

/** 
 * SidebarMenu component for settings and previously solved problems.
 */
export default function SidebarMenu({ onClose }: SidebarMenuProps) {
  
  // Theme handling
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  
  // TODO: Implement logout functionality
  const handleLogout = () => {
    console.log('Logging out...');

  };

  // Dummy math problems
  const dummyProblems = [
    "Quadratic equation roots",
    "Area of a triangle formula",
    "Derivative of a polynomial",
    "Definite integral evaluation",
    "Simplify a rational expression",
    "Slope of a linear function",
    "Factor a quadratic trinomial",
    "Convert degrees to radians",
    "Sum of a geometric series",
    "Probability of dice roll",
    "Quadratic equation roots",
    "Area of a triangle formula",
    "Derivative of a polynomial",
    "Definite integral evaluation",
    
  ];
  return (
    <div className="flex h-full w-70 flex-col fixed right-0 top-0 bg-[var(--sidebar)] shadow-[-2px_0_8px_rgba(0,0,0,0.3)]">
      <div className="p-6">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-1">
          {/* User ID display */}
          <div className="mt-2 text-[var(--foreground)] flex flex-row">
            <p className='font-semibold'>User ID:</p>
            <p className='font-normal ml-2'>TODO</p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 text-[var(--foreground)] hover:bg-[var(--accent-hover)] rounded"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu content */}

        
        
        {/* Border under user ID */}
        <div className="flex flex-col border-b-1"></div>
        
        {/* Settings */}
        <div className="mt-10 text-[var(--foreground)] font-semibold">Settings:</div>
        <div className="flex flex-col border-b-1 mt-1"></div>
        {/* Darkmode toggle */}
        <div className="mt-8 text-[var(--sidebar-primary-foreground)] font-semibold bg-[var(--sidebar-primary)] flex flex-row items-center gap-2 p-2 h-[44px] rounded-[30px]">
          <Moon className="mx-2 h-5 w-5 text-[var(--sidebar-primary-foreground)]"/>
          <h1 className="text-[var(--sidebar-primary-foreground)]">Dark mode</h1>
          {/* TODO: TOGGLE */}
          <Switch className='absolute right-10 h-6 w-10 p-1' 
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
        {/* Logout button */}
        <div className="mt-4 text-[var(--sidebar-primary-foreground)] font-semibold bg-[var(--sidebar-primary)] 
        flex flex-row items-center gap-2 p-2 h-[44px] rounded-[30px]"
        onClick={() => {}}>
          <UserRound className="mx-2 h-5 w-5 text-[var(--sidebar-primary-foreground)]"/>
          <h1 className="text-[var(--sidebar-primary-foreground)]">Log out</h1>
        </div>
        
        {/* Previously solved questions */}
        <div className="mt-10 text-[var(--foreground)] font-semibold">Previously solved questions:</div>
        <div className="flex flex-col border-b-1 mt-1"></div>
      </div>
      <div className="flex-1 overflow-y-auto mt-1 pl-6 pr-2">
          {dummyProblems.map((problem, index) => (
            <div key={index} className=" mt-4 text-[var(--foreground)] font-normal 
            flex flex-row items-center gap-2 p-2 h-[44px] rounded-[8px] hover:bg-[var(--sidebar-accent)] cursor-pointer">
              <p className="text-[var(--foreground)]">{problem}</p>
            </div>
          ))}
        </div>
    </div>
  );
}
