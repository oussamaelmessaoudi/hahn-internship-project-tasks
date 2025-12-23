import Link from "next/link"
import { FileCode, Database, Server, Layers, ExternalLink } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6">
              <Layers className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-balance">Task Management System</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Microservices Architecture with Spring Boot, React & Docker
            </p>
          </div>

          {/* Alert Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Server className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-500 mb-2">Standalone Microservices Project</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This is a full-stack microservices application that runs independently with Docker Compose. It
                  includes Spring Boot backend services and a React frontend, not a Next.js application.
                </p>
              </div>
            </div>
          </div>

          {/* Architecture Overview */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Server className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Backend Services</h3>
                  <p className="text-sm text-muted-foreground">Spring Boot + Java 17</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Authentication Service (Port 8081)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Project Service (Port 8082)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Task Service (Port 8083)
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <FileCode className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Frontend</h3>
                  <p className="text-sm text-muted-foreground">React 18 + TypeScript</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  Authentication Pages
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  Project Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  Task Management UI
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Database</h3>
                  <p className="text-sm text-muted-foreground">PostgreSQL 15</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Users & Authentication
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Projects & Tasks
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Progress Tracking
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Infrastructure</h3>
                  <p className="text-sm text-muted-foreground">Docker Compose</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Containerized Services
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Service Orchestration
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Network Configuration
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="border rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Download the project</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the three dots menu above and select "Download ZIP" to get all project files
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Start with Docker Compose</h3>
                  <code className="block mt-2 p-3 bg-muted rounded text-sm font-mono">docker-compose up --build</code>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Access the application</h3>
                  <div className="mt-2 space-y-2">
                    <a
                      href="http://localhost:3000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-purple-500 hover:text-purple-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Frontend: http://localhost:3000
                    </a>
                    <p className="text-sm text-muted-foreground">Backend services run on ports 8081, 8082, and 8083</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="border rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                JWT-based authentication
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Full CRUD operations
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Real-time progress tracking
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Search & filter functionality
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Responsive UI design
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Docker containerization
              </div>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="flex justify-center">
            <Link
              href="/README.md"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <FileCode className="w-5 h-5" />
              View Full Documentation
            </Link>
          </div>

          {/* Tech Stack Footer */}
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>Built with Spring Boot 3.2 • React 18 • PostgreSQL 15 • Docker • JWT</p>
          </div>
        </div>
      </div>
    </div>
  )
}
