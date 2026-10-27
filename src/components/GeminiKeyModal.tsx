import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGeminiKey } from '@/context/GeminiKeyContext';
import { Sparkles, Key, ExternalLink, ShieldCheck, Eye, EyeOff, Loader2, Trash2 } from 'lucide-react';

export function GeminiKeyModal() {
  const { apiKey, hasKey, isKeyModalOpen, closeKeyModal, saveKey, removeKey, isTesting } = useGeminiKey();
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isKeyModalOpen) {
      setInputKey(apiKey);
    }
  }, [isKeyModalOpen, apiKey]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      await saveKey(inputKey);
    }
  };

  return (
    <Dialog open={isKeyModalOpen} onOpenChange={(open) => !open && closeKeyModal()}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/80 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Configure Google Gemini API
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Add your own Gemini API key to run repository analyses anytime without third-party cloud limits.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-5 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="gemini-key" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                Gemini API Key
              </Label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium"
              >
                Get Free API Key
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <Input
                id="gemini-key"
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="pr-10 h-11 font-mono text-sm bg-background/60 border-border/60 focus-visible:ring-primary/40"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              Your key is saved locally in your browser. It is never stored on our servers.
            </p>
          </div>

          <div className="rounded-lg bg-secondary/40 border border-border/40 p-3 text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground">Supported Models:</p>
            <p>RepoMirror automatically uses <code className="text-primary font-mono">gemini-3.5-flash</code> with fast fallback to <code className="text-primary font-mono">gemini-3.8-flash</code>.</p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {hasKey ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  removeKey();
                  setInputKey('');
                  closeKeyModal();
                }}
                className="gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={closeKeyModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                size="sm"
                disabled={!inputKey.trim() || isTesting}
                className="gap-2"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Save & Connect'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
