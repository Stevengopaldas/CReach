import React, { useState } from 'react';
import { Languages, Volume2, Copy, RotateCcw, Mic, Camera, BookOpen, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('es');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedAccent, setSelectedAccent] = useState('neutral');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
  ];

  const accents = [
    { code: 'neutral', name: 'Neutral' },
    { code: 'us', name: 'US English' },
    { code: 'uk', name: 'British English' },
    { code: 'au', name: 'Australian' },
    { code: 'in', name: 'Indian English' }
  ];

  const commonPhrases = [
    { category: 'Greetings', phrases: [
      { english: 'Good morning', spanish: 'Buenos días', context: 'workplace greeting' },
      { english: 'How are you?', spanish: '¿Cómo estás?', context: 'casual inquiry' },
      { english: 'Nice to meet you', spanish: 'Mucho gusto', context: 'first meeting' }
    ]},
    { category: 'Workplace', phrases: [
      { english: 'Could you help me?', spanish: '¿Podrías ayudarme?', context: 'requesting assistance' },
      { english: 'I need accessibility support', spanish: 'Necesito apoyo de accesibilidad', context: 'accommodation request' },
      { english: 'Where is the restroom?', spanish: '¿Dónde está el baño?', context: 'navigation' }
    ]},
    { category: 'Emergency', phrases: [
      { english: 'I need help', spanish: 'Necesito ayuda', context: 'urgent assistance' },
      { english: 'Call security', spanish: 'Llama a seguridad', context: 'emergency' },
      { english: 'Medical emergency', spanish: 'Emergencia médica', context: 'health crisis' }
    ]}
  ];

  const officeVisuals = [
    { image: '🏢', term: 'Office Building', translations: { es: 'Edificio de Oficinas', fr: 'Immeuble de Bureau' }},
    { image: '🚪', term: 'Door', translations: { es: 'Puerta', fr: 'Porte' }},
    { image: '🚿', term: 'Restroom', translations: { es: 'Baño', fr: 'Toilettes' }},
    { image: '🍽️', term: 'Cafeteria', translations: { es: 'Cafetería', fr: 'Cafétéria' }},
    { image: '🛗', term: 'Elevator', translations: { es: 'Ascensor', fr: 'Ascenseur' }},
    { image: '📞', term: 'Phone', translations: { es: 'Teléfono', fr: 'Téléphone' }},
    { image: '💻', term: 'Computer', translations: { es: 'Computadora', fr: 'Ordinateur' }},
    { image: '📋', term: 'Meeting Room', translations: { es: 'Sala de Reuniones', fr: 'Salle de Réunion' }}
  ];

  const getLanguageName = (code: string) => {
    return languages.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return languages.find(lang => lang.code === code)?.flag || '🌐';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Multi-Language Translator</h1>
          <p className="text-muted-foreground">Breaking language barriers in the workplace</p>
        </div>
        <Badge variant="secondary" className="bg-tertiary text-tertiary-foreground">
          <Globe className="w-4 h-4 mr-1" />
          12 languages supported
        </Badge>
      </div>

      <Tabs defaultValue="translator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="translator">Text Translator</TabsTrigger>
          <TabsTrigger value="speech">Speech to Text</TabsTrigger>
          <TabsTrigger value="phrases">Common Phrases</TabsTrigger>
          <TabsTrigger value="visuals">Visual Dictionary</TabsTrigger>
        </TabsList>

        {/* Text Translator */}
        <TabsContent value="translator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Input Section */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-primary" />
                  Translate Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Select value={fromLanguage} onValueChange={setFromLanguage}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const temp = fromLanguage;
                      setFromLanguage(toLanguage);
                      setToLanguage(temp);
                    }}
                    aria-label="Swap languages"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  
                  <Select value={toLanguage} onValueChange={setToLanguage}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  placeholder="Enter text to translate..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px] resize-none"
                  aria-label="Input text for translation"
                />

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Input
                  </Button>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Photo Translate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getLanguageFlag(toLanguage)}
                  <span>Translation ({getLanguageName(toLanguage)})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-primary p-4 rounded-lg text-white min-h-[120px] flex items-center">
                  {inputText ? (
                    <p className="text-lg">{inputText.replace(/\w+/g, 'Traducción automática...')}</p>
                  ) : (
                    <p className="text-white/70">Translation will appear here...</p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Voice accent:</span>
                    <Select value={selectedAccent} onValueChange={setSelectedAccent}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accents.map((accent) => (
                          <SelectItem key={accent.code} value={accent.code}>
                            {accent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={!inputText}>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                    <Button variant="outline" size="sm" disabled={!inputText}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Speech to Text */}
        <TabsContent value="speech" className="space-y-6">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-secondary" />
                Sign Language to Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-warm aspect-video rounded-lg flex items-center justify-center text-white">
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Live Sign Recognition</h3>
                  <p className="text-white/90">Position yourself in front of the camera</p>
                  <Button variant="ghost" className="mt-4 text-white border-white hover:bg-white/20">
                    Start Recognition
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Detected Text</h4>
                  <div className="bg-muted p-3 rounded min-h-[80px] text-sm">
                    <p className="text-muted-foreground italic">Sign language interpretation will appear here...</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Translation</h4>
                  <div className="bg-primary/10 p-3 rounded min-h-[80px] text-sm">
                    <p className="text-muted-foreground italic">Translated text will appear here...</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Common Phrases */}
        <TabsContent value="phrases" className="space-y-6">
          <div className="space-y-6">
            {commonPhrases.map((category) => (
              <Card key={category.category} className="card-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-tertiary" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.phrases.map((phrase, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{phrase.english}</p>
                        <Button variant="ghost" size="sm">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-primary font-medium">{phrase.spanish}</p>
                      <p className="text-xs text-muted-foreground italic">{phrase.context}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Visual Dictionary */}
        <TabsContent value="visuals" className="space-y-6">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-warning" />
                Office Visual Dictionary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {officeVisuals.map((item, index) => (
                  <div key={index} className="text-center p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="text-4xl mb-2">{item.image}</div>
                    <h4 className="font-medium text-sm mb-1">{item.term}</h4>
                    <p className="text-xs text-primary">{item.translations.es}</p>
                    <p className="text-xs text-muted-foreground">{item.translations.fr}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Translator;