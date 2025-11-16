"use client";

import { useState } from "react";
import { Button } from "@goldenbear/ui/components/button";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  title: string;
  description: string;
}

export const ShareButton = ({ title, description }: ShareButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    // Garante que roda apenas no cliente
    if (typeof window === 'undefined') return;

    const url = window.location.href;
    const shareData = {
      title: title,
      text: description,
      url: url,
    };

    // Tenta usar a API nativa de compartilhamento (Mobile / Edge / Safari)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Compartilhamento cancelado ou falhou", err);
      }
    } else {
      // Fallback: Copia para a área de transferência
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        
        // Reseta o estado após 2 segundos
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Falha ao copiar link", err);
      }
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2 transition-all duration-200 min-w-[140px]" 
      onClick={handleShare}
    >
      {isCopied ? (
        <>
          <Check className="w-4 h-4 text-green-500" /> 
          <span>Link Copiado!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" /> 
          <span>Compartilhar</span>
        </>
      )}
    </Button>
  );
};