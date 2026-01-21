import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ShiftService, ShiftTemplate, ShiftInstanceCreateDto, ShiftInstance } from '../shift';

type PatternType = 'fixedWeekly' | 'rotational' | 'cyclic';

interface GeneratedRow extends ShiftInstanceCreateDto {
  templateName?: string;
}

@Component({
  selector: 'app-shift-patterns',
  templateUrl: './shift-patterns.html',
  standalone: false,
  styleUrls: ['./shift-patterns.css']
})
export class ShiftPatternsComponent implements OnInit {

  patternType: PatternType = 'fixedWeekly';

  // shared inputs
  fromDate = '';
  toDate = '';
  templates: ShiftTemplate[] = [];
  existingKeys = new Set<string>();

  // output
  preview: GeneratedRow[] = [];
  generating = false;
  message = '';

  // FIXED WEEKLY
  weeklyMap: Record<number, number> = {
    0: 0, // Sun templateId
    1: 0, // Mon
    2: 0, // Tue
    3: 0, // Wed
    4: 0, // Thu
    5: 0, // Fri
    6: 0  // Sat
  };
  weeklyOverride: Record<number, number | null> = {
    0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null
  };

  // ROTATIONAL
  rotation: { templateId: number; override: number | null }[] = [];
  rotationAddTemplateId = 0;
  rotationAddOverride: number | null = null;
  rotationAnchorDate = ''; // cycle starts here

  // CYCLIC (on/off)
  cycleAnchorDate = '';
  onDays = 5;
  offDays = 2;
  cycleTemplateId = 0;
  cycleOverride: number | null = null;

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  async loadTemplates() {
    this.templates = await firstValueFrom(this.shiftService.getShiftTemplates());
    if (this.templates.length > 0) {
      // sensible defaults
      this.rotationAddTemplateId = this.templates[0].id;
      this.cycleTemplateId = this.templates[0].id;
    }
  }

  // ---------- Helpers ----------
  private toISODate(d: Date): string {
    // local date -> YYYY-MM-DD
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private parseISODate(s: string): Date {
    // "YYYY-MM-DD" -> Date (local)
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  private dateRange(from: string, to: string): Date[] {
    const start = this.parseISODate(from);
    const end = this.parseISODate(to);
    const out: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      out.push(new Date(d));
    }
    return out;
  }

  private key(dateISO: string, templateId: number): string {
    return `${dateISO}|${templateId}`;
  }

  templateName(id: number): string {
    return this.templates.find(t => t.id === id)?.name ?? `Template #${id}`;
  }

  // ---------- Load existing instances to prevent duplicates ----------
  async loadExistingKeys(from: string, to: string) {
    const existing: ShiftInstance[] = await firstValueFrom(this.shiftService.getShiftInstances(from, to));
    this.existingKeys = new Set(
      existing.map(x => this.key(this.toISODate(new Date(x.shiftDate)), x.shiftTemplateId))
    );
  }

  // ---------- Preview generation ----------
  async previewGenerate() {
    this.message = '';
    this.preview = [];

    if (!this.fromDate || !this.toDate) {
      this.message = 'Please select From and To dates.';
      return;
    }

    // fetch existing instances so we can skip duplicates
    await this.loadExistingKeys(this.fromDate, this.toDate);

    const days = this.dateRange(this.fromDate, this.toDate);
    const rows: GeneratedRow[] = [];

    if (this.patternType === 'fixedWeekly') {
      for (const d of days) {
        const dow = d.getDay(); // 0 Sun..6 Sat
        const templateId = this.weeklyMap[dow];
        if (!templateId || templateId === 0) continue;

        const dateISO = this.toISODate(d);
        const k = this.key(dateISO, templateId);
        if (this.existingKeys.has(k)) continue;

        rows.push({
          shiftTemplateId: templateId,
          shiftDate: dateISO,
          requiredHeadcountOverride: this.weeklyOverride[dow],
          templateName: this.templateName(templateId)
        });
      }
    }

    if (this.patternType === 'rotational') {
      if (!this.rotationAnchorDate) {
        this.message = 'Please select Rotation Anchor Date.';
        return;
      }
      if (this.rotation.length === 0) {
        this.message = 'Add at least one template to the rotation list.';
        return;
      }

      const anchor = this.parseISODate(this.rotationAnchorDate);
      for (const d of days) {
        const dateISO = this.toISODate(d);
        const diffDays = Math.floor((d.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) continue; // before anchor, skip

        const idx = diffDays % this.rotation.length;
        const entry = this.rotation[idx];

        const k = this.key(dateISO, entry.templateId);
        if (this.existingKeys.has(k)) continue;

        rows.push({
          shiftTemplateId: entry.templateId,
          shiftDate: dateISO,
          requiredHeadcountOverride: entry.override,
          templateName: this.templateName(entry.templateId)
        });
      }
    }

    if (this.patternType === 'cyclic') {
      if (!this.cycleAnchorDate) {
        this.message = 'Please select Cycle Anchor Date.';
        return;
      }
      const cycleLen = Number(this.onDays) + Number(this.offDays);
      if (!cycleLen || cycleLen <= 0) {
        this.message = 'Cycle length must be > 0.';
        return;
      }
      const anchor = this.parseISODate(this.cycleAnchorDate);

      for (const d of days) {
        const dateISO = this.toISODate(d);
        const diffDays = Math.floor((d.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) continue;

        const cycleDay = (diffDays % cycleLen) + 1;
        if (cycleDay > Number(this.onDays)) continue; // off day

        const templateId = this.cycleTemplateId;
        const k = this.key(dateISO, templateId);
        if (this.existingKeys.has(k)) continue;

        rows.push({
          shiftTemplateId: templateId,
          shiftDate: dateISO,
          requiredHeadcountOverride: this.cycleOverride,
          templateName: this.templateName(templateId)
        });
      }
    }

    this.preview = rows;
    this.message = `Preview ready: ${rows.length} new instances (duplicates skipped).`;
  }

  // ---------- Generate (create instances) ----------
  async generateNow() {
    if (this.preview.length === 0) {
      this.message = 'Nothing to generate. Click Preview first.';
      return;
    }

    this.generating = true;
    this.message = 'Generating...';

    let ok = 0;
    let fail = 0;

    // sequential posting keeps it simple and avoids spamming the API
    for (const row of this.preview) {
      try {
        await firstValueFrom(this.shiftService.createShiftInstance({
          shiftTemplateId: row.shiftTemplateId,
          shiftDate: row.shiftDate,
          requiredHeadcountOverride: row.requiredHeadcountOverride ?? null
        }));
        ok++;
      } catch (e) {
        console.error('Create failed for', row, e);
        fail++;
      }
    }

    this.generating = false;
    this.message = `Done. Created: ${ok}, Failed: ${fail}.`;

    // refresh preview after generating to show what's left (should be 0)
    await this.previewGenerate();
  }

  // ---------- UI actions for rotation ----------
  addRotationItem() {
    if (!this.rotationAddTemplateId || this.rotationAddTemplateId === 0) return;
    this.rotation.push({
      templateId: Number(this.rotationAddTemplateId),
      override: this.rotationAddOverride ? Number(this.rotationAddOverride) : null
    });
    this.rotationAddOverride = null;
  }

  removeRotationItem(i: number) {
    this.rotation.splice(i, 1);
  }
}

