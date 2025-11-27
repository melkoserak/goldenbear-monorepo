"use client";
import React from 'react';
import { IMaskInput } from 'react-imask';
import { Label } from '@goldenbear/ui/components/label';
import { Input } from '@goldenbear/ui/components/input';
import { cn } from '@goldenbear/ui/lib/utils';
import { MagTipoItem, MagTipoResposta, MagTipoVariacao, MagQuestion } from '@/lib/mag-api/types';

interface QuestionnaireProps {
  questions: MagQuestion[];
  answers: Record<string, any>;
  onAnswer: (questionId: number, value: any, optionId?: number) => void;
  depth?: number;
}

export const QuestionnaireRenderer = ({ questions, answers, onAnswer, depth = 0 }: QuestionnaireProps) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className={cn("space-y-6 animate-fade-in", depth > 0 && "mt-4 space-y-4")}>
      {questions.map((question) => {
        const tipoItemId = question.TipoItem?.Id;
        const tipoRespostaId = question.TipoResposta?.Id;
        const variacaoId = question.TipoVariacaoResposta?.Id;
        const currentAnswer = answers[question.Id]?.value;

        // --- 1. AGRUPADOR (CORRIGIDO) ---
        if (tipoItemId === MagTipoItem.AGRUPADOR) {
          return (
            <div key={question.Id} className={cn("space-y-4", depth > 0 && "ml-4 border-l-2 border-muted pl-4")}>
              {/* Título do Agrupador (ex: Declaração Pessoal de Saúde) */}
              {question.Descricao && (
                <h4 className="font-semibold text-primary text-lg border-b pb-2 mb-4">
                  {question.Descricao}
                </h4>
              )}
              
              {/* Caso A: Agrupador com perguntas diretas */}
              {question.Perguntas && (
                <QuestionnaireRenderer 
                  questions={question.Perguntas} 
                  answers={answers} 
                  onAnswer={onAnswer} 
                  depth={depth} 
                />
              )}

              {/* Caso B (JSON 1308): As perguntas estão dentro de Opcoes -> SubItens */}
              {question.Opcoes?.map(option => (
                <div key={option.Id}>
                  {option.SubItens && (
                    <QuestionnaireRenderer 
                      questions={option.SubItens} 
                      answers={answers} 
                      onAnswer={onAnswer} 
                      depth={depth} // Mantemos o mesmo nível visual para não encadear demais
                    />
                  )}
                </div>
              ))}
            </div>
          );
        }

        // --- 2. INFORMATIVO ---
        if (tipoItemId === MagTipoItem.INFORMATIVO) {
          return (
            <div key={question.Id} className="p-4 bg-blue-50/50 border border-blue-100 rounded-md text-sm text-blue-800">
              {question.Descricao}
            </div>
          );
        }

        // --- 3. PERGUNTA (Id 1) ---
        return (
          <div 
            key={question.Id} 
            className={cn(
              "space-y-3 pb-6 last:pb-0",
              depth === 0 && "border-b border-border last:border-0"
            )}
          >
            <Label className={cn("text-base font-medium text-foreground leading-snug", depth > 0 && "text-sm")}>
              {question.Descricao} {question.Obrigatorio && <span className="text-destructive">*</span>}
            </Label>

            {/* --- TIPO: SIM/NÃO (Id 1) --- */}
            {tipoRespostaId === MagTipoResposta.SIM_NAO && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                  {/* Botão SIM */}
                  {(() => {
                    // Encontra a opção SIM no JSON para vincular os subitens corretamente
                    const optionSim = question.Opcoes?.find(o => 
                      ['sim', 's'].includes(o.Descricao.toLowerCase())
                    );
                    const isSelected = answers[question.Id]?.value === 'Sim';

                    return (
                      <label className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-md border cursor-pointer transition-all select-none min-w-[100px] justify-center",
                        isSelected 
                          ? "bg-primary text-primary-foreground border-primary font-semibold shadow-sm" 
                          : "bg-background text-foreground border-input hover:bg-accent"
                      )}>
                        <input 
                          type="radio" 
                          name={`q-${question.Id}`}
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => {
                            // Salva 'Sim' e o ID da opção (se existir)
                            onAnswer(question.Id, 'Sim', optionSim?.Id);
                          }}
                        />
                        Sim
                      </label>
                    );
                  })()}

                  {/* Botão NÃO (Renderizado Manualmente) */}
                  {(() => {
                    const isSelected = answers[question.Id]?.value === 'Nao';
                    return (
                      <label className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-md border cursor-pointer transition-all select-none min-w-[100px] justify-center",
                        isSelected 
                          ? "bg-primary text-primary-foreground border-primary font-semibold shadow-sm" 
                          : "bg-background text-foreground border-input hover:bg-accent"
                      )}>
                        <input 
                          type="radio" 
                          name={`q-${question.Id}`}
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => {
                            // Salva 'Nao' e limpa o optionId
                            onAnswer(question.Id, 'Nao', undefined);
                          }}
                        />
                        Não
                      </label>
                    );
                  })()}
                </div>
                
                {/* Subitens Recursivos (Aparecem APENAS se 'Sim' estiver selecionado) */}
                {answers[question.Id]?.value === 'Sim' && question.Opcoes?.map((option) => {
                   // Só renderiza subitens da opção SIM
                   if (['sim', 's'].includes(option.Descricao.toLowerCase()) && option.SubItens && option.SubItens.length > 0) {
                     return (
                       <div key={`sub-${option.Id}`} className="ml-4 pl-4 border-l-2 border-primary/20 mt-2 animate-in slide-in-from-top-2">
                          <QuestionnaireRenderer 
                            questions={option.SubItens} 
                            answers={answers} 
                            onAnswer={onAnswer} 
                            depth={depth + 1} 
                          />
                       </div>
                     );
                   }
                   return null;
                })}
              </div>
            )}

            {/* TEXTO LIVRE */}
            {tipoRespostaId === MagTipoResposta.TEXTO_LIVRE && (
              <Input 
                value={currentAnswer || ''}
                onChange={(e) => onAnswer(question.Id, e.target.value)}
                placeholder="Digite sua resposta..."
                className="max-w-xl"
              />
            )}

            {/* VALOR (PESO/ALTURA) */}
            {tipoRespostaId === MagTipoResposta.VALOR && (
               <div className="max-w-[200px]">
                 {/* Peso */}
                 {variacaoId === MagTipoVariacao.DIGITACAO_PESO && (
                    <Input 
                      type="number" 
                      placeholder="Ex: 80"
                      value={currentAnswer || ''}
                      onChange={(e) => onAnswer(question.Id, e.target.value.replace(/\D/g, ''))} 
                    />
                 )}
                 {/* Altura */}
                 {variacaoId === MagTipoVariacao.DIGITACAO_ALTURA && (
                    <IMaskInput
                      mask="0,00"
                      value={currentAnswer || ''}
                      unmask={false}
                      onAccept={(value: string) => onAnswer(question.Id, value)}
                      placeholder="Ex: 1,80"
                      className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                 )}
                 {/* Comum */}
                 {(!variacaoId || variacaoId === MagTipoVariacao.DIGITACAO_NUMERO_TEXTO) && (
                    <Input 
                      value={currentAnswer || ''}
                      onChange={(e) => onAnswer(question.Id, e.target.value)}
                    />
                 )}
               </div>
            )}

            {/* DATA */}
            {tipoRespostaId === MagTipoResposta.DATA && (
               <div className="max-w-[200px]">
                 <IMaskInput
                    mask="00/00/0000"
                    value={currentAnswer || ''}
                    onAccept={(value: string) => onAnswer(question.Id, value)}
                    placeholder="DD/MM/AAAA"
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                 />
               </div>
            )}

            {/* DOMÍNIO */}
            {tipoRespostaId === MagTipoResposta.DOMINIO && (
              <div className="space-y-3">
                 <select 
                    className="flex h-12 w-full max-w-xl items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={answers[question.Id]?.optionId || ''}
                    onChange={(e) => {
                       const optId = Number(e.target.value);
                       const opt = question.Opcoes?.find(o => o.Id === optId);
                       if (opt) onAnswer(question.Id, opt.Descricao, optId);
                    }}
                 >
                    <option value="">Selecione uma opção...</option>
                    {question.Opcoes?.map(opt => (
                      <option key={opt.Id} value={opt.Id}>{opt.Descricao}</option>
                    ))}
                 </select>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};