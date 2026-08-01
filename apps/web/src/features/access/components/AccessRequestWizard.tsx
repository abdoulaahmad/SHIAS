'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsentPurpose } from '../../consent/types';
import { PatientSearchCombobox } from '../../pointer/components/PatientSearchCombobox';
import { useProviderPointers } from '../../pointer/hooks';
import { SelectablePointerTable } from './SelectablePointerTable';
import { AccessRequestSummary } from './AccessRequestSummary';
import { PurposeConfig } from '../utils/purposeConfig';
import { useRequestAccess } from '../hooks';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';

export function AccessRequestWizard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = React.useState(1);
  const [patientId, setPatientId] = React.useState<string>('');
  const [selectedPointerIds, setSelectedPointerIds] = React.useState<string[]>([]);
  const [purpose, setPurpose] = React.useState<ConsentPurpose | ''>('');
  
  const { data: pointers = [], isLoading: isLoadingPointers } = useProviderPointers(user?.providerId || '');
  const { mutateAsync: requestAccess, isPending } = useRequestAccess();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!patientId || selectedPointerIds.length === 0 || !purpose || !user?.providerId) return;

    try {
      await requestAccess({
        patientId,
        providerId: user.providerId,
        purpose: purpose as ConsentPurpose,
        pointerIds: selectedPointerIds
      });
      router.push('/provider/access');
    } catch (error) {
      console.error('Failed to request access:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Request Access</h2>
        <div className="text-sm text-muted-foreground">Step {step} of 4</div>
      </div>

      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && 'Select Patient'}
            {step === 2 && 'Select Records'}
            {step === 3 && 'Specify Purpose'}
            {step === 4 && 'Review & Submit'}
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">Search and select the patient you need to access records for.</p>
              <PatientSearchCombobox 
                value={patientId}
                onChange={setPatientId}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Select the specific clinical records you need access to.</p>
              {isLoadingPointers ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : (
                <SelectablePointerTable 
                  pointers={pointers.filter(p => p.patientId === patientId)}
                  selectedIds={selectedPointerIds}
                  onSelect={(id, selected) => {
                    if (selected) setSelectedPointerIds(prev => [...prev, id]);
                    else setSelectedPointerIds(prev => prev.filter(p => p !== id));
                  }}
                  onSelectAll={(selected) => {
                    if (selected) {
                      const activePointers = pointers.filter(p => p.patientId === patientId && p.status === 'ACTIVE').map(p => p.id);
                      setSelectedPointerIds(activePointers);
                    } else {
                      setSelectedPointerIds([]);
                    }
                  }}
                />
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Why do you need access to these records?</p>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(PurposeConfig) as ConsentPurpose[]).map((p) => {
                  const config = PurposeConfig[p];
                  return (
                    <div 
                      key={p}
                      onClick={() => setPurpose(p)}
                      className={`cursor-pointer rounded-lg border p-4 hover:border-primary transition-colors ${purpose === p ? 'border-primary bg-primary/5' : ''}`}
                    >
                      <h4 className="font-semibold mb-1">{config.label}</h4>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Review your request before submitting it to the patient for approval.</p>
              <AccessRequestSummary 
                patientId={patientId}
                pointers={pointers.filter(p => selectedPointerIds.includes(p.id))}
                purpose={purpose as ConsentPurpose}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" onClick={handleBack} disabled={step === 1 || isPending}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          {step < 4 ? (
            <Button onClick={handleNext} disabled={(step === 1 && !patientId) || (step === 2 && selectedPointerIds.length === 0) || (step === 3 && !purpose)}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
