'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PawPrint, LogOut, Loader2, Mail, User } from 'lucide-react'

interface DashboardProps {
  user: {
    id: string
    email: string
    created_at: string
  }
}

export function Dashboard({ user }: DashboardProps) {
  const [loggingOut, setLoggingOut] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    window.location.reload()
  }

  // Get initials from email for avatar
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 p-1 mb-4">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <PawPrint className="w-10 h-10 text-amber-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Accverse</span>
          </h1>
          <p className="text-muted-foreground mt-2">Phase 1 - Authentification ✓</p>
        </div>

        {/* User Card */}
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardHeader className="text-center">
            <Avatar className="w-16 h-16 mx-auto mb-4 bg-amber-500/20">
              <AvatarFallback className="text-2xl text-amber-500">
                {getInitials(user.email)}
              </AvatarFallback>
            </Avatar>
            <CardTitle>Bienvenue ! 🎉</CardTitle>
            <CardDescription>
              Vous êtes connecté avec succès
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">ID Utilisateur</p>
                  <p className="font-medium text-xs font-mono">{user.id.slice(0, 8)}...</p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <Button 
              variant="destructive" 
              className="w-full mt-6"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Déconnexion...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Phase Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>✅ Phase 1 : Authentification terminée</p>
          <p className="mt-1">🔜 Phase 2 : Profil utilisateur</p>
        </div>
      </div>
    </div>
  )
}
