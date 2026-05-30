import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import Animated, { FadeInDown, FadeIn, withRepeat, withTiming, useAnimatedStyle, useSharedValue, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AmbientBlobs from '@/components/AmbientBlobs';
import { useProductStore } from '@/stores/useProductStore';
import { useProductSearch } from '@/hooks/useProductSearch';
import { useUserStore } from '@/stores/useUserStore';
import {
  Product,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  SUITABILITY_CONFIG,
  ProductCategory,
} from '@/lib/productTypes';
import type { SkinType } from '@/lib/routineData';
import { logEvent, EVENTS } from '@/lib/analytics';

type Step = 'search' | 'analyzing' | 'results';

export default function ProductCheckTab() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const hindi = i18n.language === 'hi';

  const products = useProductStore((s) => s.products);
  const user = useUserStore((s) => s.user);
  const userSkinType = (user?.skinType as SkinType) || 'all';

  const { query, setQuery, results, grouped, popular } = useProductSearch(products);

  const [step, setStep] = useState<Step>('search');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    logEvent(EVENTS.TAB_VIEWED, { tab_name: 'product_check' });
  }, []);

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setStep('analyzing');
    setTimeout(() => setStep('results'), 2200);
  }, []);

  const handleReset = useCallback(() => {
    setStep('search');
    setSelectedProduct(null);
    setQuery('');
  }, [setQuery]);

  const skinTypeLabel = hindi
    ? { oily: 'तैलीय', dry: 'रूखी', combination: 'मिश्रित', normal: 'सामान्य', all: '' }[userSkinType]
    : userSkinType;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 12,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: 'rgba(255,255,255,0.5)',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(224,120,86,0.05)',
          zIndex: 20,
        }}
      >
        {step !== 'search' && (
          <TouchableOpacity
            onPress={handleReset}
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'white',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, color: '#2D1810' }}>←</Text>
          </TouchableOpacity>
        )}
        <Text
          style={{
            flex: 1,
            fontFamily: hindi ? 'Hind_700Bold' : 'Fraunces_700Bold',
            fontSize: 18,
            color: '#2D1810',
          }}
        >
          {hindi ? 'प्रोडक्ट चेक' : 'Product Check'}
        </Text>
      </View>

      {step === 'search' && (
        <SearchStep
          hindi={hindi}
          skinTypeLabel={skinTypeLabel || ''}
          query={query}
          setQuery={setQuery}
          results={results}
          grouped={grouped}
          popular={popular}
          onSelect={handleSelectProduct}
          bottomPadding={insets.bottom + 80}
        />
      )}

      {step === 'analyzing' && selectedProduct && (
        <AnalyzingStep product={selectedProduct} hindi={hindi} />
      )}

      {step === 'results' && selectedProduct && (
        <ResultsStep
          product={selectedProduct}
          userSkinType={userSkinType}
          hindi={hindi}
          onReset={handleReset}
          bottomPadding={insets.bottom + 80}
        />
      )}
    </View>
  );
}

