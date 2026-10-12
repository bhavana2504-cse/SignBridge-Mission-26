import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Heart, 
  Clock, 
  Grid, 
  Filter, 
  SlidersHorizontal 
} from '../common/Icons';
import { SignCard } from '../common/SignCard';
import { signService } from '../../services/signService';
import { storageService } from '../../services/storageService';

export function DictionaryPage({ onSelectSign, onStartPractice }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'favorites' | 'recent'
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const categories = ['All', ...signService.getCategories()];

  const syncStorage = () => {
    setFavorites(storageService.getFavorites());
    setRecentlyViewed(storageService.getRecentlyViewed());
  };

  useEffect(() => {
    syncStorage();
    window.addEventListener(storageService.SYNC_EVENT, syncStorage);
    return () => {
      window.removeEventListener(storageService.SYNC_EVENT, syncStorage);
    };
  }, []);

  const [sortBy, setSortBy] = useState('default'); // 'default' | 'az' | 'za'

  const displayedSigns = useMemo(() => {
    // 1. Filter by view tab
    let pool = signService.getAllSigns();
    if (activeTab === 'favorites') {
      pool = pool.filter((s) => favorites.includes(s.id));
    } else if (activeTab === 'recent') {
      // Order strictly according to recent viewing history
      const recentIds = recentlyViewed;
      pool = recentIds
        .map((id) => signService.getSignById(id))
        .filter(Boolean);
    }

    // 2. Filter by category
    if (selectedCategory !== 'All') {
      pool = pool.filter((s) => s.category === selectedCategory);
    }

    // 3. Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      pool = pool.filter((item) => {
        const matchWord = item.word.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchTags = item.tags && item.tags.some((t) => t.toLowerCase().includes(q));
        const matchDesc = item.description && item.description.toLowerCase().includes(q);
        return matchWord || matchCategory || matchTags || matchDesc;
      });
    }

    // 4. Sort order
    if (sortBy === 'az') {
      return [...pool].sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortBy === 'za') {
      return [...pool].sort((a, b) => b.word.localeCompare(a.word));
    }

    return pool;
  }, [searchQuery, selectedCategory, activeTab, favorites, recentlyViewed, sortBy]);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="section-header">
        <span className="section-eyebrow">Searchable Lexicon</span>
        <h1 className="section-title">Sign Dictionary</h1>
        <p className="section-subtitle">
          Explore all 40 standardized Indian Sign Language vocabulary entries with instant search, category filters, and personal bookmarks.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="dict-search-bar" role="search">
        <Search size={22} color="var(--text-muted)" aria-hidden="true" />
        <input
          type="text"
          className="dict-search-input"
          placeholder="Search by word, meaning, or topic (e.g., 'Hospital', 'Eat', 'Thank you')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search signs"
        />
        {searchQuery && (
          <button
            type="button"
            className="icon-btn"
            style={{ width: '1.75rem', height: '1.75rem' }}
            onClick={() => setSearchQuery('')}
            aria-label="Clear search input"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Tab Navigation: All, Favorites, Recently Viewed */}
      <div className="dict-view-tabs" role="tablist" aria-label="Sign dictionary view filters">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'all'}
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Grid size={16} aria-hidden="true" />
          <span>All Vocabulary ({signService.getAllSigns().length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'favorites'}
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Heart size={16} aria-hidden="true" />
          <span>Favorites ({favorites.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'recent'}
          className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          <Clock size={16} aria-hidden="true" />
          <span>Recently Viewed ({recentlyViewed.length})</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="category-chips-row" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            aria-pressed={selectedCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing <strong>{displayedSigns.length}</strong> signs
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="dict-sort-select" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Sort:
          </label>
          <select
            id="dict-sort-select"
            className="speed-select"
            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-medium)', padding: '0.3rem 0.65rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort dictionary items"
          >
            <option value="default">Curriculum Order</option>
            <option value="az">Alphabetical (A → Z)</option>
            <option value="za">Alphabetical (Z → A)</option>
          </select>
        </div>
      </div>

      {/* Signs Grid */}
      {displayedSigns.length > 0 ? (
        <div className="cards-grid">
          {displayedSigns.map((sign) => (
            <SignCard
              key={sign.id}
              sign={sign}
              onSelectSign={onSelectSign}
              onStartPractice={onStartPractice}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <Search size={40} className="empty-state-icon" aria-hidden="true" />
          <h3 className="empty-state-title">No Matching Signs Found</h3>
          <p className="empty-state-desc">
            {activeTab === 'favorites'
              ? 'You have not added any signs to your favorites yet. Click the heart icon on any sign to save it here.'
              : activeTab === 'recent'
              ? 'You have not viewed any signs recently. Watch a video demonstration to see it listed here.'
              : `We couldn't find any signs matching "${searchQuery}". Try searching for words like "hello", "water", or "friend".`}
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
