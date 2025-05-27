import React from 'react';
import { 
  Settings, 
  FileText, 
  Languages, 
  Zap, 
  RotateCcw,
  Sliders
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  AdvancedTranslateRequest, 
  TranslationEngine, 
  Language,
  UserLimits 
} from '../lib/api';

interface AdvancedOptionsPanelProps {
  options: Partial<AdvancedTranslateRequest>;
  onOptionsChange: (options: Partial<AdvancedTranslateRequest>) => void;
  translationEngines: TranslationEngine[];
  languages: Language[];
  userLimits?: UserLimits;
  onReset: () => void;
  onLoadPreset: (presetId: string) => void;
  availablePresets: Array<{ id: string; name: string; description: string }>;
}

const AdvancedOptionsPanel: React.FC<AdvancedOptionsPanelProps> = ({
  options,
  onOptionsChange,
  translationEngines,
  languages,
  userLimits,
  onReset,
  onLoadPreset,
  availablePresets
}) => {
  const [showTranslationOptions, setShowTranslationOptions] = React.useState(false);
  const [showPdfOptions, setShowPdfOptions] = React.useState(false);

  const updateOption = (key: keyof AdvancedTranslateRequest, value: any) => {
    onOptionsChange({ ...options, [key]: value });
  };

  const hasFeature = (feature: string) => {
    return userLimits?.features?.[feature] ?? false;
  };

  const FeatureTooltip: React.FC<{ feature: string; children: React.ReactNode }> = ({ 
    feature, 
    children 
  }) => {
    const available = hasFeature(feature);
    return (
      <div className={`${!available ? 'opacity-50' : ''}`}>
        {children}
        {!available && (
          <Badge variant="outline" className="ml-2 text-xs">
            Pro Feature
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Preset Configurations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Zap className="h-4 w-4" />
            <span>Quick Presets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {availablePresets.map((preset) => (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                onClick={() => onLoadPreset(preset.id)}
                className="text-xs h-8"
              >
                {preset.name}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="w-full text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>

      {/* Basic Translation Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Languages className="h-4 w-4" />
            <span>Translation Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="source-lang" className="text-xs">Source Language</Label>
              <Select 
                value={options.source_lang || 'auto'} 
                onValueChange={(value) => updateOption('source_lang', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto Detect</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-lang" className="text-xs">Target Language</Label>
              <Select 
                value={options.target_lang || 'simplified-chinese'} 
                onValueChange={(value) => updateOption('target_lang', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 border rounded text-xs">
            <Label>Dual Language Mode</Label>
            <Switch 
              checked={options.dual || false} 
              onCheckedChange={(checked) => updateOption('dual', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Translation Engine</Label>
            <Select 
              value={options.translation_engine || 'auto'} 
              onValueChange={(value) => updateOption('translation_engine', value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {translationEngines.map((engine) => (
                  <SelectItem key={engine.id} value={engine.id} disabled={!engine.available}>
                    <div className="flex items-center space-x-2">
                      <span>{engine.name}</span>
                      {!engine.available && <Badge variant="outline" className="text-xs">Unavailable</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Translation Options */}
      <Card>
        <Collapsible open={showTranslationOptions} onOpenChange={setShowTranslationOptions}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4" />
                  <span>Advanced Translation</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <FeatureTooltip feature="custom_prompts">
                <div className="space-y-2">
                  <Label className="text-xs">Custom Prompt</Label>
                  <Input
                    placeholder="Custom translation instructions..."
                    value={options.custom_prompt || ''}
                    onChange={(e) => updateOption('custom_prompt', e.target.value)}
                    disabled={!hasFeature('custom_prompts')}
                    className="h-8 text-xs"
                  />
                </div>
              </FeatureTooltip>

              <FeatureTooltip feature="custom_prompts">
                <div className="space-y-2">
                  <Label className="text-xs">Custom System Prompt</Label>
                  <Input
                    placeholder="System-level instructions..."
                    value={options.custom_system_prompt || ''}
                    onChange={(e) => updateOption('custom_system_prompt', e.target.value)}
                    disabled={!hasFeature('custom_prompts')}
                    className="h-8 text-xs"
                  />
                </div>
              </FeatureTooltip>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Requests/Second</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={options.requests_per_second || 4}
                    onChange={(e) => updateOption('requests_per_second', parseInt(e.target.value))}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Min Text Length</Label>
                  <Input
                    type="number"
                    min="1"
                    value={options.min_text_length || 1}
                    onChange={(e) => updateOption('min_text_length', parseInt(e.target.value))}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 border rounded text-xs">
                <Label>Ignore Cache</Label>
                <Switch 
                  checked={options.ignore_cache || false} 
                  onCheckedChange={(checked) => updateOption('ignore_cache', checked)}
                />
              </div>

              <FeatureTooltip feature="rpc_doclayout">
                <div className="space-y-2">
                  <Label className="text-xs">RPC Document Layout</Label>
                  <Input
                    placeholder="RPC service URL..."
                    value={options.rpc_doclayout || ''}
                    onChange={(e) => updateOption('rpc_doclayout', e.target.value)}
                    disabled={!hasFeature('rpc_doclayout')}
                    className="h-8 text-xs"
                  />
                </div>
              </FeatureTooltip>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Advanced PDF Options */}
      <Card>
        <Collapsible open={showPdfOptions} onOpenChange={setShowPdfOptions}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Advanced PDF Options</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Sliders className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Page Selection</Label>
                <Input
                  placeholder="e.g., 1-5, 8, 10-end"
                  value={options.pages || ''}
                  onChange={(e) => updateOption('pages', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 border rounded">
                  <Label>No Mono</Label>
                  <Switch 
                    checked={options.no_mono || false} 
                    onCheckedChange={(checked) => updateOption('no_mono', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border rounded">
                  <Label>No Dual</Label>
                  <Switch 
                    checked={options.no_dual || false} 
                    onCheckedChange={(checked) => updateOption('no_dual', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border rounded">
                  <Label>Dual Translate First</Label>
                  <Switch 
                    checked={options.dual_translate_first || false} 
                    onCheckedChange={(checked) => updateOption('dual_translate_first', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border rounded">
                  <Label>Alternating Pages</Label>
                  <Switch 
                    checked={options.use_alternating_pages_dual || false} 
                    onCheckedChange={(checked) => updateOption('use_alternating_pages_dual', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border rounded">
                  <Label>Skip Clean</Label>
                  <Switch 
                    checked={options.skip_clean || false} 
                    onCheckedChange={(checked) => updateOption('skip_clean', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border rounded">
                  <Label>Disable Rich Text</Label>
                  <Switch 
                    checked={options.disable_rich_text_translate || false} 
                    onCheckedChange={(checked) => updateOption('disable_rich_text_translate', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border rounded">
                  <Label>Enhance Compatibility</Label>
                  <Switch 
                    checked={options.enhance_compatibility || false} 
                    onCheckedChange={(checked) => updateOption('enhance_compatibility', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border rounded">
                  <Label>Split Short Lines</Label>
                  <Switch 
                    checked={options.split_short_lines || false} 
                    onCheckedChange={(checked) => updateOption('split_short_lines', checked)}
                  />
                </div>

                <FeatureTooltip feature="table_translation">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <Label>Translate Tables</Label>
                    <Switch 
                      checked={options.translate_table_text || false} 
                      onCheckedChange={(checked) => updateOption('translate_table_text', checked)}
                      disabled={!hasFeature('table_translation')}
                    />
                  </div>
                </FeatureTooltip>

                <div className="flex items-center justify-between p-2 border rounded">
                  <Label>Skip Scan Detection</Label>
                  <Switch 
                    checked={options.skip_scanned_detection || false} 
                    onCheckedChange={(checked) => updateOption('skip_scanned_detection', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border rounded">
                  <Label>OCR Workaround</Label>
                  <Switch 
                    checked={options.ocr_workaround || false} 
                    onCheckedChange={(checked) => updateOption('ocr_workaround', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Short Line Split Factor</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={options.short_line_split_factor || 0.5}
                    onChange={(e) => updateOption('short_line_split_factor', parseFloat(e.target.value))}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Max Pages Per Part</Label>
                  <Input
                    type="number"
                    min="0"
                    value={options.max_pages_per_part || 0}
                    onChange={(e) => updateOption('max_pages_per_part', parseInt(e.target.value))}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Formula Font Pattern</Label>
                <Input
                  placeholder="Font pattern for formulas..."
                  value={options.formular_font_pattern || ''}
                  onChange={(e) => updateOption('formular_font_pattern', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Formula Character Pattern</Label>
                <Input
                  placeholder="Character pattern for formulas..."
                  value={options.formular_char_pattern || ''}
                  onChange={(e) => updateOption('formular_char_pattern', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default AdvancedOptionsPanel; 