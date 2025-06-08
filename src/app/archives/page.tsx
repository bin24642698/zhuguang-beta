'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Work, Archive } from '@/data';
import { getAllWorks, getArchivesByWorkId, getAllArchives, addArchive, updateArchive, deleteArchive } from '@/data';
import ArchiveFilters from '@/components/archives/ArchiveFilters';
import ArchiveList from '@/components/archives/ArchiveList';
import ArchiveContent from '@/components/archives/ArchiveContent';
import EmptyArchiveState from '@/components/archives/EmptyArchiveState';
import DeleteConfirmDialog from '@/components/archives/DeleteConfirmDialog';

/**
 * 档案馆页面 - 新版
 */

export default function ArchivesPage() {
  const router = useRouter();

  // 基础状态
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 作品相关状态
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);

  // 分类状态
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 档案相关状态
  const [archives, setArchives] = useState<Archive[]>([]);
  const [selectedArchive, setSelectedArchive] = useState<Archive | null>(null);
  const [editedArchive, setEditedArchive] = useState<Archive | null>(null);
  const [newTagInput, setNewTagInput] = useState('');

  // 删除确认弹窗状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [archiveToDelete, setArchiveToDelete] = useState<Archive | null>(null);

  // 加载作品列表
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const allWorks = await getAllWorks();
        setWorks(allWorks);

        // 默认选择第一个作品
        if (allWorks.length > 0 && !selectedWorkId) {
          setSelectedWorkId(allWorks[0].id || 0);
        }
      } catch (error) {
        console.error('获取作品失败:', error);
        setError('获取作品列表失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, []);

  // 当选中的作品变化时，加载该作品的档案
  useEffect(() => {
    const fetchArchives = async () => {
      if (!selectedWorkId) return;

      // 加载选中作品的档案
      try {
        const workArchives = await getArchivesByWorkId(selectedWorkId);
        setArchives(workArchives);
        // 默认选中第一个档案
        if (workArchives.length > 0) {
          setSelectedArchive(workArchives[0]);
          setEditedArchive(workArchives[0]);
        } else {
          setSelectedArchive(null);
          setEditedArchive(null);
        }
      } catch (error) {
        console.error(`获取作品ID为${selectedWorkId}的档案失败:`, error);
        setError('获取档案失败，请稍后再试');
      }
    };

    fetchArchives();
    // 当作品变化时，重置分类选择
    setSelectedCategory(null);
  }, [selectedWorkId]);

  // 当分类变化时，重置选中的档案
  useEffect(() => {
    if (selectedCategory !== null) {
      setSelectedArchive(null);
      setEditedArchive(null);
    }
  }, [selectedCategory]);

  // 当选中的档案变化时，更新编辑状态
  useEffect(() => {
    if (selectedArchive) {
      setEditedArchive(selectedArchive);
    } else {
      setEditedArchive(null);
    }
  }, [selectedArchive]);

  // 处理档案编辑
  const handleArchiveEdit = (field: keyof Archive, value: any) => {
    if (!editedArchive) return;

    // 不允许修改分类
    if (field === 'category') return;

    setEditedArchive({
      ...editedArchive,
      [field]: value,
      updatedAt: new Date()
    });
  };

  // 自动保存档案 - 使用防抖
  useEffect(() => {
    if (!editedArchive || !selectedArchive || editedArchive.id !== selectedArchive.id) return;

    const saveTimer = setTimeout(() => {
      handleSaveArchive();
    }, 2000); // 2秒后自动保存

    return () => clearTimeout(saveTimer);
  }, [editedArchive]);

  // 保存档案
  const handleSaveArchive = async () => {
    if (!editedArchive || !editedArchive.id) return;

    setIsSaving(true);
    try {
      await updateArchive(editedArchive);

      // 更新档案列表
      if (selectedWorkId) {
        const workArchives = await getArchivesByWorkId(selectedWorkId);
        setArchives(workArchives);
      }

      // 更新选中的档案
      setSelectedArchive(editedArchive);
      setError(null);
    } catch (error) {
      console.error('保存档案失败:', error);
      setError('保存档案失败，请稍后再试');
    } finally {
      setIsSaving(false);
    }
  };

  // 创建新档案
  const handleCreateArchive = async () => {
    // 如果没有选择特定作品或特定分类，不允许创建
    if (!selectedWorkId || selectedCategory === null) return;

    try {
      const newArchive: Omit<Archive, 'id'> = {
        title: '新档案',
        content: '',
        category: selectedCategory, // 使用选中的分类
        workId: selectedWorkId, // 使用选中的作品ID
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const createdArchive = await addArchive(newArchive);

      // 重新加载档案列表
      if (selectedWorkId) {
        const workArchives = await getArchivesByWorkId(selectedWorkId);
        setArchives(workArchives);
      }

      // 选中新创建的档案
      setSelectedArchive(createdArchive);
      setEditedArchive(createdArchive);
    } catch (error) {
      console.error('创建档案失败:', error);
      setError('创建档案失败，请稍后再试');
    }
  };

  // 删除档案
  const handleDeleteArchive = async () => {
    if (!selectedArchive || !selectedArchive.id) return;

    try {
      await deleteArchive(selectedArchive.id);

      // 重新加载档案列表
      if (selectedWorkId) {
        const workArchives = await getArchivesByWorkId(selectedWorkId);
        setArchives(workArchives);
      }

      // 清除选中的档案
      setSelectedArchive(null);
      setEditedArchive(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('删除档案失败:', error);
      setError('删除档案失败，请稍后再试');
    }
  };

  // 添加标签 - 已移动到ArchiveContent组件，但保留以兼容原有代码
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagInput.trim() && editedArchive) {
      const newTags = [...(editedArchive.tags || []), newTagInput.trim()];
      handleArchiveEdit('tags', newTags);
      setNewTagInput('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagIndex: number) => {
    if (!editedArchive || !editedArchive.tags) return;

    const newTags = [...editedArchive.tags];
    newTags.splice(tagIndex, 1);
    handleArchiveEdit('tags', newTags);
  };

  // 处理编辑标题 - 接收更新后的档案对象
  const handleEditTitle = async (updatedArchive: Archive) => {
    if (!updatedArchive.id) return;

    try {
      console.log("[handleEditTitle] 更新档案标题:", updatedArchive.title);

      // 更新标题
      const savedArchive = await updateArchive(updatedArchive);

      // 重新加载档案列表
      if (selectedWorkId) {
        const workArchives = await getArchivesByWorkId(selectedWorkId);
        setArchives(workArchives);
      }

      // 如果当前选中的是被编辑的档案，更新选中状态
      if (selectedArchive?.id === updatedArchive.id) {
        setSelectedArchive(savedArchive);
        setEditedArchive(savedArchive);
      }
    } catch (error) {
      console.error('更新档案标题失败:', error);
    }
  };

  // 处理从列表中删除档案
  const handleDeleteFromList = (archive: Archive) => {
    if (!archive.id) return;

    // 显示删除确认弹窗
    setArchiveToDelete(archive);
    setShowDeleteConfirm(true);
  };

  // 确认删除档案
  const confirmDelete = async () => {
    if (!archiveToDelete || !archiveToDelete.id) return;

    try {
      await deleteArchive(archiveToDelete.id);

      // 重新加载档案列表
      if (selectedWorkId) {
        const workArchives = await getArchivesByWorkId(selectedWorkId);
        setArchives(workArchives);
      }

      // 如果当前选中的是被删除的档案，清除选中状态
      if (selectedArchive?.id === archiveToDelete.id) {
        setSelectedArchive(null);
        setEditedArchive(null);
      }

      // 关闭弹窗
      setShowDeleteConfirm(false);
      setArchiveToDelete(null);
    } catch (error) {
      console.error('删除档案失败:', error);
    }
  };

  // 取消删除
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setArchiveToDelete(null);
  };

  // 不再需要过滤作品列表，因为我们使用下拉菜单选择作品

  // 过滤档案列表
  const filteredArchives = archives.filter(archive =>
    // 分类过滤
    (selectedCategory === null || archive.category === selectedCategory) &&
    // 搜索过滤
    (searchTerm === '' ||
     archive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     archive.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (archive.tags && archive.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))))
  );

  return (
    <div className="flex h-screen bg-bg-color animate-fadeIn overflow-hidden">
      {/* 背景网格 */}
      <div className="grid-background"></div>

      {/* 装饰元素 */}
      <div className="dot hidden md:block" style={{ top: "120px", left: "15%" }}></div>
      <div className="dot" style={{ bottom: "80px", right: "20%" }}></div>
      <div className="dot hidden md:block" style={{ top: "30%", right: "25%" }}></div>
      <div className="dot hidden md:block" style={{ bottom: "40%", left: "30%" }}></div>

      <svg className="wave hidden md:block" style={{ bottom: "20px", left: "10%" }} width="100" height="20" viewBox="0 0 100 20">
        <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="var(--accent-brown)" strokeWidth="2" />
      </svg>

      {/* 左侧导航栏 */}
      <Sidebar activeMenu="archives" />

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden main-content-area">
        {/* 顶部导航栏 */}
        <TopBar
          title="档案馆"
          isHomePage={false}
          showBackButton={true}
        />

        {/* 主要内容区 - 使用大卡片包裹整个内容 */}
        <div className="p-4 md:p-6" style={{ maxHeight: "calc(100vh - 80px)", height: "calc(100vh - 80px)" }}>
          <div className="ghibli-card h-full p-0 flex flex-col relative overflow-hidden">
            <div className="tape -rotate-2 -left-2 -top-2" style={{ backgroundColor: 'rgba(125,133,204,0.7)' }}>
              <div className="tape-texture"></div>
            </div>

            {/* 档案馆主内容区 - 两栏布局 */}
            <div className="flex-1 flex overflow-hidden">
              {/* 左侧栏 - 档案列表 */}
              <div className="w-96 border-r border-[rgba(125,133,204,0.2)] flex flex-col overflow-hidden bg-white animate-slideIn">
                <ArchiveFilters
                  works={works}
                  selectedWorkId={selectedWorkId}
                  selectedCategory={selectedCategory}
                  archivesCount={filteredArchives.length}
                  searchTerm={searchTerm}
                  onWorkChange={setSelectedWorkId}
                  onCategoryChange={setSelectedCategory}
                  onSearchChange={setSearchTerm}
                />

                <div className="px-4 py-3 border-b border-[rgba(125,133,204,0.1)] bg-[rgba(125,133,204,0.03)] flex justify-between items-center">
                  <h3 className="text-lg font-medium text-text-dark flex items-center font-ma-shan">
                    <span className="material-icons text-[#7D85CC] mr-2">folder_special</span>
                    档案列表
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      className={`px-3 py-1.5 rounded-full flex items-center shadow-sm text-sm ${
                        !selectedWorkId || selectedCategory === null
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#7D85CC] text-white hover:bg-[#6b73b3] transition-colors duration-200'
                      }`}
                      onClick={handleCreateArchive}
                      disabled={!selectedWorkId || selectedCategory === null}
                    >
                      <span className="material-icons text-sm mr-1">add</span>
                      新建档案
                    </button>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="搜索档案..."
                        className="pl-8 pr-3 py-1.5 bg-white border border-[rgba(125,133,204,0.2)] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#7D85CC] w-32"
                      />
                      <span className="material-icons text-text-light text-sm absolute left-2 top-1.5">search</span>
                    </div>
                  </div>
                </div>



                <ArchiveList
                  archives={filteredArchives}
                  selectedArchive={selectedArchive}
                  isLoading={isLoading}
                  selectedWorkId={selectedWorkId}
                  selectedCategory={selectedCategory}
                  onArchiveSelect={setSelectedArchive}
                  onCreateArchive={handleCreateArchive}
                  onEditTitle={handleEditTitle}
                  onDeleteArchive={handleDeleteFromList}
                />

              </div>

              {/* 右侧栏 - 档案内容编辑区 */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white animate-fadeIn">
                {editedArchive ? (
                  <ArchiveContent
                    archive={editedArchive}
                    isSaving={isSaving}
                    onTitleChange={(title) => handleArchiveEdit('title', title)}
                    onContentChange={(content) => handleArchiveEdit('content', content)}
                    onAddTag={(tag) => {
                      const newTags = [...(editedArchive.tags || []), tag];
                      handleArchiveEdit('tags', newTags);
                    }}
                    onRemoveTag={handleRemoveTag}
                  />
                ) : (
                  <EmptyArchiveState
                    selectedWorkId={selectedWorkId}
                    selectedCategory={selectedCategory}
                    onCreateArchive={handleCreateArchive}
                  />
                )}
              </div>
            </div>
            <div className="page-curl"></div>
          </div>
        </div>
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && archiveToDelete && (
        <DeleteConfirmDialog
          title={archiveToDelete.title}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
