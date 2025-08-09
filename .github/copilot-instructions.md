<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# GitHub Copilot Instructions for Numerologo Multi-Agent System

## Project Overview
This is a Next.js TypeScript application featuring a Multi-Agent System for numerology calculations. The project implements Model Context Protocol (MCP) for agent communication and coordination with advanced drag-and-drop UI capabilities.

## Architecture
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and App Router
- **UI System**: Dual-mode interface (Normal/Draggable) with window-style drag components
- **Multi-Agent System**: 5 specialized AI agents working together
- **MCP Integration**: Real Model Context Protocol server for agent communication
- **Agent Coordination**: Carlos Manager oversees all other agents
- **Error Handling**: ErrorBoundary components for graceful failure recovery
- **Client-Side Safety**: useClientOnly pattern for hydration mismatch prevention
- **Draggable Interface**: Desktop-like experience with window management

## Agent Roles & Implementation Patterns
1. **Carlos Manager** (`src/agents/carlos-manager/index.ts`):
   - Project manager and team coordinator
   - **Key Methods**: `createTask()`, `assignTaskToAgent()`, `completeTask()`
   - **Pattern**: Singleton instance with Map-based agent storage
   - **Responsibility**: Task queue management, priority-based assignment, agent status tracking

2. **Numerology Logic Agent** (`src/agents/numerology-logic/index.ts`):
   - Mathematical algorithm designer and calculation engine
   - **Key Methods**: `generateReport()`, calculation methods for all number types
   - **Pattern**: Master number preservation (11, 22, 33), letter-to-number mapping
   - **Responsibility**: All numerology calculations, detailed interpretations

3. **Coding Agent**: Frontend and backend development
4. **Debugging Agent**: Bug detection and resolution
5. **Testing/QA Agent**: Quality assurance and testing

## Real MCP Agent System
- **Real Carlos Manager** (`src/agents/real-carlos-manager/index.ts`): Production MCP agent
- **Real Numerology Logic** (`src/agents/real-numerology-logic/index.ts`): Production calculations
- **MCP Server** (`src/mcp/server.ts`): Full Model Context Protocol implementation
- **Agent Startup** (`src/start-real-agents.ts`): Production agent system launcher

## Critical Implementation Patterns

