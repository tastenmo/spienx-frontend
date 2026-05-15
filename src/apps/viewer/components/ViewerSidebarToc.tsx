import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AngleDownIcon from '@patternfly/react-icons/dist/esm/icons/angle-down-icon';
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon';
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon';
import EditIcon from '@patternfly/react-icons/dist/esm/icons/edit-icon';
import FileIcon from '@patternfly/react-icons/dist/esm/icons/file-icon';
import FolderIcon from '@patternfly/react-icons/dist/esm/icons/folder-icon';
import { useSelector } from 'react-redux';
import { ViewerRootState } from '../store/store';
import { BuildReadGetTableOfContentsResponse } from '../../../proto/documents';
import './ViewerSidebarToc.css';

type TocTreeNode = BuildReadGetTableOfContentsResponse & {
  nodeKey: string;
  children: TocTreeNode[];
};

type PageNode = {
  pagePath: string;
  title: string;
  canOpenSource: boolean;
  canEdit: boolean;
  sourcePath: string;
  startLine: number;
  endLine: number;
  children: TocTreeNode[];
};

const HIDDEN_PAGE_PATHS = new Set(['genindex', 'search']);

const normalizeTitle = (value: string): string => value.trim().toLowerCase();

const sortByOrder = <T extends { orderIndex: number }>(items: T[]): T[] => {
  return [...items].sort((a, b) => a.orderIndex - b.orderIndex);
};

const buildPageNodes = (
  toc: BuildReadGetTableOfContentsResponse[],
  pageTitles: Map<string, string>
): PageNode[] => {
  const deduped = new Map<string, BuildReadGetTableOfContentsResponse>();
  toc.forEach((entry) => {
    if (!entry.pagePath) {
      return;
    }
    if (HIDDEN_PAGE_PATHS.has(entry.pagePath)) {
      return;
    }
    const key = `${entry.pagePath}|${entry.hash}|${entry.title}`;
    if (!deduped.has(key)) {
      deduped.set(key, entry);
    }
  });

  const grouped = new Map<string, BuildReadGetTableOfContentsResponse[]>();
  deduped.forEach((entry) => {
    const list = grouped.get(entry.pagePath) || [];
    list.push(entry);
    grouped.set(entry.pagePath, list);
  });

  const pageNodes: PageNode[] = [];

  grouped.forEach((entries, pagePath) => {
    const sortedEntries = sortByOrder(entries);
    const pageEntry = sortedEntries.find((entry) => !entry.hash);
    const sectionEntries = sortedEntries.filter((entry) => Boolean(entry.hash));

    const byHash = new Map<string, TocTreeNode>();
    sectionEntries.forEach((entry) => {
      const nodeKey = `${entry.pagePath}#${entry.hash}`;
      byHash.set(entry.hash, {
        ...entry,
        nodeKey,
        children: [],
      });
    });

    const rootSections: TocTreeNode[] = [];
    sectionEntries.forEach((entry) => {
      const node = byHash.get(entry.hash);
      if (!node) {
        return;
      }

      if (entry.parentHash && byHash.has(entry.parentHash)) {
        byHash.get(entry.parentHash)?.children.push(node);
      } else {
        rootSections.push(node);
      }
    });

    const sortTree = (nodes: TocTreeNode[]) => {
      const sortedNodes = sortByOrder(nodes);
      sortedNodes.forEach((node) => {
        node.children = sortByOrder(node.children);
        sortTree(node.children);
      });
      return sortedNodes;
    };

    pageNodes.push({
      pagePath,
      title: pageEntry?.title || pageTitles.get(pagePath) || pagePath,
      canOpenSource: Boolean(pageEntry?.canOpenSource),
      canEdit: Boolean(pageEntry?.canEdit),
      sourcePath: pageEntry?.sourcePath || '',
      startLine: pageEntry?.startLine || 0,
      endLine: pageEntry?.endLine || 0,
      children: sortTree(rootSections),
    });
  });

  const cleanedNodes = pageNodes.map((page) => {
    const dedupedChildren = page.children.filter((child) => normalizeTitle(child.title) !== normalizeTitle(page.title));
    return {
      ...page,
      children: dedupedChildren,
    };
  });

  const indexPage = cleanedNodes.find((page) => page.pagePath === 'index');
  const nonIndexPages = cleanedNodes.filter((page) => page.pagePath !== 'index');

  if (!indexPage) {
    return nonIndexPages.sort((a, b) => a.title.localeCompare(b.title));
  }

  const nonIndexByTitle = new Map<string, PageNode>();
  nonIndexPages.forEach((page) => nonIndexByTitle.set(normalizeTitle(page.title), page));

  const orderedFromIndex: PageNode[] = [];
  const usedPaths = new Set<string>();
  indexPage.children.forEach((section) => {
    const mappedPage = nonIndexByTitle.get(normalizeTitle(section.title));
    if (mappedPage && !usedPaths.has(mappedPage.pagePath)) {
      orderedFromIndex.push(mappedPage);
      usedPaths.add(mappedPage.pagePath);
    }
  });

  const remainingPages = nonIndexPages
    .filter((page) => !usedPaths.has(page.pagePath))
    .sort((a, b) => a.title.localeCompare(b.title));

  return [...orderedFromIndex, ...remainingPages];
};

