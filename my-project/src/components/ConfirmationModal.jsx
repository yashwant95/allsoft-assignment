import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { CheckCircleOutlined, CloseOutlined, ExclamationCircleOutlined, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Reusable Success Message component
 *
 * Props:
 * - open: boolean — controls visibility (for controlled usage)
 * - defaultOpen: boolean — initial visibility (for uncontrolled usage)
 * - title: string — headline text (default: "Success")
 * - description: string | ReactNode — extra info message
 * - onClose: () => void — called when dismissed
 * - autoHide: number | false — ms before auto close (default: 4000). Set to false to disable
 * - variant: 'inline' | 'toast' — layout style (default: 'inline')
 * - actions: ReactNode — optional action buttons (e.g., "View" / "Undo")
 * - className: string — extra tailwind classes
 */
export function SuccessMessage({
  open,
  defaultOpen = true,
  title = "Success",
  description,
  onClose,
  autoHide = 4000,
  variant = "inline",
  actions,
  className = "",
}) {
  const isControlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const visible = isControlled ? open : internalOpen;
  const timerRef = React.useRef(null);

  const close = React.useCallback(() => {
    if (!isControlled) setInternalOpen(false);
    onClose?.();
  }, [isControlled, onClose]);

  // ESC to close
  React.useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, close]);

  // Auto-hide
  React.useEffect(() => {
    if (!visible || autoHide === false) return;
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => close(), Number(autoHide));
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [visible, autoHide, close]);

  const containerClasses = React.useMemo(() => {
    const base = `relative w-full rounded-2xl border p-4 sm:p-5 shadow-sm bg-emerald-50/90 border-emerald-200 text-emerald-900 backdrop-blur`;
    return [base, className, variant === "inline" ? "" : "pointer-events-auto"].join(" ");
  }, [className, variant]);

  const content = (
    <div className="flex items-start gap-3">
      <div className="pt-0.5">
        <CheckCircleOutlined className="h-6 w-6 shrink-0" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold leading-6">{title}</h3>
        {description ? (
          <div className="mt-1 text-sm leading-6 text-emerald-800/90">{description}</div>
        ) : null}
        {actions ? <div className="mt-3 flex gap-2 flex-wrap">{actions}</div> : null}
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Dismiss"
        className="-m-1.5 rounded-xl p-1.5 hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <CloseOutlined className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );

  const motionProps = {
    initial: { opacity: 0, y: variant === "toast" ? 16 : 0, scale: variant === "inline" ? 0.98 : 1 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: variant === "toast" ? 12 : 0, scale: variant === "inline" ? 0.98 : 1 },
    transition: { type: "spring", stiffness: 260, damping: 22 },
  };

  return (
    <AnimatePresence>
      {visible ? (
        variant === "toast" ? (
          <div className="fixed inset-0 z-50 flex items-end sm:items-end justify-center sm:justify-end px-4 py-6 pointer-events-none">
            <motion.div
              role="status"
              aria-live="polite"
              className="max-w-sm w-full"
              {...motionProps}
            >
              <div className={containerClasses}>{content}</div>
            </motion.div>
          </div>
        ) : (
          <motion.div role="status" aria-live="polite" className={containerClasses} {...motionProps}>
            {content}
          </motion.div>
        )
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Confirmation Modal Component
 * 
 * Props:
 * - visible: boolean — controls modal visibility
 * - title: string — modal title
 * - content: string | ReactNode — modal content
 * - type: 'info' | 'warning' | 'danger' | 'success' — modal type
 * - onConfirm: () => void — called when confirmed
 * - onCancel: () => void — called when cancelled
 * - confirmText: string — confirm button text (default: "Confirm")
 * - cancelText: string — cancel button text (default: "Cancel")
 * - showSuccessMessage: boolean — whether to show success message after confirmation
 * - successTitle: string — success message title
 * - successDescription: string — success message description
 * - loading: boolean — loading state for confirm button
 */
const ConfirmationModal = ({
  visible = false,
  title = "Confirm Action",
  content = "Are you sure you want to proceed with this action?",
  type = "info",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showSuccessMessage = true,
  successTitle = "Action Completed",
  successDescription = "Your action has been completed successfully.",
  loading = false,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = async () => {
    try {
      if (onConfirm) {
        await onConfirm();
      }
      
      if (showSuccessMessage) {
        setShowSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      message.error('An error occurred while processing your request.');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <ExclamationCircleOutlined className="h-6 w-6 text-yellow-500" />;
      case 'danger':
        return <ExclamationCircleOutlined className="h-6 w-6 text-red-500" />;
      case 'success':
        return <CheckCircleOutlined className="h-6 w-6 text-green-500" />;
      default:
        return <InfoCircleOutlined className="h-6 w-6 text-blue-500" />;
    }
  };

  const getButtonType = () => {
    switch (type) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'success':
        return 'primary';
      default:
        return 'primary';
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            {getIcon()}
            <span>{title}</span>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {cancelText}
          </Button>,
          <Button
            key="confirm"
            type={getButtonType()}
            loading={loading}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>,
        ]}
        width={500}
        centered
        destroyOnClose
      >
        <div className="py-4">
          {typeof content === 'string' ? (
            <p className="text-gray-700 leading-relaxed">{content}</p>
          ) : (
            content
          )}
        </div>
      </Modal>

      {/* Success Message Toast */}
      <SuccessMessage
        variant="toast"
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successTitle}
        description={successDescription}
        autoHide={3000}
      />
    </>
  );
};

export default ConfirmationModal;