### Draggable UI System
```typescript
// Draggable hook pattern (src/hooks/useDraggable.ts)
export function useDraggable(initialPosition: Position = { x: 0, y: 0 }) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const elementStartRef = useRef<Position>(initialPosition)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    elementStartRef.current = position
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y
      
      setPosition({
        x: elementStartRef.current.x + deltaX,
        y: elementStartRef.current.y + deltaY
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [position])

  return { position, isDragging, elementRef, dragHandlers: { onMouseDown: handleMouseDown }, resetPosition }
}

// DraggableContainer component pattern (src/components/DraggableContainer.tsx)
export function DraggableContainer({ children, title, className = '', initialPosition, minimizable = true }) {
  const { position, isDragging, elementRef, dragHandlers, resetPosition } = useDraggable(initialPosition)
  const [isMinimized, setIsMinimized] = React.useState(false)

  return (
    <div
      ref={elementRef}
      className={`fixed z-50 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-200 transition-all duration-200 ${
        isDragging ? 'scale-105 shadow-3xl ring-4 ring-purple-300/50' : ''
      } ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'hidden'
      }}
    >
      {/* Drag Handle with Mac-style window controls */}
      <div
        className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-t-xl flex items-center justify-between select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={dragHandlers.onMouseDown}
        style={{ userSelect: 'none' }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          {title && <span className="ml-3 font-semibold text-sm">{title}</span>}
        </div>
        
        {/* Window controls */}
        <div className="flex items-center space-x-2" style={{ pointerEvents: 'auto' }}>
          {minimizable && (
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized) }}>
              <span className="text-xs">{isMinimized ? '⬆️' : '⬇️'}</span>
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); resetPosition() }}>
            <span className="text-xs">🎯</span>
          </button>
        </div>
      </div>

      {/* Collapsible content */}
      <div className={`transition-all duration-300 ${isMinimized ? 'h-0 opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  )
}

// Dual-mode UI pattern (src/app/page.tsx)
export default function Home() {
  const [isDraggableMode, setIsDraggableMode] = useState(false)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setIsDraggableMode(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            !isDraggableMode ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          📄 Modo Normal
        </button>
        <button
          onClick={() => setIsDraggableMode(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isDraggableMode ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          🖱️ Modo Arrastrable
        </button>
      </div>

      {/* Conditional rendering based on mode */}
      {isDraggableMode ? (
        <DraggableContainer title="🧮 Calculadora Principal" initialPosition={{ x: 100, y: 100 }}>
          <div className="p-6">
            <PinaculoCalculatorComplete isPreviewMode={isPreviewMode} />
          </div>
        </DraggableContainer>
      ) : (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <PinaculoCalculatorComplete isPreviewMode={isPreviewMode} />
        </div>
      )}
    </div>
  )
}
```

### Task-Based Communication
```typescript
// Carlos Manager task creation pattern
const task = await carlosManager.createTask({
  type: 'numerology_calculation',
  priority: 'high',
  input: { name, birthDate },
  assignedAgent: 'numerology-logic'
})

// Agent assignment pattern
await carlosManager.assignTaskToAgent(taskId, 'numerology-logic')
```

### Agent Singleton Pattern
```typescript
// All agents use singleton instances for global access
export const carlosManager = new CarlosManager()
export const numerologyLogicAgent = new NumerologyLogicAgent()
```

### Client-Side Rendering Safety
```typescript
// ALWAYS use useClientOnly for hydration safety
import { useClientOnly } from '@/utils/clientOnly'

function Component() {
  const isClient = useClientOnly()
  
  // Prevent hydration mismatches
  return (
    <div>
      {isClient ? dynamicContent : 'Loading...'}
    </div>
  )
}
```

### Error Boundary Implementation
```typescript
// Wrap all components with ErrorBoundary
<ErrorBoundary fallback={<CustomErrorMessage />}>
  <YourComponent />
</ErrorBoundary>
```

## Code Style Guidelines
- Use TypeScript for all new files
- Follow Next.js App Router patterns (`src/app/` directory)
- Implement proper error handling with ErrorBoundary components
- Use Tailwind CSS with numerology-themed styling (`numerology-card` class)
- Follow ESLint configuration
- Write comprehensive JSDoc comments
- Use async/await for asynchronous operations
- **CRITICAL**: Always use `'use client'` directive for interactive components

## File Organization & Patterns
- `/src/app/` - Next.js App Router pages and layouts
- `/src/agents/` - Multi-agent system components (singleton pattern)
- `/src/components/` - Reusable React components (ErrorBoundary wrapped)
- `/src/hooks/` - Custom React hooks (`useDraggable.ts` for drag functionality)
- `/src/lib/` - Utility libraries and configurations
- `/src/utils/` - Helper functions (clientOnly.ts for hydration safety)
- `/src/mcp/` - Model Context Protocol server and interfaces

## Agent Communication Patterns
- **Task Creation**: Use Carlos Manager's `createTask()` method
- **Agent Assignment**: Priority-based task queue with `assignTaskToAgent()`
- **Status Tracking**: Real-time agent status monitoring via Map storage
- **Error Handling**: Graceful failure handling with fallback calculations
- **Logging**: All agent activities logged for debugging purposes

## Numerology Calculation Standards
### Core Number Types
- **Life Path Number**: Birth date digit reduction with master number preservation
- **Destiny Number**: Full name letter-to-number conversion
- **Soul Urge Number**: Vowels only from name
- **Personality Number**: Consonants only from name
- **Master Numbers**: Preserve 11, 22, 33 (never reduce)

### Letter-to-Number Mapping (Chaldean System)
```typescript
A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9
J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9
S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
```

### Calculation Accuracy Requirements
- **Input Validation**: Always validate names and birth dates
- **Master Number Preservation**: Never reduce 11, 22, 33 to single digits
- **Error Fallback**: Provide local calculation fallback if agent system fails
- **Comprehensive Reports**: Include all number types plus interpretations

## Component Development Patterns

### Required Component Structure
```typescript
'use client' // ALWAYS include for interactive components

import React, { useState, useEffect } from 'react'
import { useClientOnly } from '@/utils/clientOnly'

export function YourComponent() {
  const isClient = useClientOnly()
  
  // State initialization with SSR-safe defaults
  const [data, setData] = useState(ssrSafeDefault)
  
  useEffect(() => {
    if (!isClient) return
    // Client-side only operations
  }, [isClient])
  
  return (
    <div className="numerology-card">
      {isClient ? actualContent : loadingState}
    </div>
  )
}
```

### Draggable Component Integration
```typescript
// Always wrap draggable components properly
'use client'

import { DraggableContainer } from '@/components/DraggableContainer'

export function DraggableNumerologyCard({ title, children, position }) {
  return (
    <DraggableContainer 
      title={title}
      initialPosition={position}
      minimizable={true}
      className="w-[400px]"
    >
      <div className="p-6">
        {children}
      </div>
    </DraggableContainer>
  )
}

// Usage in page components
{isDraggableMode ? (
  <DraggableNumerologyCard 
    title="🧮 Calculadora"
    position={{ x: 100, y: 100 }}
  >
    <PinaculoCalculatorComplete />
  </DraggableNumerologyCard>
) : (
  <div className="max-w-7xl mx-auto px-4">
    <PinaculoCalculatorComplete />
  </div>
)}
```

### Event Handling in Draggable Components
```typescript
// Proper event handling to prevent conflicts
const handleButtonClick = (e: React.MouseEvent) => {
  e.stopPropagation() // Prevent drag when clicking buttons
  // Your button logic here
}

// Proper drag handle implementation
<div
  className="drag-handle cursor-grab"
  onMouseDown={dragHandlers.onMouseDown}
  style={{ userSelect: 'none' }}
>
  {/* Drag handle content */}
</div>
```

### Styling Conventions
- Use `numerology-card` class for main containers
- Gradient backgrounds: `bg-gradient-to-r from-purple-50 to-indigo-50`
- Agent status indicators: `agent-status`, `agent-active`, `agent-working`, `agent-idle`
- Focus states: `focus:ring-2 focus:ring-purple-500`
- Responsive design: `grid lg:grid-cols-3 gap-8`
- **Draggable styling**: `fixed z-50 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl`
- **Drag states**: `scale-105 shadow-3xl ring-4 ring-purple-300/50` when dragging
- **Window chrome**: `bg-gradient-to-r from-purple-600 to-indigo-600` for drag handles

## Development Best Practices
- **Always use TypeScript interfaces** for data structures (see `NumerologyInput`, `NumerologyReport`)
- **Implement proper error boundaries** around all major components
- **Use React hooks appropriately** with `useClientOnly` for hydration safety
- **Follow accessibility guidelines** with proper ARIA labels
- **Optimize for performance** with React.memo where appropriate
- **Write testable code** with clear separation of concerns
- **Draggable UX considerations**: Provide visual feedback, prevent text selection, handle edge cases
- **Event propagation**: Use `e.stopPropagation()` carefully in nested interactive elements
- **State management**: Use refs for DOM manipulation, state for React updates in drag system

## MCP Integration Notes
You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt

### Real MCP Server Implementation
```typescript
// MCP Server class (src/mcp/server.ts)
export class MCPAgentServer {
  private server: Server
  private agents: Map<string, MCPAgent> = new Map()
  private tasks: Map<string, MCPTask> = new Map()
  private taskQueue: MCPTask[] = []

  constructor() {
    this.server = new Server(
      {
        name: 'numerologo-agents',
        version: '1.0.0',
        description: 'Multi-Agent Numerology System with MCP'
      },
      { capabilities: { tools: {} } }
    )
    this.setupToolHandlers()
    this.setupAgentHandlers()
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_task',
            description: 'Create a new task for an agent',
            inputSchema: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                input: { type: 'object' },
                assignedAgent: { type: 'string', optional: true }
              },
              required: ['type', 'priority', 'input']
            }
          },
          {
            name: 'calculate_numerology',
            description: 'Calculate numerology numbers for a person',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                birthDate: { type: 'string' }
              },
              required: ['name', 'birthDate']
            }
          }
        ] as Tool[]
      }
    })
  }

  public registerAgent(agent: MCPAgent) {
    this.agents.set(agent.id, agent)
    console.log(`[MCP Server] Registered agent: ${agent.name}`)
  }

  private async processTaskQueue(): Promise<void> {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    this.taskQueue.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])

    for (const task of this.taskQueue) {
      const availableAgent = this.findAvailableAgent(task.type)
      if (availableAgent) {
        await this.assignTaskToAgent(task.id, availableAgent.id)
        this.taskQueue = this.taskQueue.filter(t => t.id !== task.id)
      }
    }
  }
}

// MCP Agent Interface
export interface MCPAgent {
  id: string
  name: string
  role: string
  capabilities: string[]
  handleRequest(request: any): Promise<any>
}

// MCP Task Interface
export interface MCPTask {
  id: string
  type: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  assignedAgent?: string
  input: any
  output?: any
  createdAt: Date
  completedAt?: Date
}

// Real Agent Implementation Pattern
export class RealCarlosManagerAgent implements MCPAgent {
  id = 'carlos-manager'
  name = 'Carlos Manager'
  role = 'Project Manager & Team Coordinator'
  capabilities = ['task_management', 'agent_coordination', 'priority_assignment']

  async handleRequest(request: any): Promise<any> {
    console.log(`[${this.name}] Processing request:`, request.type)
    
    switch (request.type) {
      case 'task_management':
        return await this.handleTaskManagement(request.input)
      case 'agent_coordination':
        return await this.handleAgentCoordination(request.input)
      default:
        throw new Error(`Unsupported request type: ${request.type}`)
    }
  }
}

// Startup script pattern (src/start-real-agents.ts)
async function startRealAgentSystem() {
  console.log('🚀 Starting Real MCP Multi-Agent System...')
  
  try {
    const mcpServer = new MCPAgentServer()
    
    // Register all real agents
    mcpServer.registerAgent(realCarlosManagerAgent)
    mcpServer.registerAgent(realNumerologyLogicAgent)
    
    // Start the MCP server
    await mcpServer.start()
    
    console.log('🎯 MCP Server is running and ready to handle agent communication!')
    
    // Test the system
    const task = await mcpServer.createTask({
      type: 'numerology_calculation',
      priority: 'high',
      input: { name: 'Test User', birthDate: '1990-01-01' }
    })
    
  } catch (error) {
    console.error('❌ Failed to start MCP Agent System:', error)
    process.exit(1)
  }
}
```

### Agent Communication Protocols
- **Message Types**: 'task', 'response', 'heartbeat', 'error'
- **Status Tracking**: 'sent', 'delivered', 'processed', 'failed'
- **Transport**: WebSocket with JSON-RPC encoding
- **Heartbeat**: Regular status checks between agents
- **Priority System**: High/Medium/Low priority task processing
- **Task Queue**: Automatic assignment to available agents

### Implementation Examples
```typescript
// MCP message structure
interface MCPMessage {
  id: string
  timestamp: Date
  sender: string
  receiver: string
  type: 'task' | 'response' | 'heartbeat' | 'error'
  content: string
  status: 'sent' | 'delivered' | 'processed' | 'failed'
}
```

## Testing Guidelines
- Write unit tests for all utility functions (see `__tests__` directories)
- Test numerology calculations thoroughly with edge cases
- Mock agent communications in tests using singleton pattern
- Validate user input properly with TypeScript interfaces
- Test error scenarios with ErrorBoundary components
- Use Jest with setupFilesAfterEnv configuration

## Security Considerations
- Validate all user inputs with TypeScript interfaces
- Sanitize data before processing in numerology calculations
- Implement proper error messages without exposing system details
- Protect against XSS with proper input escaping
- Use CSP headers for additional protection

## Performance Optimization
- Use React.memo for expensive components (especially agent dashboards)
- Implement proper loading states with skeleton UI
- Optimize bundle size with proper imports
- Use efficient algorithms for numerology calculations
- Cache frequently accessed data with Map storage patterns
- Minimize re-renders with useClientOnly pattern

## Common Patterns to Follow

### Error Handling Pattern
```typescript
try {
  const result = await numerologyLogicAgent.generateReport(input)
} catch (error) {
  console.error('Agent calculation failed:', error)
  // Fallback to local calculation
  const fallbackResult = localCalculation(input)
}
```

### State Management Pattern
```typescript
// Use Map for agent storage (Carlos Manager pattern)
private agents = new Map<string, Agent>()
private taskQueue: Task[] = []

// Priority-based task processing
const priorityOrder = { high: 3, medium: 2, low: 1 }
```

### Component Export Pattern
```typescript
// Always export both class and singleton instance
export class NumerologyLogicAgent { ... }
export const numerologyLogicAgent = new NumerologyLogicAgent()
```

### Draggable Hook Pattern
```typescript
// Custom hook for drag functionality
export function useDraggable(initialPosition: Position = { x: 0, y: 0 }) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const elementStartRef = useRef<Position>(initialPosition)
  const elementRef = useRef<HTMLDivElement>(null)

  // Event handling with proper cleanup
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Drag logic with document event listeners
  }, [position])

  return { position, isDragging, elementRef, dragHandlers: { onMouseDown: handleMouseDown }, resetPosition }
}
```

### Mode Toggle Pattern
```typescript
// Dual-mode UI implementation
const [isDraggableMode, setIsDraggableMode] = useState(false)

// Conditional rendering based on mode
{isDraggableMode ? (
  <DraggableContainer title="Component" initialPosition={{ x: 100, y: 100 }}>
    <ComponentContent />
  </DraggableContainer>
) : (
  <div className="traditional-layout">
    <ComponentContent />
  </div>
)}
```

When suggesting code improvements or new features:
1. **Always consider the multi-agent architecture** and task-based communication
2. **Ensure proper coordination** through Carlos Manager
3. **Implement error boundaries** for graceful failure recovery
4. **Use the established patterns** for consistency
5. **Test thoroughly** with both agent system and fallback calculations
6. **Follow the client-side rendering safety** guidelines
7. **Maintain draggable functionality** when implementing new UI components
8. **Consider dual-mode support** (normal vs draggable) for new features
9. **Implement proper event handling** to prevent drag conflicts
10. **Use MCP protocol standards** for agent communication patterns

## Draggable System Debugging Notes
When implementing or debugging draggable functionality:
- **Event Listener Cleanup**: Always remove event listeners in useEffect cleanup or mouse up handlers
- **Ref vs State**: Use refs for DOM manipulation, state for React updates
- **Event Propagation**: Use `e.stopPropagation()` on buttons inside draggable containers
- **Position Calculation**: Calculate deltas from initial drag position, not current mouse position
- **Visual Feedback**: Provide immediate visual feedback during drag operations
- **Cursor States**: Update cursor appropriately (grab vs grabbing)
- **Boundaries**: Consider viewport boundaries for draggable elements
- **Touch Support**: Consider mobile touch events for full device support