const ViewerSidebarToc: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toc, pages } = useSelector((state: ViewerRootState) => state.documents.current);

  const documentRoute = React.useMemo(() => {
    const match = location.pathname.match(/^\/documents\/([^/]+)(?:\/(.*))?$/);
    if (!match) {
      return null;
    }

    return {
      id: match[1],
      pagePath: (match[2] || '').replace(/^\//, '').replace(/\/$/, ''),
    };
  }, [location.pathname]);

  const pageTitles = React.useMemo(() => {
    const mapping = new Map<string, string>();
    pages.forEach((page) => mapping.set(page.path, page.title));
    return mapping;
  }, [pages]);

  const sectionAnchorByHash = React.useMemo(() => {
    const mapping = new Map<string, Map<string, string>>();

    pages.forEach((page) => {
      const sectionMap = new Map<string, string>();
      page.sections.forEach((section) => {
        if (section.hash) {
          sectionMap.set(section.hash, section.sphinxId || section.hash);
        }
      });
      mapping.set(page.path, sectionMap);
    });

    return mapping;
  }, [pages]);

  const pageNodes = React.useMemo(() => buildPageNodes(toc, pageTitles), [toc, pageTitles]);

  const [collapsedPages, setCollapsedPages] = React.useState<Record<string, boolean>>({});
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});

  const activePath = documentRoute?.pagePath || '';

  const activeHash = location.hash.replace(/^#/, '');

  const resolveAnchor = React.useCallback((pagePath: string, hash?: string) => {
    if (!hash) {
      return '';
    }

    return sectionAnchorByHash.get(pagePath)?.get(hash) || hash;
  }, [sectionAnchorByHash]);

  React.useEffect(() => {
    if (!activePath) {
      return;
    }
    setCollapsedPages((prev) => ({ ...prev, [activePath]: false }));
  }, [activePath]);

  const togglePage = (pagePath: string) => {
    setCollapsedPages((prev) => ({ ...prev, [pagePath]: !prev[pagePath] }));
  };

  const toggleSection = (nodeKey: string) => {
    setCollapsedSections((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }));
  };

  const navigateTo = (pagePath: string, hash?: string) => {
    if (!documentRoute?.id) {
      return;
    }
    const cleanPath = pagePath.replace(/^\//, '').replace(/\/$/, '');
    const anchor = resolveAnchor(cleanPath, hash);
    const hashPart = anchor ? `#${anchor}` : '';
    navigate(`/documents/${documentRoute.id}/${cleanPath}${hashPart}`);
  };

  const openSource = (entry: { title: string; sourcePath: string; startLine: number; endLine: number; canOpenSource: boolean }) => {
    if (!entry.canOpenSource) {
      return;
    }

    console.info('Open source requested for TOC entry:', {
      title: entry.title,
      path: entry.sourcePath,
      startLine: entry.startLine,
      endLine: entry.endLine,
    });
  };

  const editSource = (entry: { title: string; sourcePath: string; startLine: number; endLine: number; canEdit: boolean }) => {
    if (!entry.canEdit) {
      return;
    }

    console.info('Edit requested for TOC entry:', {
      title: entry.title,
      path: entry.sourcePath,
      startLine: entry.startLine,
      endLine: entry.endLine,
    });
  };

  const renderNode = (node: TocTreeNode, depth: number) => {
    const isCollapsed = collapsedSections[node.nodeKey] ?? false;
    const hasChildren = node.children.length > 0;
    const resolvedAnchor = resolveAnchor(node.pagePath, node.hash);
    const isActive = node.pagePath === activePath && (node.hash === activeHash || resolvedAnchor === activeHash);

    return (
      <li key={node.nodeKey} className={`viewer-sidebar-toc__item ${isActive ? 'is-active' : ''}`}>
        <div className="viewer-sidebar-toc__row" style={{ paddingLeft: `${depth * 12}px` }}>
          <button
            type="button"
            className="viewer-sidebar-toc__toggle"
            disabled={!hasChildren}
            onClick={() => hasChildren && toggleSection(node.nodeKey)}
            aria-label={hasChildren ? (isCollapsed ? 'Expand section' : 'Collapse section') : 'Leaf section'}
          >
            {hasChildren ? (isCollapsed ? <AngleRightIcon /> : <AngleDownIcon />) : <span className="viewer-sidebar-toc__dot" />}
          </button>

          <button
            type="button"
            className="viewer-sidebar-toc__label"
            onClick={() => navigateTo(node.pagePath, node.hash)}
            title={node.title}
          >
            {node.title}
          </button>

          <div className="viewer-sidebar-toc__actions">
            <button
              type="button"
              className="viewer-sidebar-toc__icon-btn"
              onClick={() => openSource(node)}
              disabled={!node.canOpenSource}
              title="Open source"
              aria-label="Open source"
            >
              <CodeIcon />
            </button>
            <button
              type="button"
              className="viewer-sidebar-toc__icon-btn"
              onClick={() => editSource(node)}
              disabled={!node.canEdit}
              title="Edit source"
              aria-label="Edit source"
            >
              <EditIcon />
            </button>
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <ul className="viewer-sidebar-toc__list">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  const indexPage = React.useMemo(() => pages.find((page) => page.path === 'index'), [pages]);
  const tocTitle = indexPage?.title || 'Contents';

  if (!documentRoute?.id || pageNodes.length === 0) {
    return null;
  }

  return (
    <section className="viewer-sidebar-toc" aria-label="Document table of contents">
      <div className="viewer-sidebar-toc__title">{tocTitle}</div>
      <ul className="viewer-sidebar-toc__list">
        {pageNodes.map((page) => {
          const isCollapsed = collapsedPages[page.pagePath] ?? page.pagePath !== activePath;
          const isPageActive = page.pagePath === activePath;

          return (
            <li key={page.pagePath} className={`viewer-sidebar-toc__item viewer-sidebar-toc__page ${isPageActive ? 'is-active' : ''}`}>
              <div className="viewer-sidebar-toc__row">
                <button
                  type="button"
                  className="viewer-sidebar-toc__toggle"
                  onClick={() => togglePage(page.pagePath)}
                  aria-label={isCollapsed ? 'Expand page' : 'Collapse page'}
                >
                  {isCollapsed ? <AngleRightIcon /> : <AngleDownIcon />}
                </button>

                <button
                  type="button"
                  className="viewer-sidebar-toc__label viewer-sidebar-toc__page-label"
                  onClick={() => navigateTo(page.pagePath)}
                  title={page.title}
                >
                  <FolderIcon className="viewer-sidebar-toc__page-icon" />
                  {page.title}
                </button>

                <div className="viewer-sidebar-toc__actions">
                  <button
                    type="button"
                    className="viewer-sidebar-toc__icon-btn"
                    onClick={() => openSource(page)}
                    disabled={!page.canOpenSource}
                    title="Open source"
                    aria-label="Open source"
                  >
                    <CodeIcon />
                  </button>
                  <button
                    type="button"
                    className="viewer-sidebar-toc__icon-btn"
                    onClick={() => editSource(page)}
                    disabled={!page.canEdit}
                    title="Edit source"
                    aria-label="Edit source"
                  >
                    <EditIcon />
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <ul className="viewer-sidebar-toc__list">
                  {page.children.length > 0 ? (
                    page.children.map((child) => renderNode(child, 1))
                  ) : (
                    <li className="viewer-sidebar-toc__empty">
                      <span className="viewer-sidebar-toc__empty-icon"><FileIcon /></span>
                      No sections
                    </li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ViewerSidebarToc;