function SearchStep({
  hindi, skinTypeLabel, query, setQuery, results, grouped, popular, onSelect, bottomPadding,
}: {
  hindi: boolean; skinTypeLabel: string; query: string; setQuery: (q: string) => void;
  results: Product[]; grouped: Record<string, Product[]>; popular: Product[];
  onSelect: (p: Product) => void; bottomPadding: number;
}) {
  const isSearching = query.length >= 2;
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: bottomPadding }} keyboardShouldPersistTaps="handled">
      <Animated.View entering={FadeInDown.delay(0).springify()} style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 24, fontFamily: hindi ? 'Hind_700Bold' : 'Fraunces_700Bold', color: '#2D1810', marginBottom: 6, lineHeight: 32 }}>
          {hindi ? 'क्या ये आपकी त्वचा के लिए सही है?' : 'Is it right for your skin?'}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: hindi ? 'Hind_400Regular' : 'PlusJakartaSans_400Regular', color: 'rgba(45,24,16,0.55)' }}>
          {hindi ? `आपकी ${skinTypeLabel} त्वचा के अनुसार जांच करेंगे` : `Personalized for your ${skinTypeLabel} skin`}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).springify()} style={{ paddingHorizontal: 24, marginBottom: 16 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(224,120,86,0.1)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, shadowColor: '#2D1810', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
          <Text style={{ fontSize: 18, color: 'rgba(45,24,16,0.35)', marginRight: 10 }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={hindi ? 'प्रोडक्ट खोजें...' : 'Search products...'}
            placeholderTextColor="rgba(45,24,16,0.35)"
            style={{ flex: 1, paddingVertical: 14, fontSize: 15, fontFamily: hindi ? 'Hind_400Regular' : 'PlusJakartaSans_400Regular', color: '#2D1810' }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
              <Text style={{ fontSize: 18, color: 'rgba(45,24,16,0.3)' }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).springify()} style={{ paddingHorizontal: 24, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => Alert.alert(hindi ? 'जल्द आ रहा है' : 'Coming Soon', hindi ? 'बारकोड स्कैन जल्द उपलब्ध होगा' : 'Barcode scanning will be available soon')}
          activeOpacity={0.7}
          style={{ backgroundColor: 'rgba(224,120,86,0.05)', borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(224,120,86,0.25)', borderRadius: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          <Text style={{ fontSize: 20 }}>📷</Text>
          <Text style={{ fontFamily: hindi ? 'Hind_700Bold' : 'PlusJakartaSans_700Bold', fontSize: 14, color: '#E07856' }}>
            {hindi ? 'बारकोड स्कैन करें' : 'Scan Barcode'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={{ paddingHorizontal: 24 }}>
        {isSearching ? (
          <>
            <Text style={{ fontSize: 10, fontFamily: hindi ? 'Hind_700Bold' : 'PlusJakartaSans_700Bold', color: 'rgba(45,24,16,0.5)', textTransform: hindi ? 'none' : 'uppercase', letterSpacing: hindi ? 0 : 1.5, marginBottom: 12 }}>
              {hindi ? 'खोज परिणाम' : 'SEARCH RESULTS'}
            </Text>
            {results.length === 0 ? (
              <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(224,120,86,0.1)' }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
                <Text style={{ fontFamily: hindi ? 'Hind_400Regular' : 'PlusJakartaSans_400Regular', fontSize: 14, color: 'rgba(45,24,16,0.5)', textAlign: 'center' }}>
                  {hindi ? 'कोई प्रोडक्ट नहीं मिला' : 'No products found'}
                </Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {results.map((product, idx) => (
                  <ProductListItem key={product.id} product={product} index={idx} onSelect={onSelect} hindi={hindi} />
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={{ fontSize: 10, fontFamily: hindi ? 'Hind_700Bold' : 'PlusJakartaSans_700Bold', color: 'rgba(45,24,16,0.5)', textTransform: hindi ? 'none' : 'uppercase', letterSpacing: hindi ? 0 : 1.5, marginBottom: 12 }}>
              {hindi ? 'लोकप्रिय प्रोडक्ट' : 'POPULAR PRODUCTS'}
            </Text>
            <View style={{ gap: 10, marginBottom: 24 }}>
              {popular.map((product, idx) => (
                <ProductListItem key={product.id} product={product} index={idx} onSelect={onSelect} hindi={hindi} />
              ))}
            </View>
            {Object.entries(grouped).map(([category, items]) => (
              <View key={category} style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 10, fontFamily: hindi ? 'Hind_700Bold' : 'PlusJakartaSans_700Bold', color: 'rgba(45,24,16,0.5)', textTransform: hindi ? 'none' : 'uppercase', letterSpacing: hindi ? 0 : 1.5, marginBottom: 12 }}>
                  {CATEGORY_EMOJI[category as ProductCategory]} {hindi ? CATEGORY_LABEL[category as ProductCategory]?.hi : CATEGORY_LABEL[category as ProductCategory]?.en}
                </Text>
                <View style={{ gap: 10 }}>
                  {items.map((product, idx) => (
                    <ProductListItem key={product.id} product={product} index={idx} onSelect={onSelect} hindi={hindi} />
                  ))}
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

function ProductListItem({ product, index, onSelect, hindi }: { product: Product; index: number; onSelect: (p: Product) => void; hindi: boolean }) {
  const emoji = CATEGORY_EMOJI[product.category] || '🧴';
  const categoryLabel = hindi ? CATEGORY_LABEL[product.category]?.hi : CATEGORY_LABEL[product.category]?.en;
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={() => onSelect(product)}
        activeOpacity={0.85}
        style={{ backgroundColor: 'white', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: 'rgba(224,120,86,0.08)', shadowColor: '#2D1810', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}
      >
        <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: '#FFF5EE', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 28 }}>{emoji}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#2D1810', marginBottom: 3, lineHeight: 18 }} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={{ fontFamily: hindi ? 'Hind_400Regular' : 'PlusJakartaSans_400Regular', fontSize: 12, color: 'rgba(45,24,16,0.5)' }}>
            {categoryLabel} • {product.priceDisplay}
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: 'rgba(45,24,16,0.3)' }}>→</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function AnalyzingStep({ product, hindi }: { product: Product; hindi: boolean }) {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1200, easing: Easing.linear }), -1, false);
    pulse.value = withRepeat(withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [rotation, pulse]);
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const emoji = CATEGORY_EMOJI[product.category] || '🧴';
  return (
    <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <View style={{ width: 128, height: 128, alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
        <Animated.View style={[{ position: 'absolute', width: 128, height: 128, borderRadius: 64, borderWidth: 3, borderColor: 'rgba(224,120,86,0.2)' }, pulseStyle]} />
        <Animated.View style={[{ position: 'absolute', width: 128, height: 128, borderRadius: 64, borderWidth: 3, borderColor: 'transparent', borderTopColor: '#E07856' }, spinStyle]} />
        <Text style={{ fontSize: 52 }}>{emoji}</Text>
      </View>
      <Text style={{ fontFamily: hindi ? 'Hind_700Bold' : 'PlusJakartaSans_700Bold', fontSize: 18, color: '#2D1810', textAlign: 'center', marginBottom: 8 }}>
        {hindi ? 'आपकी त्वचा से मैच कर रहे हैं...' : 'Matching to your skin...'}
      </Text>
      <Text style={{ fontFamily: hindi ? 'Hind_400Regular' : 'PlusJakartaSans_400Regular', fontSize: 14, color: 'rgba(45,24,16,0.5)', textAlign: 'center' }}>
        {hindi ? `${product.keyIngredients.length} सामग्री का विश्लेषण` : `Analyzing ${product.keyIngredients.length} ingredients`}
      </Text>
    </Animated.View>
  );
}

function ResultsStep({ product, userSkinType, hindi, onReset, bottomPadding }: { product: Product; userSkinType: string; hindi: boolean; onReset: () => void; bottomPadding: number }) {
  const match = product.skinTypeMatch[userSkinType] || product.skinTypeMatch['all'];
  const config = SUITABILITY_CONFIG[match.suitability];
  const emoji = CATEGORY_EMOJI[product.category] || '🧴';
  const scoreWidth = useSharedValue(0);
  useEffect(() => { scoreWidth.value = withTiming(match.matchScore, { duration: 1000, easing: Easing.out(Easing.cubic) }); }, [match.matchScore, scoreWidth]);
  const barStyle = useAnimatedStyle(() => ({ width: `${scoreWidth.value}%` }));
  const improvements = hindi ? product.improvementsHi : product.improvementsEn;
  const warnings = hindi ? product.warningsHi : product.warningsEn;
  const suitLabel = hindi ? config.labelHi : config.labelEn;
  const skinLabel = hindi ? { oily: 'तैलीय', dry: 'रूखी', combination: 'मिश्रित', normal: 'सामान्य', all: '' }[userSkinType] : userSkinType;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: bottomPadding }}>
      {/* Verdict card */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={{ margin: 24 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(224,120,86,0.1)', shadowColor: '#2D1810', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 3 }}>
          <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: '#FFF5EE' }}>
            <View style={{ width: 60, height: 60, borderRadius: 16, backgroundColor: '#FFF5EE', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 34 }}>{emoji}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: '#2D1810', lineHeight: 20, marginBottom: 2 }}>{product.name}</Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: 'rgba(45,24,16,0.5)' }}>{product.brand} • {product.priceDisplay}</Text>
            </View>
          </View>
          <View style={{ backgroundColor: config.light, borderTopWidth: 1, borderBottomWidth: 1, borderColor: config.border, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: config.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, color: 'white' }}>{match.suitability === 'excellent' || match.suitability === 'good' ? '✓' : match.suitability === 'caution' ? '⚠' : '✕'}</Text>
            </View>
            <View>
              <Text style={{ fontFamily: hindi ? 'Hind_700Bold' : 'PlusJakartaSans_700Bold', fontSize: 15, color: config.text }}>{suitLabel}</Text>
              <Text style={{ fontFamily: hindi ? 'Hind_400Regular' : 'PlusJakartaSans_400Regular', fontSize: 12, color: 'rgba(45,24,16,0.5)' }}>
                {hindi ? `आपकी ${skinLabel} त्वचा के लिए` : `For your ${skinLabel} skin`}
              </Text>
            </View>
          </View>
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
              <Text style={{ fontSize: 10, fontFamily: hindi ? 'Hind_700Bold' : 'PlusJakartaSans_700Bold', color: 'rgba(45,24,16,0.5)', textTransform: hindi ? 'none' : 'uppercase', letterSpacing: hindi ? 0 : 1.5 }}>
                {hindi ? 'मैच स्कोर' : 'MATCH SCORE'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 26, color: '#2D1810' }}>{match.matchScore}</Text>
                <Text style={{ fontSize: 13, color: 'rgba(45,24,16,0.35)' }}>/100</Text>
              </View>
            </View>
            <View style={{ height: 10, backgroundColor: '#FFF5EE', borderRadius: 5, overflow: 'hidden' }}>
              <Animated.View style={[{ height: 10, backgroundColor: config.bg, borderRadius: 5 }, barStyle]} />
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Key Ingredients */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={{ paddingHorizontal: 24, marginBottom: 20 }}>
        <Text style={{ fontFamily: hindi ? 'Hind_700Bold' : 'Fraunces_700Bold', fontSize: 18, color: '#2D1810', marginBottom: 12 }}>
          {hindi ? 'मुख्य सामग्री' : 'Key Ingredients'}
        </Text>
        <View style={{ gap: 8 }}>
          {product.keyIngredients.map((ing, idx) => {
            const ratingBg = ing.rating === 'good' ? 'rgba(34,197,94,0.1)' : ing.rating === 'bad' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)';
            const ratingColor = ing.rating === 'good' ? '#22C55E' : ing.rating === 'bad' ? '#EF4444' : '#EAB308';
            const ratingIcon = ing.rating === 'good' ? '✓' : ing.rating === 'bad' ? '✕' : '⚠';
            return (
              <Animated.View key={idx} entering={FadeInDown.delay(150 + idx * 80).springify()} style={{ backgroundColor: 'white', borderRadius: 20, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 1, borderColor: 'rgba(224,120,86,0.08)' }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: ratingBg, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 14, color: ratingColor, fontWeight: '800' }}>{ratingIcon}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: hindi ? 'Hind_700Bold' : 'PlusJakartaSans_700Bold', fontSize: 14, color: '#2D1810', marginBottom: 2 }}>{hindi ? ing.nameHi : ing.name}</Text>
                  <Text style={{ fontFamily: hindi ? 'Hind_400Regular' : 'PlusJakartaSans_400Regular', fontSize: 12, color: 'rgba(45,24,16,0.55)', lineHeight: 18 }}>{hindi ? ing.benefitHi : ing.benefitEn}</Text>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>

      {/* Expected Improvements */}
      {improvements.length > 0 && (
        <Animated.View entering={FadeInDown.delay(250).springify()} style={{ paddingHorizontal: 24, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 18 }}>✨</Text>
            <Text style={{ fontFamily: hindi ? 'Hind_700Bold' : 'Fraunces_700Bold', fontSize: 18, color: '#2D1810' }}>{hindi ? 'अपेक्षित सुधार' : 'Expected Improvements'}</Text>
          </View>
          <View style={{ backgroundColor: '#FFF9F5', borderWidth: 1, borderColor: 'rgba(212,165,116,0.25)', borderRadius: 20, padding: 16, gap: 12 }}>
            {improvements.map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#E07856', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                  <Text style={{ fontSize: 11, color: 'white', fontWeight: '700' }}>{idx + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontFamily: hindi ? 'Hind_400Regular' : 'PlusJakartaSans_400Regular', fontSize: 14, color: '#2D1810', lineHeight: 22 }}>{item}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Timeline */}
      {product.expectedTimeline.length > 0 && (
        <Animated.View entering={FadeInDown.delay(350).springify()} style={{ paddingHorizontal: 24, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 18 }}>🕐</Text>
            <Text style={{ fontFamily: hindi ? 'Hind_700Bold' : 'Fraunces_700Bold', fontSize: 18, color: '#2D1810' }}>{hindi ? 'परिणाम कब दिखेंगे' : 'When to Expect Results'}</Text>
          </View>
          <View style={{ gap: 10 }}>
            {product.expectedTimeline.map((tl, idx) => (
              <View key={idx} style={{ backgroundColor: 'white', borderRadius: 20, padding: 16, flexDirection: 'row', gap: 14, borderWidth: 1, borderColor: 'rgba(224,120,86,0.08)' }}>
                <View style={{ width: 64 }}>
                  <Text style={{ fontFamily: hindi ? 'Hind_700Bold' : 'PlusJakartaSans_700Bold', fontSize: 13, color: '#E07856' }}>{hindi ? tl.weeksHi : tl.weeksEn}</Text>
                </View>
                <View style={{ flex: 1, borderLeftWidth: 2, borderLeftColor: 'rgba(224,120,86,0.15)', paddingLeft: 14 }}>
                  <Text style={{ fontFamily: hindi ? 'Hind_400Regular' : 'PlusJakartaSans_400Regular', fontSize: 13, color: 'rgba(45,24,16,0.7)', lineHeight: 20 }}>{hindi ? tl.resultHi : tl.resultEn}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Animated.View entering={FadeInDown.delay(450).springify()} style={{ paddingHorizontal: 24, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 18 }}>⚠️</Text>
            <Text style={{ fontFamily: hindi ? 'Hind_700Bold' : 'Fraunces_700Bold', fontSize: 18, color: '#2D1810' }}>{hindi ? 'ज़रूरी चेतावनी' : 'Important Warnings'}</Text>
          </View>
          <View style={{ backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FED7AA', borderRadius: 20, padding: 16, gap: 10 }}>
            {warnings.map((w, idx) => (
              <View key={idx} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 13, color: '#F97316', marginTop: 1 }}>⚠</Text>
                <Text style={{ flex: 1, fontFamily: hindi ? 'Hind_400Regular' : 'PlusJakartaSans_400Regular', fontSize: 13, color: '#9A3412', lineHeight: 20 }}>{w}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Check Another */}
      <Animated.View entering={FadeInDown.delay(500).springify()} style={{ paddingHorizontal: 24, marginTop: 8 }}>
        <TouchableOpacity
          onPress={onReset}
          activeOpacity={0.85}
          style={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'rgba(224,120,86,0.2)', borderRadius: 20, paddingVertical: 16, alignItems: 'center', shadowColor: '#2D1810', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}
        >
          <Text style={{ fontFamily: hindi ? 'Hind_700Bold' : 'PlusJakartaSans_700Bold', fontSize: 15, color: '#2D1810' }}>
            {hindi ? 'दूसरा प्रोडक्ट चेक करें' : 'Check Another Product'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}
