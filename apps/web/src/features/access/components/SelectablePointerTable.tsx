import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pointer } from '../../pointer/types';
import { PointerStatusBadge } from '../../pointer/components/PointerStatusBadge';
import { format } from "@/lib/date-fns";
import { Checkbox } from '@/components/ui/checkbox';

interface SelectablePointerTableProps {
  pointers: Pointer[];
  selectedIds: string[];
  onSelect: (pointerId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function SelectablePointerTable({ pointers, selectedIds, onSelect, onSelectAll }: SelectablePointerTableProps) {
  if (pointers.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center bg-muted/20">
        <p className="text-sm text-muted-foreground">No pointers available for this patient.</p>
      </div>
    );
  }

  const allSelected = pointers.length > 0 && selectedIds.length === pointers.length;

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead>System ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pointers.map((pointer) => (
            <TableRow key={pointer.id}>
              <TableCell className="text-center">
                <Checkbox
                  checked={selectedIds.includes(pointer.id)}
                  onCheckedChange={(checked) => onSelect(pointer.id, !!checked)}
                  disabled={pointer.status !== 'ACTIVE'}
                />
              </TableCell>
              <TableCell className="font-medium text-xs font-mono">
                {pointer.systemId}
              </TableCell>
              <TableCell className="capitalize">{pointer.type.toLowerCase().replace('_', ' ')}</TableCell>
              <TableCell className="truncate max-w-[200px]" title={pointer.uri}>
                {new URL(pointer.uri).hostname}
              </TableCell>
              <TableCell>{format(new Date(pointer.createdAt), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <PointerStatusBadge status={pointer.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
